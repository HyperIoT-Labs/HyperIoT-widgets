import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardOfflineDataService, DataPacketFilter, DataStreamService } from '@hyperiot/core';
import { Subscription } from 'rxjs';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-offline-hpacket-table',
  templateUrl: './offline-hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './offline-hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfflineHpacketTableComponent extends WidgetComponent {

  callBackEnd = false;
  dataSource: MatTableDataSource<object>;
  DEFAULT_MAX_TABLE_LINES = 100;
  displayedColumns: string[];
  hPacketId: number;
  isPaused: boolean;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  provaMap: Map<number, any[]>;
  timestamp = new Date();

  offlineDataSubscription: Subscription;

  constructor(
    public dataStreamService: DataStreamService,
    private dashboardOfflineDataService: DashboardOfflineDataService
  ) {
    super(dataStreamService);
  }

  configure() {
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && Object.keys(this.widget.config.packetFields).length > 0)) {
      this.isConfigured = false;
      // set callback end
      setTimeout(() => {
        this.callBackEnd = true;
      }, 500);
      this.setDatasource();
      return;
    }
    // reset fields
    this.displayedColumns = [];
    //this.dataSource = new MatTableDataSource<Map<string, any>>();
    this.dataSource = new MatTableDataSource<object>();
    this.provaMap = new Map<number, any[]>();
    // Set Callback End
    setTimeout(() => {
      this.callBackEnd = true;
    }, 500);
    // set widget data configuration
    this.hPacketId = this.widget.config.packetId;
    this.displayedColumns = this.widget.config.packetFields;
    const fieldIds = Object.keys(this.widget.config.packetFields);
    if (fieldIds.length > 0) {
      this.displayedColumns = [];
      fieldIds.forEach(hPacketFieldId => this.displayedColumns.push(this.widget.config.packetFields[hPacketFieldId]));
    }
    // subscribe data stream
    const dataPacketFilter = new DataPacketFilter(this.hPacketId, this.widget.config.packetFields, true);
    this.subscribeDataStream(dataPacketFilter);

    this.setDatasource();

  }

  private subscribeDataStream(dataPacketFilter: DataPacketFilter): void {
    const array: object[] = [];
    const maxTableLines = this.widget.config.maxLogLines ? this.widget.config.maxLogLines : this.DEFAULT_MAX_TABLE_LINES;
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      if (this.isPaused) {
        return;
      }
      array.unshift(eventData[1]);
      if (array.length > maxTableLines) {
        array.pop();
      }
      this.dataSource = new MatTableDataSource<object>(array);
    });
  }

  private setDatasource(): void {
    // ci sarà un metodo che recupererà solo i pacchetti che gli interessano
    // per ora non è così visto che non si sa a quale azione il service si collegherà
    // quindi alla richiesta di aggiornamento si invocherà il metodo del service che recupera tutti i pacchetti

    if (this.isPaused) {  // realtime streaming is in pause, widget can receive offline data

      // TODO make unsubscribe previous subscribtion
      if (this.offlineDataSubscription) {
        this.offlineDataSubscription.unsubscribe();
      }
      this.offlineDataSubscription = this.dashboardOfflineDataService.getPacketDataSubject(this.hPacketId).subscribe(
        res => {
          const array: object[] = [];
          res.forEach(hPacket => {
            const cells: object = new Object();
            if (hPacket.fields) {
              this.displayedColumns.forEach(column => {
                if (hPacket.fields.map[column]) {
                  let type: string = hPacket.fields.map[column].type ?
                    hPacket.fields.map[column].type.toLowerCase() : null;
                  if (type) {
                    type = (type === 'timestamp' ? 'long' : type);
                    cells[column] = hPacket.fields.map[column].value && hPacket.fields.map[column].value[type] ?
                      hPacket.fields.map[column].value[type] : '-';
                  } else {
                    cells[column] = '-';
                  }
                } else {
                  cells[column] = '-';
                }
              });
              array.push(cells);
            }
          });
          this.dataSource = new MatTableDataSource<object>(array);
          this.dataSource.paginator = this.paginator;
        });
    }
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
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  play(): void {
    this.isPaused = false;
  }

  pause(): void {
    this.isPaused = true;
  }

}
