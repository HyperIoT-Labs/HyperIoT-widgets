import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation
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

  constructor() { }

  ngOnInit() {
  }

}
