import { Component, OnInit, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-widget-dialog',
  templateUrl: './add-widget-dialog.component.html',
  styleUrls: ['./add-widget-dialog.component.css']
})
export class AddWidgetDialogComponent implements OnInit, OnDestroy {
  @Output() addWidgets: EventEmitter<any> = new EventEmitter();
  selectedWidgets: {id: number, name: string}[] = [];
  selectedCategory: any = null;
  categorydWidgets: any = null;
  // TODO: fetch both list from assets files
  widgetCategory = [
    { id: 1, name: 'Bar chart' },
    { id: 2, name: 'Line chart' },
    { id: 3, name: 'Pie chart' },
    { id: 4, name: 'Radar chart', disabled: true },
    { id: 5, name: 'Gauges', disabled: true  },
    { id: 6, name: 'Map', disabled: true  },
    { id: 7, name: 'Action', disabled: true  },
    { id: 8, name: 'Tables', disabled: true  },
  ];
  widgetList = [
    { id: 1, name: 'Classic pie chart', categoryId: 3, widgetId: 'stats-chart', config: { size: { rows: 0, cols: 0 } } },
    { id: 2, name: 'Classic line chart', categoryId: 2, widgetId: 'time-chart' },
    { id: 3, name: 'Classic bar chart', categoryId: 1, widgetId: 'stats-chart' },
    { id: 4, name: 'Sensor value', categoryId: 5, widgetId: 'sensor-value' },
    { id: 5, name: 'Simple text', categoryId: 5, widgetId: 'text-label' }
  ];

  constructor(
    private viewContainer: ElementRef,
    private http: HttpClient
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
    this.selectedCategory = null;
    this.categorydWidgets = null;
    this.selectedWidgets = [];
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
    console.log(category);
    if (category === 'all') {
      this.categorydWidgets = this.widgetList.slice();
      return;
    }
    this.selectedCategory = category;
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
