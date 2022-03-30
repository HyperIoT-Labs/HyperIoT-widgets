import { NgModule, LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// App-specific imports

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { DashboardConfigService } from './dashboard/dashboard-config.service';
import { WidgetsLayoutComponent } from './dashboard/widgets-layout/widgets-layout.component';
import { DynamicWidgetComponent } from './dashboard/dynamic-widget/dynamic-widget.component';
import { DashboardsListComponent } from './dashboard/dashboards-list/dashboards-list.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { AddWidgetDialogComponent } from './dashboard/add-widget-dialog/add-widget-dialog.component';

import {
  WidgetsModule
} from 'dist/widgets';

import {
  Configuration,
  ConfigurationParameters,
  CoreModule,
  HyperiotBaseModule,
  HUserClientModule,
  AuthenticationService,
  DashboardwidgetsService
} from '@hyperiot/core';

import { GridsterModule } from 'angular-gridster2';
import { HomeComponent } from './home/home.component';
import { WidgetSettingsDialogComponent } from './dashboard/widget-settings-dialog/widget-settings-dialog.component';
import { TimeChartSettingsComponent } from './dashboard/widget-settings-dialog/time-chart-settings/time-chart-settings.component';
import { EventsLogSettingsComponent } from './dashboard/widget-settings-dialog/events-log-settings/events-log-settings.component';
import { TextLabelSettingsComponent } from './dashboard/widget-settings-dialog/text-label-settings/text-label-settings.component';
import { StatsChartSettingsComponent } from './dashboard/widget-settings-dialog/stats-chart-settings/stats-chart-settings.component';
import { SensorValueSettingsComponent } from './dashboard/widget-settings-dialog/sensor-value-settings/sensor-value-settings.component';
import { PacketSelectComponent } from './dashboard/widget-settings-dialog/packet-select/packet-select.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { FullscreenDialogComponent } from './dashboard/fullscreen-dialog/fullscreen-dialog.component';

PlotlyModule.plotlyjs = PlotlyJS;

// use the require method provided by webpack
declare const require;

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    apiKeys: {},
    username: '',
    password: '',
    accessToken: ''
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    WidgetsLayoutComponent,
    DashboardsListComponent,
    DashboardViewComponent,
    AddWidgetDialogComponent,
    DynamicWidgetComponent,
    HomeComponent,
    WidgetSettingsDialogComponent,
    TimeChartSettingsComponent,
    EventsLogSettingsComponent,
    TextLabelSettingsComponent,
    StatsChartSettingsComponent,
    SensorValueSettingsComponent,
    PacketSelectComponent,
    FullscreenDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GridsterModule,
    WidgetsModule,
    CoreModule,
    HyperiotBaseModule,
    HUserClientModule.forRoot(apiConfigFactory),
    BrowserAnimationsModule
  ],
  providers: [
    AuthenticationService,
    DashboardConfigService,
    DashboardwidgetsService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
