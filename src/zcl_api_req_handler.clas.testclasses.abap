CLASS ltc_api_req_handler DEFINITION
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    " . Test Methods
    METHODS sample_class_say_hello FOR TESTING.

ENDCLASS.


" Test class, implementation part
CLASS ltc_api_req_handler IMPLEMENTATION.
  METHOD sample_class_say_hello.
    DATA l_url       TYPE string.
    DATA ls_response TYPE zcl_api_req_handler=>mty_s_response.

    l_url = 'http://vhcala4hci:50000/zapi?sap-client=001&request={%22classname%22%3A%22zcl_app_sample%22%2C%20%22method%22%3A%22say_hello%22%20}&sap-language=EN'.

    cl_http_client=>create_by_url( EXPORTING  url                        = l_url
                                   IMPORTING  client                     = DATA(lo_client)
                                   EXCEPTIONS argument_not_found         = 1
                                              plugin_not_active          = 2
                                              internal_error             = 3
                                              pse_not_found              = 4
                                              pse_not_distrib            = 5
                                              pse_errors                 = 6
                                              oa2c_set_token_error       = 7
                                              oa2c_missing_authorization = 8
                                              oa2c_invalid_config        = 9
                                              oa2c_invalid_parameters    = 10
                                              oa2c_invalid_scope         = 11
                                              oa2c_invalid_grant         = 12
                                              OTHERS                     = 13 ).

    IF sy-subrc <> 0.
      MESSAGE ID sy-msgid TYPE sy-msgty NUMBER sy-msgno
              WITH sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4.
    ENDIF.

    cl_abap_unit_assert=>assert_bound( act = lo_client
                                       msg = 'Http client not created!' ).

    lo_client->authenticate( username = zcl_abap_env=>get_username( )    " . your user
                             password = zcl_abap_env=>get_password( ) ). " . your password

    lo_client->send( ).

    lo_client->receive( ).

    lo_client->response->get_status( IMPORTING code = DATA(lv_http_rc) ).

    cl_abap_unit_assert=>assert_equals( exp = 200
                                        act = lv_http_rc
                                        msg = 'Response not okey, should be 200' ).

    " . Get zapi response structure
    DATA(l_data) = lo_client->response->get_cdata( ).

    /ui2/cl_json=>deserialize( EXPORTING json = l_data
                               CHANGING  data = ls_response ).

    lo_client->close( ).

    " . Check response data
    cl_abap_unit_assert=>assert_not_initial( act = ls_response
                                             msg = 'Response should not be initial' ).
  ENDMETHOD.
ENDCLASS.
