import { Component, OnInit, Input, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import {
  GridsterConfig,
  GridsterItem,
  GridType,
  DisplayGrid,
  CompactType,
  GridsterComponent
} from 'angular-gridster2';

import {
  DataStreamService,
  Dashboard
} from '@hyperiot/core';

import { DashboardConfigService } from '../dashboard-config.service';

@Component({
  selector: 'app-widgets-layout',
  templateUrl: './widgets-layout.component.html',
  styleUrls: ['./widgets-layout.component.css']
})
export class WidgetsLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(GridsterComponent, { static: true }) gridster: GridsterComponent;
  @Input() options: GridsterConfig;
  @Input() dashboardId: number | string;

  dashboard: Array<GridsterItem>;
  dashboardEntity: Dashboard;
  dragEnabled = true;
  private originalDashboard: Array<GridsterItem>;

  projectId;

  private responsiveBreakPoints = [
    { breakPoint: 1024, columns: 6},
    { breakPoint: 880, columns: 5},
    { breakPoint: 720, columns: 4},
    { breakPoint: 640, columns: 3},
    { breakPoint: 480, columns: 2},
    { breakPoint: 0, columns: 1},
  ];

  /**
   * This is a demo dashboard for testing widgets
   *
   * @param dataStreamService Injected DataStreamService
   * @param httpClient Injected HTTP client
   */
  constructor(
    private dataStreamService: DataStreamService,
    private configService: DashboardConfigService,
    private router: Router
  ) { }

  ngOnInit() {
    this.options = {
      gridSizeChangedCallback: this.onGridSizeChanged.bind(this),
      itemChangeCallback: this.onItemChange.bind(this),
      itemResizeCallback: this.onItemResize.bind(this),
      gridType: GridType.Fixed,
      setGridSize: true,
      compactType: CompactType.CompactUp,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: true,
      disableAutoPositionOnConflict: false,
      scrollToNewItems: true,
      disableWarnings: true,
      ignoreMarginInRow: false,
      mobileBreakpoint: 480,
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: false,
      minCols: 1, maxCols: 10,
      minRows: 1,
      margin: 6,
      draggable: {
        enabled: this.dragEnabled,
        dropOverItems: true,
        dragHandleClass: 'drag-handle',
        ignoreContent: true
      },
      swap: false,
      disableScrollHorizontal: true,
      disableScrollVertical: true,
      pushItems: true,
      resizable: {
        enabled: false
      }
    };

    this.options.maxCols = this.getResponsiveColumns();
    if (this.options.maxCols > 1) {
      this.options.mobileBreakpoint = 0;
    }
    //const cellSize = (availableWidth - (this.options.margin * this.options.maxCols)) / this.options.maxCols;
    const cellSize = 160;
    this.options.fixedColWidth = cellSize;
    this.options.fixedRowHeight = cellSize / 2;

    this.dashboard = [];
    this.configService.getDashboard(+this.dashboardId)
      .subscribe((d) => {
        this.dashboardEntity = d;
        this.projectId = this.dashboardEntity.hproject.id;
      });
    this.configService.getConfig(this.dashboardId).subscribe((dashboardConfig: Array<GridsterItem>) => {
      this.dashboard = dashboardConfig;
      this.originalDashboard = JSON.parse(JSON.stringify(dashboardConfig));
    });
    // TODO: the connection should happen somewhere else in the main page
    this.dataStreamService.connect(this.projectId);
  }
  ngOnDestroy() {
    this.dataStreamService.disconnect();
  }

  onToggleDragging() {
    this.dragEnabled = !this.dragEnabled;
    this.options.draggable.enabled = this.dragEnabled;
    this.options.api.optionsChanged();
  }

  isDirty() {
    return false;
    // TODO: fix this
    // return this.originalDashboard && JSON.stringify(this.dashboard) !== JSON.stringify(this.originalDashboard);
  }

  // Widget events

  onWidgetAction(data) {
    console.log('Widget action...', data);
    switch (data.action) {
      case 'toolbar:close':
        // TODO: should request action confim
        this.removeItem(data.widget);
        break;
      case 'toolbar:settings':
        this.router.navigate([
          'dashboards',
          this.dashboardId,
          { outlets: { modal: ['settings', data.widget.id] } }
        ]).then((e) => {
          if (e) {
            //console.log('Navigation is successful!');
          } else {
            //console.log('Navigation has failed!');
          }
        });
        break;
      case 'toolbar:fullscreen':
        console.log('FULLSCREEN CLICKED', data);
        this.router.navigate([
          'dashboards',
          this.dashboardId,
          { outlets: { modal: ['fullscreen', data.widget.id] } }
        ])
        break;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const columns = this.getResponsiveColumns();
    if (columns !== this.options.maxCols) {
      /*
      // TODO: Angular-Gridster2 won't apply maxCols option on change (bug??)
      this.options.maxCols = columns;
      if (this.options.maxCols > 1) {
        this.options.mobileBreakpoint = 0;
      }
      this.options.api.optionsChanged();
      */
      // the following is a work around for the above issue (forcing component reload)
      const currentRouteUrl = this.router.url;
      const parentRouteUrl = currentRouteUrl.substring(0, currentRouteUrl.lastIndexOf('/'));
      this.router.navigateByUrl(
        parentRouteUrl, { skipLocationChange: true }
      ).then(() => this.router.navigate([currentRouteUrl]));
    }
  }

  // Gridster events/methods

  onGridSizeChanged(gridster, a, b, c) {
    // TODO: ... this event seems not to be working as expected
  }

  onItemChange(item, itemComponent) {
    if (typeof item.change === 'function') {
      item.change();
    }
  }

  onItemResize(item, itemComponent) {
    if (typeof item.resize === 'function') {
      item.resize();
    }
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  getItemById(id: string) {
    return this.dashboard.find((w) => w.id === +id);
  }

  removeItem(item) {
    if (item.id > 0) {
      this.configService
        .removeDashboardWidget(item.id)
        .subscribe(() => {
          // TODO: handle errors
          this.dashboard.splice(this.dashboard.indexOf(item), 1);
        });
    }
  }

  addItem(widgetTemplate) {
    for (let c = 0; c < widgetTemplate.count; c++) {
      const widget = JSON.parse(JSON.stringify(widgetTemplate));
      delete widget.count;
      this.configService
        .addDashboardWidget(+this.dashboardId, widget)
        .subscribe((w) => {
          // TODO: handle errors
          // widget saved (should have a new id)
          this.dashboard.push(widget);
        });
    }
  }

  saveDashboard() {
    this.configService.putConfig(+this.dashboardId, this.dashboard)
      .subscribe((res) => {
        if (res && res.status_code === 200) {
          this.originalDashboard = this.dashboard;
        }
      });
  }

  getResponsiveColumns(): number {
    let columns = 8;
    const availableWidth = document.documentElement.clientWidth;
    if (availableWidth <= this.options.mobileBreakpoint) {
      columns = 1;
    } else {
      let b = 0;
      const bp = this.responsiveBreakPoints.find((p) => p.breakPoint <= availableWidth);
      if (bp) {
        columns = bp.columns;
      }
    }
    return columns;
  }
}
