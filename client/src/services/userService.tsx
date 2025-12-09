import { HTTPService, METHOD } from './httpService'

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

export interface User extends UserInformation {
  username: string,
  email: string
}


export class UserService {
  private httpService = new HTTPService()

  async create(user: CreateUser) {
    return await this.httpService.request("signup", METHOD.POST, { user } );
  }

  async login(user: LoginUser) {
    return await this.httpService.request("login", METHOD.PUT, user );
  }

  async logout() {
    return await this.httpService.authorizedRequest("logout", METHOD.DELETE);
  }

  async information(information: UserInformation) {
    return await this.httpService.authorizedRequest<{ data: UserInformation }>("update_user", METHOD.PUT, information);
  }

  async profile(): Promise<{data: User, status: object}> {
    return await this.httpService.authorizedRequest("profile", METHOD.GET);
  }

  async list(): Promise<{data: string[], status: object}> {
    return await this.httpService.authorizedRequest("list", METHOD.GET);
  }

  async add_friend(username: string) {
    return await this.httpService.authorizedRequest("add_friend", METHOD.PUT, {username: username});
  }

  async friends(): Promise<{data: User[], status: object}> {
    return await this.httpService.authorizedRequest("friends", METHOD.GET);
  }
}