const server_url = "http://127.0.0.1:3000";

export class HTTPService {
  private async execRequest(params: object, headers: HeadersInit, endpoint: string, method: string) {
    const response = await fetch(`${server_url}/${endpoint}`, {
      method: method,
      mode: "cors",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(params),
    });
    console.log(response);

    if (!response.ok) {
      throw response.statusText;
    }

    return await response.json();
  }

  async request(params: object, endpoint: string, method: string) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
    };

    return await this.execRequest(params, headers, endpoint, method);
  }

  async authorizedRequest (
    params: object,
    endpoint: string,
    method: string
  ) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Authorization": `Bearer ${localStorage.getItem("current_user")}`,
    };
  
    return await this.execRequest(params, headers, endpoint, method);
  }
}

