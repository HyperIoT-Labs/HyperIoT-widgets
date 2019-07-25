import {
  Component,
  OnInit,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardConfigService } from '../dashboard-config.service';

@Component({
  selector: 'app-add-widget-dialog',
  templateUrl: './add-widget-dialog.component.html',
  styleUrls: ['./add-widget-dialog.component.css']
})
export class AddWidgetDialogComponent implements OnInit, OnDestroy {
  @Output() addWidgets: EventEmitter<any> = new EventEmitter();
  categorydWidgets: any = null;
  // TODO: fetch both list from assets files
  widgetCategoryList: any;
  widgetList: any;
  selectedWidgets: {id: number, name: string}[] = [];
  selectedCategory = null;
  widgetAddMax = 10;

  constructor(
    private viewContainer: ElementRef,
    private http: HttpClient,
    private dashboardConfigService: DashboardConfigService
  ) { }

  ngOnInit() {
    this.viewContainer.nativeElement.addEventListener('click', this.dismiss.bind(this));
    this.close();
  }
  ngOnDestroy() {
    this.viewContainer.nativeElement.removeEventListener('click', this.dismiss.bind(this));
  }

  open() {
    this.viewContainer.nativeElement.style.display = '';
    this.categorydWidgets = null;
    this.selectedWidgets = [];
    // get widget list
    this.dashboardConfigService.getWidgetList()
      .subscribe((wl: any[]) => {
        // set initial quantity
        wl.map((w) => w.count = 0);
        this.widgetList = wl;
        // get category list
        this.dashboardConfigService.getWidgetCategoryList()
        .subscribe((cl) => {
          this.widgetCategoryList = cl;
          this.onCategorySelect(this.widgetCategoryList[0])
        });
      });
  }

  close() {
    this.viewContainer.nativeElement.style.display = 'none';
  }

  dismiss(e: any) {
    if (e.target === this.viewContainer.nativeElement) {
      this.close();
    }
  }

  confirm() {
    // TODO: signal widget add with EventEmitter
    this.addWidgets.emit(this.selectedWidgets);
    this.close();
  }

  addWidget(widget) {
    if (widget.count < this.widgetAddMax) {
      widget.count++;
    }
    this.onWidgetChange(widget);
  }
  removeWidget(widget) {
    if (widget.count > 0) {
      widget.count--;
    }
    this.onWidgetChange(widget);
  }
  onWidgetChange(widget) {
    if (widget.count === 0 && this.selectedWidgets.includes(widget)) {
      // remove
      const index = this.selectedWidgets.indexOf(widget);
      this.selectedWidgets.splice(index, 1);
    } else if (widget.count > 0 && !this.selectedWidgets.includes(widget)) {
      // add
      this.selectedWidgets.push(widget);
    }
    console.log(widget, this.selectedWidgets);
  }

  onCategorySelect(category: any) {
    this.selectedCategory = category;
    if (category.id === 0) {
      this.categorydWidgets = this.widgetList.slice();
      return;
    }
    this.categorydWidgets = this.widgetList.filter((w) => {
      return w.categoryId === category.id;
    });
  }
  /*
  onWidgetSelected(widget: any) {
    if (this.selectedWidgets.includes(widget)) {
      const index = this.selectedWidgets.indexOf(widget);
      this.selectedWidgets.splice(index, 1);
    } else {
      this.selectedWidgets.push(widget);
    }
  }
  */
}
