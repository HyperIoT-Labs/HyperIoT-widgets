import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-add-widget-dialog',
  templateUrl: './add-widget-dialog.component.html',
  styleUrls: ['./add-widget-dialog.component.css']
})
export class AddWidgetDialogComponent implements OnInit, OnDestroy {
  selectedWidgets: {id: number, name: string}[] = [];
  selectedCategory: string = null;
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
    { id: 1, name: 'Pie chart', categoryId: 3, widgetId: 'stats-chart', config: { size: { rows: 0, cols: 0 } } },
    { id: 2, name: 'Line chart', categoryId: 2, widgetId: 'time-chart' },
    { id: 3, name: 'Bar chart', categoryId: 1, widgetId: 'stats-chart' },
    { id: 4, name: 'Sensor value', categoryId: 0, widgetId: 'sensor-value' },
    { id: 5, name: 'Simple text', categoryId: 0, widgetId: 'text-label' }
  ];

  constructor(
    private viewContainer: ElementRef
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
    console.log(this.selectedWidgets);
    // TODO: signal widget add with EventEmitter
  }

}
