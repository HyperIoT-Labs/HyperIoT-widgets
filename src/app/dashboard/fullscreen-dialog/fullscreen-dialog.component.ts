import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fullscreen-dialog',
  templateUrl: './fullscreen-dialog.component.html',
  styleUrls: ['./fullscreen-dialog.component.scss']
})
export class FullscreenDialogComponent implements OnInit {

  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() widgetAction: EventEmitter<any> = new EventEmitter();
  @Input() widget;
  @Input() widgetName;
  private widgetId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.widgetId = this.activatedRoute.snapshot.paramMap.get('widgetId');
   }

  ngOnInit(): void {
  }

  setWidget(w: any) {
    console.log('SETWIDGET 2', w)
    this.widget = w;
    this.widgetName = w.name;
  }

  getWidgetId() {
    return this.widgetId;
  }

  onWidgetAction(data) {
    console.log('FULLSCREEN EMETTE', data)
    this.widgetAction.emit(data);
  }

  close($event?) {
    this.router.navigate(
      ['../', { outlets: { modal: null } }],
      { relativeTo: this.activatedRoute }
    );
    this.modalClose.emit($event);
  }

}
