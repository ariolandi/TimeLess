import { HTTPService } from './httpService'

export interface CreateUser {
  username: string,
  password: string,
  email: string
}

export interface LoginUser {
  username: string,
  password: string,
}

export interface UserInformation {
  first_name: string,
  last_name: string,
  start_time: string | null,
  end_time: string | null,
  weekend_start_time: string | null,
  weekend_end_time: string | null,
}

export class UserService {
  private httpService = new HTTPService()

  async create (user: CreateUser) {
      return await this.httpService.request("signup", "POST", user);
  }

  async login (user: LoginUser) {
    return await this.httpService.request("login", "POST", user);
  }

  async logout () {
    return await this.httpService.authorizedRequest("logout", "GET");
  }

  async information (information: UserInformation) {
    return await this.httpService.authorizedRequest<{ data: UserInformation }>("update_user", "POST", information);
  }
}
