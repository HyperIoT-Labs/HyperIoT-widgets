import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MomentModule } from 'ngx-moment';

import { DataStreamService } from '@hyperiot/core';

import { WidgetsService } from './widgets.service';

import { CommonToolbarComponent } from './common-toolbar/common-toolbar.component';
import { WidgetChartComponent } from './widget-chart.component';
import { EventsLogComponent } from './events-log/events-log.component';
import { TextLabelComponent } from './text-label/text-label.component';
import { SensorValueComponent } from './sensor-value/sensor-value.component';
import { StatsChartComponent } from './stats-chart/stats-chart.component';
import { TimeChartComponent } from './time-chart/time-chart.component';
import { GaugeValueComponent } from './gauge-value/gauge-value.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ComponentsModule } from '@hyperiot/components';

import { HpacketTableComponent } from './hpacket-table/hpacket-table.component';
import { RealtimeHPacketTableComponent } from './realtime-hpacket-table/realtime-hpacket-table.component';
import { FourierChartComponent } from './fourier-chart/fourier-chart.component';

import { PlotlyModule } from 'angular-plotly.js';
import { ImageDataComponent } from './image-data/image-data.component';
import { AlgorithmTableComponent } from './algorithm-table/algorithm-table.component';
import { EventTableComponent } from './event-table/event-table.component';
import { CronEditorComponent } from './cron-editor/cron-editor.component';
import { TimePickerComponent } from './cron-editor/time-picker/time-picker.component';

@NgModule({
  declarations: [
    CommonToolbarComponent,
    WidgetChartComponent,
    EventsLogComponent,
    TextLabelComponent,
    SensorValueComponent,
    StatsChartComponent,
    TimeChartComponent,
    FourierChartComponent,
    GaugeValueComponent,
    HpacketTableComponent,
    RealtimeHPacketTableComponent,
    ImageDataComponent,
    AlgorithmTableComponent,
    EventTableComponent,
    CronEditorComponent, 
    TimePickerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    PlotlyModule,
    ComponentsModule,
    MatTableModule,
    MatPaginatorModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        m: 59
      }
    })
  ],
  providers: [
    DataStreamService,
    WidgetsService
  ],
  exports: [
    CommonToolbarComponent,
    WidgetChartComponent,
    EventsLogComponent,
    TextLabelComponent,
    SensorValueComponent,
    StatsChartComponent,
    TimeChartComponent,
    FourierChartComponent,
    GaugeValueComponent,
    HpacketTableComponent,
    RealtimeHPacketTableComponent,
    ImageDataComponent,
    AlgorithmTableComponent,
    EventTableComponent,
    CronEditorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetsModule { }

export * from './widgets.service';
export * from './data/time-series';
export * from './widget.component';
