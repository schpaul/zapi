"! <p class="shorttext synchronized" lang="en">API main entry class</p>
CLASS zcl_rest_http_handler DEFINITION
  PUBLIC
  INHERITING FROM cl_rest_http_handler
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    METHODS:
      if_rest_application~get_root_handler REDEFINITION.

  PROTECTED SECTION.

    METHODS handle_csrf_token
        REDEFINITION .

  PRIVATE SECTION.
ENDCLASS.



CLASS zcl_rest_http_handler IMPLEMENTATION.

  METHOD if_rest_application~get_root_handler.

    DATA(lo_root_handler) = NEW cl_rest_router( ).

    " . Provides routing.
    " . Service path /sap/bc/rest/zapi/
    " . Sample URL http://vhcalnplci:8000/sap/bc/rest/zapi?...
    lo_root_handler->attach(
      iv_template      = ''
      iv_handler_class = 'ZCL_API_REQ_HANDLER'
    ).


    " . Provides routing.
    " . Service path /sap/bc/rest/zapi/
    " . Sample URL http://vhcalnplci:8000/sap/bc/rest/zapi/?...
    lo_root_handler->attach(
      iv_template      = '/'
      iv_handler_class = 'ZCL_API_REQ_HANDLER'
    ).

    ro_root_handler = lo_root_handler.

  ENDMETHOD.



  METHOD handle_csrf_token.
**********************************************************************
*    . Implement if needed
**********************************************************************
  ENDMETHOD.

ENDCLASS.
