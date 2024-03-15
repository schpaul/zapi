export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const client = searchParams.get("client");
  const jsonRequest = searchParams.get("request");

  const res = await fetch(
    "http://vhcala4hci:50000/sap/bc/rest/zapi?sap-client=" +
      client +
      "&request=" +
      jsonRequest,
      {
        // Replace with your base64 signature (username + password)
        headers: { 'Authorization' : 'Basic RGV2ZWxvcGVyOkFCQVB0cjE5MDk=' }
      }
  );

  return res;
}
