import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SubmitInfoComponent } from './submit-info/submit-info.component';
import { AccontCreationComponent } from './submit-info/accont-creation/accont-creation.component';
import { SubmitPreferenceComponent } from './submit-info/submit-preference/submit-preference.component';
import { ResetSuccessfulComponent } from './submit-info/reset-successful/reset-successful.component';
import { UserAccountCreationComponent } from './submit-info/user-account-creation/user-account-creation.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'email-verification', component: EmailVerificationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/:partner', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'submit-info', component: SubmitInfoComponent },
  { path: 'account-creation', component: AccontCreationComponent },
  { path: 'submit-preference', component: SubmitPreferenceComponent },
  { path: 'reset-password-success', component: ResetSuccessfulComponent},
  { path: 'user-account-creation', component: UserAccountCreationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
