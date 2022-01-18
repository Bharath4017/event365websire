import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseAccountComponent } from './choose-account/choose-account.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { GetpaidRoutingModule } from './getpaid-routing.module';
import { GetpaidComponent } from './getpaid/getpaid.component';
import { MaterialModule } from 'src/app/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [GetpaidComponent, ChooseAccountComponent, ConfirmComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GetpaidRoutingModule,
    MaterialModule,
    FlexLayoutModule,
  ]
})
export class GetpaidModule { }
