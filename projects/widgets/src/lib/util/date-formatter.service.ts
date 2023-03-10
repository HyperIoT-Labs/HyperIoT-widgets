import { Injectable } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }

  public formatDate(date: Date): string {
    return this.formatTimestamp(date.getTime());
  }

  public formatTimestamp(timestamp: number): string {
    return moment(timestamp).format("L") + " " + moment(timestamp).format("LTS");
  }

}
