import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardsListComponent } from './dashboard/dashboards-list/dashboards-list.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboards', component: DashboardsListComponent },
  { path: 'dashboards/:id', component: DashboardViewComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
