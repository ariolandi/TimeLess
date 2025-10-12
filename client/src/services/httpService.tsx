const server_url = import.meta.env.VITE_SERVER_HOST;

type METHOD = 'POST' | 'GET' | "PUT";

export class HTTPService {
  private async execRequest(headers: HeadersInit, endpoint: string, method: METHOD, params?: object) {
    const init: RequestInit = {
      method: method,
      mode: "cors",
      credentials: "include",
      headers: headers,
    };

    if (method !== 'GET' && params !== undefined) {
      init.body = JSON.stringify(params);
    }
    
    const response = await fetch(`${server_url}/${endpoint}`, init);
    console.log(response);

    if (!response.ok) {
      return false;
    }

    return await response.json();
  }

  async request(endpoint: string, method: METHOD, params?: object, ) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
    };

    return await this.execRequest(headers, endpoint, method, params);
  }

  async authorizedRequest<T>(
    endpoint: string,
    method: METHOD,
    params?: object
  ): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Authorization": `Bearer ${localStorage.getItem("current_user")}`,
    };
  
    return await this.execRequest(headers, endpoint, method, params);
  }
}

