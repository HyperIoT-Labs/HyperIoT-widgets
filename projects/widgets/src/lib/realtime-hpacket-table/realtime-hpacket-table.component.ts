import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataPacketFilter, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-realtime-hpacket-table',
  templateUrl: './realtime-hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './realtime-hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RealtimeHPacketTableComponent extends WidgetComponent {

  callBackEnd = false;
  hPacketId: number;
  isPaused: boolean;
  DEFAULT_MAX_TABLE_LINES = 1000;
  @ViewChild('tableChild', { static: false }) tableChild;
  tableSource: Subject<any[]> = new Subject<any[]>();
  array: object[] = [];
  timestamp = new Date();
  tableHeaders = [];
  totalLength = 0;

  offlineDataSubscription: Subscription;

  constructor(
    public dataStreamService: DataStreamService
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
      return;
    }
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
    this.hPacketId = this.widget.config.packetId;
    // subscribe data stream
    const dataPacketFilter = new DataPacketFilter(this.hPacketId, this.widget.config.packetFields, true);
    this.subscribeDataStream(dataPacketFilter);

  }

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
      this.tableChild.resetTable(this.array.length, false);
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
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  pageRequest(rowsIndexes) {
    this.tableSource.next(this.array.slice(rowsIndexes[0], rowsIndexes[1]));
  }

  play(): void {
    this.isPaused = false;
  }

  pause(): void {
    this.isPaused = true;
  }

}
