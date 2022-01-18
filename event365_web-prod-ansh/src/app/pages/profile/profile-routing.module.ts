import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { FaqComponent } from './faq/faq.component';
import { HelpComponent } from './help/help.component';
import { AddUpdateUserComponent } from './manageUsers/add-update-user/add-update-user.component';
import { UserListComponent } from './manageUsers/user-list/user-list.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SettingsComponent } from './settings/settings.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent},
  { path: 'user-list', component: UserListComponent},
  { path: 'add-user', component: AddUpdateUserComponent},
  { path: 'edit-user/:id', component: AddUpdateUserComponent},
  { path: 'help', component: HelpComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'update-profile', component: UpdateProfileComponent},
  { path: 'change-password', component: ChangepasswordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
