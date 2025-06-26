CLASS zcl_app_sample DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS get_data
      IMPORTING i_name         TYPE string OPTIONAL
      RETURNING VALUE(rs_data) TYPE zapi_s_classparam.

    METHODS get_table_data
      RETURNING VALUE(rt_data) TYPE zsample_tt_data.

    METHODS get_user_data
      IMPORTING i_username          TYPE syuname
      RETURNING VALUE(rs_user_data) TYPE bapiaddr3
      RAISING   zcx_api.
ENDCLASS.


CLASS zcl_app_sample IMPLEMENTATION.
  METHOD get_data.
    IF i_name IS NOT INITIAL.

      rs_data-name = i_name.
      rs_data-data = |Hello, { i_name }!  From your SAP-Backend-Application.|.

    ELSE.

      rs_data-name = 'World'.
      rs_data-data = 'Hello, World! From your SAP-Backend-Application.'.

    ENDIF.
  ENDMETHOD.

  METHOD get_table_data.
    rt_data = VALUE #(
        unit = 'PCS'
        ( huident = '1234' product = '223311-01' proddescr = 'Nice product first version' quantity = '3' )
        ( huident = '1235' product = '223311-02' proddescr = 'Nice product second version' quantity = '13' )
        ( huident = '1236' product = '223311-03' proddescr = 'Nice product third version' quantity = '7' )
        ( huident = '1236' product = '223311-04' proddescr = 'Nice product forth version' quantity = '999' ) ).
  ENDMETHOD.

  METHOD get_user_data.
    DATA lt_return TYPE TABLE OF bapiret2.

    IF i_username IS INITIAL.

      RAISE EXCEPTION TYPE zcx_api MESSAGE e000(z_m_api) WITH 'Name is initial'.

    ENDIF.

    CALL FUNCTION 'BAPI_USER_GET_DETAIL'
      EXPORTING username      = i_username
                cache_results = abap_false
      IMPORTING address       = rs_user_data
      TABLES    return        = lt_return.

    IF sy-subrc <> 0.

      RAISE EXCEPTION TYPE zcx_api MESSAGE e000(z_m_api) WITH 'User' i_username 'not found'.

    ENDIF.
  ENDMETHOD.
ENDCLASS.
