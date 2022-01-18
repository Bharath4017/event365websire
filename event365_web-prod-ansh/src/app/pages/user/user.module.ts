import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { PreferencesListComponent } from './preferences/preferences-list/preferences-list.component';
import { AddPreferencesComponent } from './preferences/add-preferences/add-preferences.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { BookedEventsComponent } from './booked-events/booked-events.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material';
import { AddCustomerReviewComponent } from './add-customer-review/add-customer-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import { AboutUsComponent } from './about-us/about-us.component';


@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [
    PreferencesListComponent,
    AddPreferencesComponent,
    RecommendationsComponent,
    BookedEventsComponent,
    FavouritesComponent,
    ChangePasswordComponent,
    UserSettingsComponent,
    AddCustomerReviewComponent,
    ContactUsComponent,
    CustomerReviewComponent,
    AboutUsComponent,
  ],
  imports: [CommonModule, UserRoutingModule, SharedModule, FlexLayoutModule, MaterialModule ,  FormsModule, ReactiveFormsModule,  AvatarModule],
})
export class UserModule {}
