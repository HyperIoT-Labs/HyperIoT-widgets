import { Component, ViewEncapsulation, ViewChild } from '@angular/core';

import { DataStreamService, DataPacketFilter } from '@hyperiot/core';

import { WidgetsService } from '../widgets.service';
import { WidgetComponent } from '../widget.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DashboardOfflineDataService } from '@hyperiot/core';

@Component({
  selector: 'hyperiot-offline-hpacket-table',
  templateUrl: './offline-hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './offline-hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfflineHpacketTableComponent extends WidgetComponent {

  callBackEnd: boolean = false;
  dataSource: MatTableDataSource<Map<string, any>>;
  displayedColumns: string[];
  hPacketId: number;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  provaMap: Map<number, any[]>;

  constructor(public dataStreamService: DataStreamService,
    private dashboardOfflineDataService: DashboardOfflineDataService) {
    super(dataStreamService);
  }

  configure() {
    console.log(this.widget.config);
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && Object.keys(this.widget.config.packetFields).length > 0)) {
      this.isConfigured = false;
      // set callback end
      this.callBackEnd = true;
      return;
    }
    // reset fields
    this.displayedColumns = [];
    this.dataSource = new MatTableDataSource<Map<string, any>>();
    this.provaMap = new Map<number, any[]>();
    // Set Callback End
    this.callBackEnd = true;
    // set widget data configuration
    this.hPacketId = this.widget.config.packetId;
    this.displayedColumns = this.widget.config.packetFields;
    const fieldIds = Object.keys(this.widget.config.packetFields);
    if (fieldIds.length > 0) {
      this.displayedColumns = [];
      fieldIds.forEach(hPacketFieldId => this.displayedColumns.push(this.widget.config.packetFields[hPacketFieldId]));
    }
  }

  private setDatasource(): void {
    // ci sarà un metodo che recupererà solo i pacchetti che gli interessano
    // per ora non è così visto che non si sa a quale azione il service si collegherà
    // quindi alla richiesta di aggiornamento si invocherà il metodo del service che recupera tutti i pacchetti
    
    this.dashboardOfflineDataService.getHPacketMap(1580296888685, 1580296974843).subscribe((response: any) => {
      let array: Map<string, any>[] = [];
      console.log(response);
      if(response[0]["hPacketId"] === this.hPacketId) {
        response[0]["values"].forEach(hPacket => {
          let cells: Map<string, any> = new Map();
          if(hPacket["fields"]) {
            this.displayedColumns.forEach(column => {
              if(hPacket["fields"]["map"][column]) {
                let type: string = hPacket["fields"]["map"][column]["type"] ? 
                    hPacket["fields"]["map"][column]["type"].toLowerCase() : null;
                if(type) {
                  type = (type === "timestamp" ? "long" : type);
                  cells.set(column, hPacket["fields"]["map"][column]["value"] && hPacket["fields"]["map"][column]["value"][type] ? 
                    hPacket["fields"]["map"][column]["value"][type] : "-");
                }
                else
                  cells.set(column, "-");
              }
              else
                cells.set(column, "-");
            });
            array.push(cells);
          }
        });
      }
      this.dataSource = new MatTableDataSource<Map<string, any>>(array);
      this.dataSource.paginator = this.paginator;
    });
  }

  getOfflineData(startDate: Date, endDate: Date) {
    throw new Error('Method not implemented.');
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:refresh':
        console.log(this.widget.config);
        this.setDatasource();
        break;
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  play(): void {
    throw new Error('Method not implemented.');
  }

  pause(): void {
    throw new Error('Method not implemented.');
  }

}
