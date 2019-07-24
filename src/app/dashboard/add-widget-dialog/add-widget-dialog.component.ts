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

  constructor(
    private viewContainer: ElementRef,
    private http: HttpClient,
    private dashboardConfigService: DashboardConfigService
  ) { }

  ngOnInit() {
    this.viewContainer.nativeElement.addEventListener('click', this.dismiss.bind(this));
    this.dashboardConfigService.getWidgetCategoryList()
      .subscribe((cl) => this.widgetCategoryList = cl);
    this.dashboardConfigService.getWidgetList()
      .subscribe((cl) => this.widgetList = cl);
    this.close();
  }
  ngOnDestroy() {
    this.viewContainer.nativeElement.removeEventListener('click', this.dismiss.bind(this));
  }

  open() {
    this.viewContainer.nativeElement.style.display = '';
    this.categorydWidgets = null;
    this.selectedWidgets = [];
    this.onCategorySelect(this.widgetCategoryList[0]);
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
  onWidgetSelected(widget: any) {
    if (this.selectedWidgets.includes(widget)) {
      const index = this.selectedWidgets.indexOf(widget);
      this.selectedWidgets.splice(index, 1);
    } else {
      this.selectedWidgets.push(widget);
    }
  }
}
