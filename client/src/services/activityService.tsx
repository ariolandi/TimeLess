import { HTTPService } from './httpService'

export interface ActivityInput {
    title: string,
    description: string,
    duration: string | null,
    repeat: string,
    startTime: string | null,
}

export interface Activity {
    user_id: number,
    title: string,
    description: string,
    duration: string,
    repeat: number,
}

export class ActivityService {
  private httpService = new HTTPService()

  async create (activity: ActivityInput) {
    return await this.httpService.authorizedRequest<{ data: Activity }>(activity, "activity", "POST");
  }

  async fetch () {
    return await this.httpService.authorizedRequest<{ data: Activity[] }>({}, "activity", "GET");
  }
}
