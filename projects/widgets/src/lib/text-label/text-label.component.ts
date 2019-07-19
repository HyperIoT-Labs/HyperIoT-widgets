import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'hyperiot-text-label',
  templateUrl: './text-label.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './text-label.component.css']
})
export class TextLabelComponent implements OnInit, OnDestroy {
  @Input()
  widget;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
