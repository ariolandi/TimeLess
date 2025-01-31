import { HTTPService } from './httpService'

export interface ActivityInput {
    title: string,
    description: string,
    duration: string | null,
    repeat: string,
    start_time: string | null,
    days: boolean[],
}

export interface Activity {
    user_id: number,
    title: string,
    description: string,
    duration: string,
    repeat: number,
    start_time: string | null,
    days: boolean[],
}

export class ActivityService {
  private httpService = new HTTPService()

  async create (activity: ActivityInput) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(activity, "activity", "POST");
  }

  async fetch () {
    return await this.httpService.authorizedRequest<{ data: Array<Activity[]> }>({}, "activity", "GET");
  }
}
