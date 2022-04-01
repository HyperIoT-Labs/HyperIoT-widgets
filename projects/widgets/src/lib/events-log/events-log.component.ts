import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { DataStreamService } from '@hyperiot/core';
import { CommonToolbarComponent } from '../common-toolbar/common-toolbar.component';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-events-log',
  templateUrl: './events-log.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './events-log.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsLogComponent extends WidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Output() widgetAction: EventEmitter<any> = new EventEmitter();
  public isPaused = false;

  logMessages: {timestamp: Date, message: string, extra: string}[] = [];

  callBackEnd : boolean = false;

  /**
   * Contructor
   * @param dataStreamService Inject data stream service
   */
  constructor(public dataStreamService: DataStreamService, public dataStreamServiceModal: DataStreamService) {
    super(dataStreamService, dataStreamServiceModal);
  }

  ngOnInit() {
    //console.log('Siamo nell\'OnInit');
    this.dataStreamService.eventStream.subscribe((event) => {
      //console.log('Siamo nella subscribe dell\'Event Log');
      if (this.isPaused) {
        return;
      }
      const packet = JSON.stringify(event.data);
      // limit max log lines
      let maxLogLines = 100;
      if (this.widget.config && this.widget.config.maxLogLines) {
        maxLogLines = +this.widget.config.maxLogLines;
      }
      this.logMessages.unshift({
        timestamp: new Date(),
        message: packet,
        extra: '---'
      });
      if (this.logMessages.length > maxLogLines) {
        this.logMessages.pop();
      }
    },
    (err) => {
      //console.log('Errore nella subscribe EVENT LOG ', err);
    },
    () => {
      this.callBackEnd = true;
      //console.log('CallBack Event Log')
    });

    if (this.logMessages.length === 0) {

      //console.log('LogMessage è VUOTO!!')
      setTimeout(() => {
        this.callBackEnd = true;
      }, 500);

    } else {

      //console.log('LogMessage è PIENO!!')
      setTimeout(() => {
        this.callBackEnd = true;
      }, 500);

    }

  }

  ngOnDestroy() {
  }

  pause(): void {
    this.isPaused = true;
  }
  play(): void {
    this.isPaused = false;
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
