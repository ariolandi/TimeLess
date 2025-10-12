import { HTTPService } from './httpService'

export interface ActivityInput {
  title: string,
  description: string,
  duration: string | null,
  repeat: string,
  start_time: string | null,
  days: number[],
}

export interface Activity {
  id: number,
  user_id: number,
  title: string,
  description: string,
  duration: string,
  repeat: number,
  start_time: string | null,
  days: number[],
}

export class ActivityService {
  private httpService = new HTTPService()

  async create (activity: ActivityInput) {
    return await this.httpService.authorizedRequest<{ data: Activity }>("activity/create", "POST", activity);
  }

  async update (id: number, activity: ActivityInput) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(`activity/update/${id}`, "PUT", activity);
  }

  async delete (id: number) {
    return await this.httpService.authorizedRequest(`activity/delete/${id}`, "PUT");
  }

  async fetch_activity (id: number) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(`activity/id/${id}`, "GET");
  }
}
