# ZAPI

is a simple RESTapi written in ABAP to call any public method of any class inside your SAP-System. Just use Postman to try it out.

## How to use

### 1. Clone with AbapGit
Link to AbapGit https://abapgit.org 

### 2. Activate zapi service in SICF transaction
![SICF Transaction](/docs/sicf.png)

### 3. Test your service with e.g. Postman
Link to Postman https://github.com/postmanlabs

use for example following url:

`http://vhcala4hci:50000/sap/bc/rest/zapi?sap-client=001&request={"classname":"zcl_app_sample", "method":"get_data", "paramtab" : [{ "name" : "i_name", "data":"John Doe"}]}`

