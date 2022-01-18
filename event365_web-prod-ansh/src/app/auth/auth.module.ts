import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmitInfoComponent } from './submit-info/submit-info.component';
import { AccontCreationComponent } from './submit-info/accont-creation/accont-creation.component';
import { SubmitPreferenceComponent } from './submit-info/submit-preference/submit-preference.component';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ResetSuccessfulComponent } from './submit-info/reset-successful/reset-successful.component';
import { UserAccountCreationComponent } from './submit-info/user-account-creation/user-account-creation.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EmailVerificationComponent,
    SubmitInfoComponent,
    AccontCreationComponent,
    SubmitPreferenceComponent,
    ResetSuccessfulComponent,
    UserAccountCreationComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
  ],
})
export class AuthModule {}
