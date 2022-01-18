import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { AddNewCardsComponent } from './add-new-cards/add-new-cards.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentsComponent } from './payments/payments.component';
import { MaterialModule } from 'src/app/material';
import { AvatarModule } from 'ngx-avatar';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { NgxStripeModule } from 'ngx-stripe';
import { NgxPayPalModule } from 'ngx-paypal';
@NgModule({
  declarations: [PaymentMethodsComponent, AddNewCardsComponent, PaymentsComponent, PaymentSuccessComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgxStripeModule.forRoot('pk_live_SA1hCRyhG9jwKOv5otXSEylr00ZREyZFGr'),
    NgxPayPalModule,
    FlexLayoutModule,
    AvatarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaymentModule { }
