import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenueCreateComponent } from './venue-create/venue-create.component';
import { VenueDetailComponent } from './venue-detail/venue-detail.component';
import { VenueEditComponent } from './venue-edit/venue-edit.component';
import { VenueListSearchComponent } from './venue-list-search/venue-list-search.component';
import { VenueListComponent } from './venue-list/venue-list.component';
import { VenueLocationComponent } from './venue-location/venue-location.component';

const routes: Routes = [
  { path: 'list', component: VenueListComponent},
  { path: 'list/search', component: VenueListSearchComponent},
  { path: 'detail/:id', component: VenueDetailComponent},
  { path: 'create', component: VenueCreateComponent},
  { path: 'edit/:id', component: VenueEditComponent},

  { path: 'venuelocation', component: VenueLocationComponent},
  { path: 'location/detail/:locid', component: VenueDetailComponent},
  { path: 'location/edit/:locid', component: VenueEditComponent},
  { path: 'location/create/:locid', component: VenueCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenueRoutingModule { }
