import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GetpaidComponent } from './getpaid/getpaid.component';
import { ChooseAccountComponent } from './choose-account/choose-account.component';
import { ConfirmComponent } from './confirm/confirm.component';

const routes: Routes = [
  { path: '', component: GetpaidComponent},
  { path: 'choose/account', component: ChooseAccountComponent},
  { path: 'confirm/:id', component: ConfirmComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GetpaidRoutingModule { }
