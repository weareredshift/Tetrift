import sigV4Client from './sigV4Client';
import config from '../config.js';

export async function invokeApig({
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body
}) {
  const signedRequest = sigV4Client
    .newClient({
      accessKey: process.env.REACT_APP_ACCESS_KEY_ID,
      secretKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      region: config.apiGateway.REGION,
      endpoint: config.apiGateway.URL
    })
    .signRequest({
      method,
      path,
      headers,
      queryParams,
      body
    });

  const finalBody = body ? JSON.stringify(body) : body;
  const finalHeaders = signedRequest.headers;

  const results = await fetch(signedRequest.url, {
    method,
    headers: finalHeaders,
    body: finalBody
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
}
