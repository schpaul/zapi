CLASS zcl_app_sample DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS get_data
      IMPORTING i_name         TYPE string OPTIONAL
      RETURNING VALUE(rs_data) TYPE zapi_s_classparam.
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
ENDCLASS.
