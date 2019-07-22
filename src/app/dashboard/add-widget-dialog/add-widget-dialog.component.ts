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
    { name: 'Category 1' },
    { name: 'Category 2' },
    { name: 'Category 3' },
    { name: 'Category 4' },
    { name: 'Category 5' }
  ];
  widgetList = [
    { id: 1, name: 'Pie chart', category: '', size: { rows: 0, cols: 0 } },
    { id: 2, name: 'Line chart', category: '' },
    { id: 3, name: 'Bar chart', category: '' },
    { id: 4, name: 'Sensor value', category: '' },
    { id: 5, name: 'Simple text', category: '' }
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
