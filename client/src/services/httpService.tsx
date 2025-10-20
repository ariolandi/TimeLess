const server_url = import.meta.env.VITE_SERVER_HOST;

export enum METHOD {
  GET,
  POST,
  PUT,
  DELETE
}

function toString(method: METHOD) {
  switch(method) {
    case METHOD.GET: return "GET";
    case METHOD.POST: return "POST";
    case METHOD.PUT: return "PUT";
    case METHOD.DELETE: return "DELETE";
  }
  
  return "";
}

export class HTTPService {
  private async execRequest(headers: HeadersInit, endpoint: string, method: METHOD, params?: object) {
    const init: RequestInit = {
      method: toString(method),
      mode: "cors",
      credentials: "include",
      headers: headers,
    };

    if (method !== METHOD.GET && params !== undefined) {
      init.body = JSON.stringify(params);
    }
    
    const response = await fetch(`${server_url}/${endpoint}`, init);

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

