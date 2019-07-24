import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'hyperiot-text-label',
  templateUrl: './text-label.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './text-label.component.css']
})
export class TextLabelComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Output() widgetAction: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onToolbarAction(action: string) {
    this.widgetAction.emit({widget: this.widget, action});
  }
}
