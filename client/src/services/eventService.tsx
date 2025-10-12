import { HTTPService } from './httpService'

export interface Event {
  user_id: number,
  activity_id: number,
  title: string,
  start_time: string,
  duration: string,
  end_time: string,
  fixed: boolean,
  event_type: string,
}


export class EventService {
  private httpService = new HTTPService()

  async create (activity_id: number) {
    return await this.httpService.authorizedRequest("schedule", "POST", { activity_id });
  }

  async fetch (day: number) {
    return await this.httpService.authorizedRequest<{ data: Event[] }>(`schedule/${day}`, "GET");
  }
}
