const server_url = "http://127.0.0.1:3000";

type METHOD = 'POST' | 'GET';

export class HTTPService {
  private async execRequest(params: object, headers: HeadersInit, endpoint: string, method: METHOD) {
    const init: RequestInit = {
      method: method,
      mode: "cors",
      credentials: "include",
      headers: headers,
    };

    if (method === 'POST') {
      init.body = JSON.stringify(params);
    }
    
    const response = await fetch(`${server_url}/${endpoint}`, init);
    console.log(response);

    if (!response.ok) {
      return false;
    }

    return await response.json();
  }

  async request(params: object, endpoint: string, method: METHOD) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
    };

    return await this.execRequest(params, headers, endpoint, method);
  }

  async authorizedRequest<T>(
    params: object,
    endpoint: string,
    method: METHOD
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Authorization": `Bearer ${localStorage.getItem("current_user")}`,
    };
  
    return await this.execRequest(params, headers, endpoint, method);
  }
}

