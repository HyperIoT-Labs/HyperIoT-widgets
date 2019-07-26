import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-widget-settings-dialog',
  templateUrl: './widget-settings-dialog.component.html',
  styleUrls: ['./widget-settings-dialog.component.css']
})
export class WidgetSettingsDialogComponent implements OnInit, OnDestroy {
  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() widget;

  constructor(
    private viewContainer: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.viewContainer.nativeElement
      .addEventListener('click', this.dismiss.bind(this));
    this.open();
  }

  ngOnDestroy() {
    this.viewContainer.nativeElement
      .removeEventListener('click', this.dismiss.bind(this));
  }

  dismiss(e: any) {
    if (e.target === this.viewContainer.nativeElement) {
      this.close(e);
    }
  }

  open() {
    // TODO: init stuff goes here
  }

  close($event) {
    this.router.navigate(
      ['../', {outlets: {modal: null}}],
      { relativeTo: this.activatedRoute }
    );
    this.modalClose.emit($event);
  }
}
