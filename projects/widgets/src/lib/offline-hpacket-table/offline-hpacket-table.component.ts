import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardOfflineDataService, DataPacketFilter, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-offline-hpacket-table',
  templateUrl: './offline-hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './offline-hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfflineHpacketTableComponent extends WidgetComponent {

  callBackEnd = false;
  hPacketId: number;
  isPaused: boolean;
  isOnline = false;
  DEFAULT_MAX_TABLE_LINES = 1000;
  @ViewChild('tableChild', { static: false }) tableChild;
  provaMap: Map<number, any[]>;
  timestamp = new Date();
  tableHeaders = [];
  totalLength = 0;

  offlineDataSubscription: Subscription;

  constructor(
    public dataStreamService: DataStreamService,
    private dashboardOfflineDataService: DashboardOfflineDataService
  ) {
    super(dataStreamService);
  }

  configure() {
    super.configure();
    this.isOnline = this.widget.config.online || false;
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && Object.keys(this.widget.config.packetFields).length > 0)) {
      this.isConfigured = false;
      // set callback end
      setTimeout(() => {
        this.callBackEnd = true;
      }, 500);
      return;
    }
    this.provaMap = new Map<number, any[]>();
    // Set Callback End
    setTimeout(() => {
      this.callBackEnd = true;
    }, 500);

    // Set header
    const fieldIds = Object.keys(this.widget.config.packetFields);
    if (fieldIds.length > 0) {
      this.tableHeaders = [];
      fieldIds.forEach(hPacketFieldId => this.tableHeaders.push(this.widget.config.packetFields[hPacketFieldId]));
    }

    // set data source
    if (this.isOnline) {
      this.hPacketId = this.widget.config.packetId;
      // subscribe data stream
      const dataPacketFilter = new DataPacketFilter(this.hPacketId, this.widget.config.packetFields, true);
      this.subscribeDataStream(dataPacketFilter);
    } else {
      this.setDatasource();
    }

  }

  array: object[] = [];

  private subscribeDataStream(dataPacketFilter: DataPacketFilter): void {
    const maxTableLines = this.widget.config.maxLogLines ? this.widget.config.maxLogLines : this.DEFAULT_MAX_TABLE_LINES;
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      if (this.isPaused) {
        return;
      }
      this.array.unshift(eventData[1]);
      if (this.array.length > maxTableLines) {
        this.array.pop();
      }
      // TODO modify totalLength only and avoid resetTable()
      this.tableChild.resetTable(this.array.length);
    });
  }

  private setDatasource(): void {
    if (this.hPacketId !== this.widget.config.packetId) {
      if (this.hPacketId) {
        this.dashboardOfflineDataService.removeWidget(this.widget.id, this.hPacketId);
      }
      this.hPacketId = this.widget.config.packetId;
      this.dashboardOfflineDataService.addWidget(this.widget.id, this.hPacketId);
    }
    if (this.offlineDataSubscription) {
      this.offlineDataSubscription.unsubscribe();
    }
    this.offlineDataSubscription = this.dashboardOfflineDataService.getPacketDataSubject(this.hPacketId).subscribe(
      res => {
        this.totalLength = res;
        this.tableChild.resetTable(this.totalLength);
      });
  }

  getOfflineData(startDate: Date, endDate: Date) {
    throw new Error('Method not implemented.');
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:play':
        this.play();
        break;
      case 'toolbar:pause':
        this.pause();
        break;
      case 'toolbar:close': {
        if (!this.isOnline) {
          this.dashboardOfflineDataService.removeWidget(this.widget.id, this.hPacketId);
        }
        break;
      }
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  tableSource: Subject<any[]> = new Subject<any[]>();

  getDatum(array, name) {
    return array.some(y => y.name === name) ? array.find(y => y.name === name).value : '-';
  }

  pRequest;

  pageRequest(rowsIndexes) {
    if (!this.isOnline) {
      if (this.pRequest) {
        this.pRequest.unsubscribe();
      }
      this.pRequest = this.dashboardOfflineDataService.getData(this.hPacketId, rowsIndexes).subscribe(
        res => {
          const pageData = [];
          const realIndexes = [];
          realIndexes[0] = rowsIndexes[0] % 1000;
          realIndexes[1] = (rowsIndexes[1] % 1000 !== 0) ? rowsIndexes[1] % 1000 : 1000;
          const asd = res[0].values.slice(realIndexes[0], realIndexes[1]);
          asd.forEach(a => {
            const element = this.tableHeaders.reduce((prev, curr) => { prev[curr] = this.getDatum(a.fields, curr); return prev; }, {});
            pageData.push(element);
          });
          this.tableSource.next(pageData);
        },
        err => {
          // TODO send eror to table
          console.log(err);
        }
      );
    } else {
      this.tableSource.next(this.array.slice(rowsIndexes[0], rowsIndexes[1]));
    }

  }

  play(): void {
    this.isPaused = false;
  }

  pause(): void {
    this.isPaused = true;
  }

}
