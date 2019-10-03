import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';

import { DataStreamService } from '@hyperiot/core';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-events-log',
  templateUrl: './events-log.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './events-log.component.scss']
})
export class EventsLogComponent extends WidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Output() widgetAction: EventEmitter<any> = new EventEmitter();
  private isPaused = false;

  logMessages: {timestamp: Date, message: string, extra: string}[] = [];

  callBackEnd : boolean = false;

  /**
   * Contructor
   * @param dataStreamService Inject data stream service
   */
  constructor(public dataStreamService: DataStreamService) {
    super(dataStreamService);
  }

  ngOnInit() {
    this.dataStreamService.eventStream.subscribe((event) => {

      if (this.isPaused) {
        return;
      }
      let packet = JSON.parse(event.data);
      // packet = JSON.parse(packet.payload);
      // limit max log lines
      let maxLogLines = 100;
      if (this.widget.config && this.widget.config.maxLogLines) {
        maxLogLines = +this.widget.config.maxLogLines;
      }
      this.logMessages.unshift({
        timestamp: new Date(),
        message: packet.payload,
        extra: '---'
      });
      if (this.logMessages.length > maxLogLines) {
        this.logMessages.pop();
      }
    },
    (err) => {
      console.log('Errore nella subscribe EVENT LOG ', err);
    },
    () => {
      this.callBackEnd = true;
    });
  }

  ngOnDestroy() {
  }

  pause(): void {
    this.isPaused = true;
  }
  play(): void {
    this.isPaused = false;
  }
  getOfflineData(startDate: Date, endDate: Date) {
    throw new Error('Method not implemented.');
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:play':
        this.play();
        break;
      case 'toolbar:pause':
        this.pause();
        break;
    }
    this.widgetAction.emit({widget: this.widget, action});
  }

}
