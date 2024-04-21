CLASS zcl_api_req_handler DEFINITION
  PUBLIC
  INHERITING FROM cl_rest_resource FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS if_rest_resource~get  REDEFINITION.
    METHODS if_rest_resource~post REDEFINITION.

    CONSTANTS mc_method_level_instance  TYPE seomtddecl VALUE '0'.
    CONSTANTS mc_response_state_error   TYPE char1      VALUE 'E'.
    CONSTANTS mc_response_state_warning TYPE char1      VALUE 'W'.
    CONSTANTS mc_response_state_success TYPE char1      VALUE 'S'.

    TYPES: BEGIN OF mty_s_response,
             data    TYPE abap_parmbind_tab,
             state   TYPE char1,
             message TYPE string,
           END OF mty_s_response.

  PROTECTED SECTION.

  PRIVATE SECTION.
    DATA m_classname     TYPE seoclname.
    DATA mo_class        TYPE REF TO object.
    DATA m_method        TYPE seomtdname.
    DATA mt_method_param TYPE abap_parmbind_tab.

    METHODS check_request_data
      IMPORTING is_req TYPE zapi_s_request
      RAISING   zcx_api.

    METHODS call_class_method
      RAISING zcx_api.

    METHODS handle_request.

ENDCLASS.


CLASS zcl_api_req_handler IMPLEMENTATION.
  METHOD check_request_data.
    DATA lo_class     TYPE REF TO cl_abap_classdescr.
    DATA ls_method    TYPE vseomethod.
    DATA ls_param     TYPE abap_parmbind.
    DATA ls_param_def TYPE vseoparam.

    FIELD-SYMBOLS <l_value> TYPE any.

    CLEAR: m_classname,
           m_method,
           mo_class,
           mt_method_param.

    " ---------------------------------------------------------------------
    " . Check class
    " ---------------------------------------------------------------------
    IF is_req-classname IS INITIAL.

      " . // Class name is required
      RAISE EXCEPTION TYPE zcx_api MESSAGE e001.

    ENDIF.

    cl_abap_objectdescr=>describe_by_name( EXPORTING  p_name         = is_req-classname
                                           RECEIVING  p_descr_ref    = DATA(lo_ref)
                                           EXCEPTIONS type_not_found = 1 ).

    IF sy-subrc = 0.

      lo_class ?= lo_ref.

    ENDIF.

    IF lo_class IS NOT BOUND.

      " . // Class &1 not found
      RAISE EXCEPTION TYPE zcx_api MESSAGE e005 WITH is_req-classname.

    ENDIF.

    IF lo_class->class_kind = lo_class->classkind_abstract.

      " . // Abstract classes are not allowed
      RAISE EXCEPTION TYPE zcx_api MESSAGE e002.

    ENDIF.

    m_classname = lo_class->get_relative_name( ).

    " ---------------------------------------------------------------------
    " . Check method of the class
    " ---------------------------------------------------------------------
    READ TABLE lo_class->methods REFERENCE INTO DATA(lr_method)
         WITH KEY name = to_upper( is_req-method ).

    IF sy-subrc <> 0.

      " . // Method &1 does not exist in class &2
      RAISE EXCEPTION TYPE zcx_api MESSAGE e003 WITH is_req-method is_req-classname.

    ENDIF.

    m_method = lr_method->name.

    IF lr_method->visibility <> cl_abap_classdescr=>public. " . public?

      " . // Method &1 is not public
      RAISE EXCEPTION TYPE zcx_api MESSAGE e004 WITH m_method.

    ENDIF.

    CALL FUNCTION 'SEO_METHOD_GET_DETAIL'
      EXPORTING  cpdkey       = VALUE seocpdkey( clsname = m_classname
                                                 cpdname = m_method )
      IMPORTING  method       = ls_method
      EXCEPTIONS not_existing = 1
                 no_method    = 2
                 OTHERS       = 3.

    IF sy-subrc <> 0.

      " . unexpected error
      RAISE EXCEPTION TYPE zcx_api MESSAGE ID sy-msgid TYPE sy-msgty NUMBER sy-msgno
            WITH sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4.

    ENDIF.

    IF ls_method-mtdtype = mc_method_level_instance. " . instance or static?

      TRY.

          " . Create an instance of the class, because the method level is instance method
          CREATE OBJECT mo_class TYPE (m_classname).

        CATCH cx_root INTO DATA(lo_ex).

          " . unexpected error
          RAISE EXCEPTION NEW zcx_api( previous = lo_ex ).

      ENDTRY.

    ENDIF.

    DATA(lt_param_in) = is_req-paramtab.

    LOOP AT lt_param_in REFERENCE INTO DATA(lr_param_in).

      " . convert name to be always upper case. Names from
      " . class description from type describer are always upper case
      lr_param_in->name = to_upper( lr_param_in->name ).

    ENDLOOP.

    " ---------------------------------------------------------------------
    " . Check and build parameter tab
    " ---------------------------------------------------------------------
    LOOP AT lr_method->parameters REFERENCE INTO DATA(lr_method_parameters).

      CLEAR: ls_param,
             ls_param_def.

      ls_param-name = lr_method_parameters->name.

      CASE lr_method_parameters->parm_kind.
        WHEN cl_abap_classdescr=>importing.
          ls_param-kind = cl_abap_classdescr=>exporting.
        WHEN cl_abap_classdescr=>exporting.
          ls_param-kind = cl_abap_classdescr=>importing.
        WHEN OTHERS.
          ls_param-kind = lr_method_parameters->parm_kind.
      ENDCASE.

      CALL FUNCTION 'SEO_PARAMETER_GET'
        EXPORTING  parkey       = VALUE seoscokey( clsname = m_classname
                                                   cmpname = m_method
                                                   sconame = ls_param-name )
        IMPORTING  parameter    = ls_param_def
        EXCEPTIONS not_existing = 1
                   deleted      = 2
                   is_exception = 3
                   OTHERS       = 4.

      IF sy-subrc <> 0.

        RAISE EXCEPTION TYPE zcx_api MESSAGE ID sy-msgid TYPE sy-msgty NUMBER sy-msgno
              WITH sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4.

      ENDIF.

      CREATE DATA ls_param-value TYPE (ls_param_def-type).

      READ TABLE lt_param_in REFERENCE INTO DATA(lr_param)
           WITH KEY name = lr_method_parameters->name.

      IF sy-subrc = 0.

        ASSIGN ls_param-value->* TO <l_value>.

        CASE cl_abap_typedescr=>describe_by_name( ls_param_def-type  )->kind.
          WHEN cl_abap_classdescr=>kind_elem.

            <l_value> = lr_param->data.

          WHEN cl_abap_classdescr=>kind_struct OR cl_abap_classdescr=>kind_table.

            " . convert from JSON string
            /ui2/cl_json=>deserialize( EXPORTING json = lr_param->data
                                       CHANGING  data = <l_value> ).

        ENDCASE.

      ENDIF.

      INSERT ls_param INTO TABLE mt_method_param.

    ENDLOOP.
  ENDMETHOD.

  METHOD if_rest_resource~get.
    handle_request( ).
  ENDMETHOD.

  METHOD if_rest_resource~post.
    handle_request( ).
  ENDMETHOD.

  METHOD call_class_method.
    DATA lo_ex TYPE REF TO cx_root.

    IF mo_class IS BOUND.

      " . method is instance

      TRY.

          CALL METHOD mo_class->(m_method) PARAMETER-TABLE mt_method_param.

        CATCH cx_root INTO lo_ex.

          RAISE EXCEPTION NEW zcx_api( previous = lo_ex ).

      ENDTRY.

    ELSE.

      " . method is static

      TRY.

          CALL METHOD (m_classname)=>(m_method) PARAMETER-TABLE mt_method_param.

        CATCH cx_root INTO lo_ex.

          RAISE EXCEPTION NEW zcx_api( previous = lo_ex ).

      ENDTRY.

    ENDIF.

    LOOP AT mt_method_param REFERENCE INTO DATA(lr_param)
         WHERE     kind <> cl_abap_classdescr=>importing
               AND kind <> cl_abap_classdescr=>changing
               AND kind <> cl_abap_classdescr=>returning. " . receiving is also 'R'

      " . We remove importing parameters
      DELETE mt_method_param WHERE name = lr_param->name.

    ENDLOOP.
  ENDMETHOD.

  METHOD handle_request.
    DATA ls_req TYPE zapi_s_request.
    DATA ls_res TYPE mty_s_response.

    DATA(l_req_string) = mo_request->get_uri_query_parameter( iv_name    = 'request'
                                                              iv_encoded = abap_false ).

    TRY.

        /ui2/cl_json=>deserialize( EXPORTING json = l_req_string
                                   CHANGING  data = ls_req ).

        check_request_data( ls_req ).

        call_class_method( ).

        " . // Data processing successful
        MESSAGE s006 INTO DATA(l_message).
        DATA(l_state) = mc_response_state_success.

      CATCH cx_root INTO DATA(lo_ex).

        l_message = lo_ex->get_longtext( ).
        l_state   = mc_response_state_error.

    ENDTRY.

    ls_res-data    = mt_method_param.
    ls_res-state   = l_state.
    ls_res-message = l_message.

    DATA(l_response_json) = /ui2/cl_json=>serialize( data        = ls_res
                                                     compress    = abap_true
                                                     pretty_name = /ui2/cl_json=>pretty_mode-camel_case ).

    DATA(lo_entity) = mo_response->create_entity( ).

    lo_entity->set_content_type( iv_media_type = if_rest_media_type=>gc_appl_json ).

    lo_entity->set_string_data( iv_data = l_response_json ).

  ENDMETHOD.
ENDCLASS.
