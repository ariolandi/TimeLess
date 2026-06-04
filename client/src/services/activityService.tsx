import { HTTPService, METHOD } from './httpService'

export interface ActivityInput {
  title: string,
  description: string,
  duration: string | null,
  place: string | null,
  repeat: string,
  start_time: string | null,
  days: number[],
  date: Date | null,
}

export interface Activity {
  id: number,
  user_id: number,
  title: string,
  description: string,
  place: string,
  duration: string,
  repeat: number,
  start_time: string | null,
  days: number[],
  date: string,
}

export interface SharedActivityInput {
  title: string,
  description: string,
  duration: string | null,
  place: string | null,
  repeat: string,
  start_time: string | null,
  days: number[],
  date: Date | null,
  guests: string[],
}

export class ActivityService {
  private httpService = new HTTPService()
  private endpoint = "activity";

  async create (activity: ActivityInput) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(`${this.endpoint}/create`, METHOD.POST, activity);
  }

  async update (id: number, activity: ActivityInput) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(`${this.endpoint}/update/${id}`, METHOD.PUT, activity);
  }

  async delete (id: number) {
    return await this.httpService.authorizedRequest(`${this.endpoint}/delete/${id}`, METHOD.DELETE);
  }

  async fetch_activity (id: number) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(`${this.endpoint}/${id}`, METHOD.GET);
  }

  async create_shared (activity: SharedActivityInput) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(`${this.endpoint}/create/shared`, METHOD.POST, activity);
  }
}
