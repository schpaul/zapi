export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const client = searchParams.get("client");
  const jsonRequest = searchParams.get("request");
  const token = searchParams.get("token");

  const res = await fetch(
    "http://vhcala4hci:50000/sap/bc/rest/zapi?sap-client=" +
      client +
      "&request=" +
      jsonRequest,
      {
        headers: { 'Authorization' : 'Basic ' + token + '' }
      }
  );

  return res;
}
