import { HTTPService } from './httpService'

export interface ActivityInput {
    title: string,
    description: string,
    duration: string | null,
    repeat: string,
    startTime: string | null,
}

export class ActivityService {
  private httpService = new HTTPService()

  async create (activity: ActivityInput) {
    return await this.httpService.authorizedRequest(activity, "update_user", "POST");
  }
}
