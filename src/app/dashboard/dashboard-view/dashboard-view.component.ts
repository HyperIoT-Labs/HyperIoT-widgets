import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WidgetsLayoutComponent } from '../widgets-layout/widgets-layout.component';
import { AddWidgetDialogComponent } from 'src/app/dashboard/add-widget-dialog/add-widget-dialog.component';
import { WidgetSettingsDialogComponent } from '../widget-settings-dialog/widget-settings-dialog.component';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {
  @ViewChild(WidgetsLayoutComponent, { static: true })
  private dashboardLayout: WidgetsLayoutComponent;
  private dashboardId: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.dashboardId = this.activatedRoute.snapshot.paramMap.get('dashboardId');
  }

  onActivate(childComponent) {
    if (childComponent instanceof AddWidgetDialogComponent) {
      childComponent.addWidgets.subscribe((widgets) => this.onWidgetsAdd(widgets));
    } else if (childComponent instanceof WidgetSettingsDialogComponent) {
      const widgetId = childComponent.getWidgetId();
      const widget = this.dashboardLayout.getItemById(widgetId);
      childComponent.setWidget(widget);
    }
  }

  saveDashboard() {
    this.dashboardLayout.saveDashboard();
  }

  onWidgetsAdd(widgetList: any[]) {
    widgetList.map((widget) => {
      console.log(widget);
      this.dashboardLayout.addItem(widget);
    });
  }
}
