import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WidgetsLayoutComponent } from '../widgets-layout/widgets-layout.component';
import { AddWidgetDialogComponent } from 'src/app/dashboard/add-widget-dialog/add-widget-dialog.component';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {
  @ViewChild('widgetDialog', {static: true}) widgetDialog: AddWidgetDialogComponent;
  @ViewChild(WidgetsLayoutComponent, { static: true })
  private dashboardLayout: WidgetsLayoutComponent;
  private dashboardId: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.dashboardId = this.route.snapshot.paramMap.get('id');
  }
  
  onActivate(childComponent) {
    if (childComponent instanceof AddWidgetDialogComponent) {
      childComponent.addWidgets.subscribe((widgets) => this.onWidgetsAdd(widgets));
    }
  }

  saveDashboard() {
    this.dashboardLayout.saveDashboard();
  }
  addWidget() {
    this.widgetDialog.open();
    // TODO: bind to "requestWidgetAdd" event (maybe)
  }
  onWidgetsAdd(widgetList: any[]) {
    widgetList.map((widget) => {
      console.log(widget);
      this.dashboardLayout.addItem(widget);
    });
  }
}
