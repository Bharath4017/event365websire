import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { HelpComponent } from './help/help.component';
import { SettingsComponent } from './settings/settings.component';
import { FaqComponent } from './faq/faq.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { UserListComponent } from './manageUsers/user-list/user-list.component';
import { AddUpdateUserComponent } from './manageUsers/add-update-user/add-update-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../../material';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { IntlInputPhoneModule } from 'intl-input-phone';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AvatarModule } from 'ngx-avatar';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [
    HelpComponent,
    SettingsComponent,
    FaqComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    UserListComponent,
    AddUpdateUserComponent,
    UpdateProfileComponent,
    ChangepasswordComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // IntlInputPhoneModule,
    AvatarModule,
    NgxIntlTelInputModule
  ],
})
export class ProfileModule {}
