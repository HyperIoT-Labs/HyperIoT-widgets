import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { WidgetsComponent } from './widgets.component';
import { WidgetChartComponent } from './widget-chart.component';
import { EventsLogComponent } from './events-log/events-log.component';
import { TextLabelComponent } from './text-label/text-label.component';
import { SensorValueComponent } from './sensor-value/sensor-value.component';
import { StatsChartComponent } from './stats-chart/stats-chart.component';
import { TimeChartComponent } from './time-chart/time-chart.component';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;
export { PlotlyModule, PlotlyJS };

@NgModule({
  declarations: [
    WidgetsComponent,
    WidgetChartComponent,
    EventsLogComponent,
    TextLabelComponent,
    SensorValueComponent,
    StatsChartComponent,
    TimeChartComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    WidgetsComponent,
    WidgetChartComponent,
    EventsLogComponent,
    TextLabelComponent,
    SensorValueComponent,
    StatsChartComponent,
    TimeChartComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class WidgetsModule { }

export * from './data/time-series';
export * from './data/data-packet-filter';
export * from './widget.component';
