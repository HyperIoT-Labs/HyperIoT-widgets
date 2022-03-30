import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-dynamic-widget',
  templateUrl: './dynamic-widget.component.html',
  styleUrls: ['./dynamic-widget.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicWidgetComponent implements OnInit {
  @Input()
  widget;
  @Output()
  widgetAction: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onWidgetAction(data) {
    console.log('onWidgetAction', data)
    this.widgetAction.emit(data);
  }

}
