const server_url = "http://127.0.0.1:3000";

const exec_request = async (params: object, headers: HeadersInit, endpoint: string, method: string) => {
  const response = await fetch(`${server_url}/${endpoint}`, {
    method: method,
    mode: "cors",
    credentials: "include",
    headers: headers,
    body: JSON.stringify(params),
  });
  console.log(response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
}

export const request = async (params: object, endpoint: string, method: string) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
  };

  return await exec_request(params, headers, endpoint, method);
};

export const authorized_request = async (
  params: object,
  endpoint: string,
  method: string
) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Authorization": `Bearer ${localStorage.getItem("current_user")}`,
  };

  return await exec_request(params, headers, endpoint, method);
};
