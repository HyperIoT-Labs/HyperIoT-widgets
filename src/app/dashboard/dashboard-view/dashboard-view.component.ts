import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WidgetsLayoutComponent } from '../widgets-layout/widgets-layout.component';
import { ModalDialogComponent } from 'src/app/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {
  @ViewChild('widgetDialog', {static: true}) widgetDialog: ModalDialogComponent;
  @ViewChild(WidgetsLayoutComponent, { static: true })
  private dashboardLayout: WidgetsLayoutComponent;
  private dashboardId: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.dashboardId = this.route.snapshot.paramMap.get('id');
  }
  saveDashboard() {
    this.dashboardLayout.saveDashboard();
  }
  addWidget() {
    this.widgetDialog.open();
    // TODO: bind to "requestWidgetAdd" event
  }
}
