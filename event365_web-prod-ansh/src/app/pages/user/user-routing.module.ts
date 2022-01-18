import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AddCustomerReviewComponent } from './add-customer-review/add-customer-review.component';
import { BookedEventsComponent } from './booked-events/booked-events.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { AddPreferencesComponent } from './preferences/add-preferences/add-preferences.component';
import { PreferencesListComponent } from './preferences/preferences-list/preferences-list.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

const routes: Routes = [
  { path: 'booked-events', component: BookedEventsComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'favourites', component: FavouritesComponent},
  { path: 'preferences-list', component: PreferencesListComponent},
  { path: 'add-preferences', component: AddPreferencesComponent},
  { path: 'add-preferences/:id', component: AddPreferencesComponent},
  { path: 'recommendations', component: RecommendationsComponent},
  { path: 'user-settings', component: UserSettingsComponent},
  { path: 'add-review-customer/:id', component: AddCustomerReviewComponent},
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'about-us', component: AboutUsComponent},
  { path: 'customer-review/:id', component: CustomerReviewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
