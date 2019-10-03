import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';

import { WidgetComponent } from '../widget.component';
import { DataStreamService } from '@hyperiot/core';

@Component({
  selector: 'hyperiot-text-label',
  templateUrl: './text-label.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './text-label.component.scss']
})
export class TextLabelComponent extends WidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Output() widgetAction: EventEmitter<any> = new EventEmitter();

  constructor(public dataStreamService: DataStreamService) {
    super(dataStreamService);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onToolbarAction(action: string) {
    this.widgetAction.emit({widget: this.widget, action});
  }

  // inherited methods from WidgetComponent

  pause(): void {
    throw new Error('Method not implemented.');
  }
  play(): void {
    throw new Error('Method not implemented.');
  }
  getOfflineData(startDate: Date, endDate: Date) {
    throw new Error('Method not implemented.');
  }
}
