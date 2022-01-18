import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewCardsComponent } from './add-new-cards/add-new-cards.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentsComponent } from './payments/payments.component';

const routes: Routes = [
  { path: 'add-new-card', component: AddNewCardsComponent },
  { path: 'payment-method', component: PaymentMethodsComponent},
  { path: 'ticket-payment/:id', component: PaymentMethodsComponent},
  { path: 'all-payment/:id', component: PaymentsComponent},
  { path: 'http://3.130.1.68/payment/success', component: PaymentSuccessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
