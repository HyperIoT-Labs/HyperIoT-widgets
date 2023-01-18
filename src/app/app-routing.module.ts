import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { DashboardsListComponent } from './dashboard/dashboards-list/dashboards-list.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { AddWidgetDialogComponent } from './dashboard/add-widget-dialog/add-widget-dialog.component';
import { WidgetSettingsDialogComponent } from './dashboard/widget-settings-dialog/widget-settings-dialog.component';
import { FullscreenDialogComponent } from './dashboard/fullscreen-dialog/fullscreen-dialog.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'dashboards', component: DashboardsListComponent },
  // {
  //   path: 'dashboards/:dashboardId',
  //   component: DashboardViewComponent,
  //   children: [
  //     {
  //       path: 'widgets',
  //       component: AddWidgetDialogComponent,
  //       outlet: 'modal'
  //     },
  //     {
  //       path: 'settings/:widgetId',
  //       component: WidgetSettingsDialogComponent,
  //       outlet: 'modal'
  //     },
  //     {
  //       path: 'fullscreen/:widgetId',
  //       component: FullscreenDialogComponent,
  //       outlet: 'modal'
  //     }
  //   ]
  // },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
