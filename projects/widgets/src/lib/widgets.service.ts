import { Injectable } from '@angular/core';

import convert from 'convert-units';

@Injectable({
  providedIn: 'root'
})
export class WidgetsService {

  constructor() { }

  convert(data?) {
    return convert(data);
  }

}
