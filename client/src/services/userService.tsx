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

interface Time {
  start: string | null,
  end: string | null,
}

export interface UserInformation {
  first_name: string,
  last_name: string,
  weekday_time: Time,
  weekend_time: Time,
}

export class UserService {
  private httpService = new HTTPService()

  async create (user: CreateUser) {
      return await this.httpService.request({user}, "signup", "POST");
  }

  async login (user: LoginUser) {
    return await this.httpService.request(user, "login", "POST");
  }

  async information (information: UserInformation) {
    return await this.httpService.authorizedRequest<{ data: UserInformation }>(information, "update_user", "POST");
  }
}
