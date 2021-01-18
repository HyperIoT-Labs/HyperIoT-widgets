import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardOfflineDataService, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { WidgetComponent } from '../widget.component';
import * as moment from 'moment';

@Component({
  selector: 'hyperiot-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './event-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventTableComponent  extends WidgetComponent {

  callBackEnd = false;
  hPacketId: number;
  isPaused: boolean;
  DEFAULT_MAX_TABLE_LINES = 50;
  @ViewChild('tableChild', {static: false}) tableChild;
  array: object[] = [];
  pRequest;
  tableSource: Subject<any[]> = new Subject<any[]>();
  timestamp = new Date();
  tableHeaders = [];
  totalLength = 0;

  offlineDataSubscription: Subscription;

  eventPacketId: number;
  eventPacketFieldName: string;
  eventPacketTimestampFieldName: string;

  constructor(
    public dataStreamService: DataStreamService,
    private dashboardOfflineDataService: DashboardOfflineDataService
  ) {
    super(dataStreamService);
    this.eventPacketId = -1;
    this.hPacketId = this.eventPacketId;
    this.eventPacketFieldName = 'event';
    this.eventPacketTimestampFieldName = 'timestamp';
  }

  configure() {
    super.configure();
    this.widget.config.packetId = this.eventPacketId;
    this.widget.config.timestampFieldName = this.eventPacketTimestampFieldName;
    this.widget.config.packetFields = {};
    this.widget.config.packetFields[this.eventPacketId] = this.eventPacketFieldName
    this.tableHeaders.push(this.widget.config.packetFields[this.eventPacketId]);
    this.tableHeaders.push(this.widget.config.timestampFieldName)
    setTimeout(() => {
      this.callBackEnd = true;
    }, 500);
    // set data source
    this.setDatasource();
  }

  private setDatasource(): void {
    this.dashboardOfflineDataService.addWidget(this.widget.id, this.hPacketId);
    this.offlineDataSubscription = this.dashboardOfflineDataService.getPacketDataSubject(this.hPacketId).subscribe(
      res => {
        this.totalLength = res;
        this.tableChild.resetTable(this.totalLength, true);
      });
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:close': {
        this.dashboardOfflineDataService.removeWidget(this.widget.id, this.hPacketId);
        break;
      }
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  getDatum(array, name) {
    return array.some(y => y.name === name) ? array.find(y => y.name === name).value : '-';
  }

  pageRequest(rowsIndexes) {
    if (this.pRequest) {
      this.pRequest.unsubscribe();
    }
    this.pRequest = this.dashboardOfflineDataService.getData(this.hPacketId, rowsIndexes).subscribe(
      res => {
        const pageData = [];
        const realIndexes = [];
        realIndexes[0] = rowsIndexes[0] % this.DEFAULT_MAX_TABLE_LINES;
        realIndexes[1] = (rowsIndexes[1] % this.DEFAULT_MAX_TABLE_LINES !== 0) ? rowsIndexes[1] % this.DEFAULT_MAX_TABLE_LINES : this.DEFAULT_MAX_TABLE_LINES;
        const asd = res.values.slice(realIndexes[0], realIndexes[1]);
        asd.forEach(a => {
          const element = this.tableHeaders.reduce((prev, curr) => { prev[curr] = this.getDatum(a.fields, curr); return prev; }, {});
          const timestampFieldName = this.widget.config.timestampFieldName;
          element[timestampFieldName] = moment(element[timestampFieldName]).format('L') + ' ' + moment(element[timestampFieldName]).format('LTS');
          pageData.push(element);
        });
        this.tableSource.next(pageData);
      },
      err => {
        // TODO send eror to table
        console.log(err);
      }
    );
  }

  play(): void {
    this.isPaused = false;
  }

  pause(): void {
    this.isPaused = true;
  }

}
