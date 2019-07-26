import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
} from '@hyperiot/widgets';

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
import { DynamicModule } from 'ng-dynamic-component';
import { HomeComponent } from './home/home.component';
import { WidgetSettingsDialogComponent } from './dashboard/widget-settings-dialog/widget-settings-dialog.component';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    apiKeys: {},
    username: '',
    password: '',
    accessToken: ''
  }
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
    WidgetSettingsDialogComponent
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
  ],
  providers: [AuthenticationService, DashboardConfigService, DashboardwidgetsService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
