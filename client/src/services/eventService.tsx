import { HTTPService } from './httpService'

export interface Event {
    activity_id: number,
    duration: string,
    fixed: boolean,
    start_time: string,
    system: boolean,
    title: string,
    user_id: boolean[],
}


export class EventService {
  private httpService = new HTTPService()

  async create (activity_id: number) {
    return await this.httpService.authorizedRequest({ activity_id: activity_id }, "event", "POST");
  }

  async fetch (day: number) {
    return await this.httpService.authorizedRequest<{ data: Event[] }>({ day: day }, "schedule", "POST");
  }
}
