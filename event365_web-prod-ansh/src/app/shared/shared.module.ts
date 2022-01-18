import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelComponent } from '../components/model/model.component';
import { PreferenceCategory } from './pipes/preferenceCategory.pipe';
import { UpcomingEventDuration } from './pipes/upcomingEventDuration.pipe';
import { WeekDayNamePipe } from './pipes/week-day-name.pipe';
import { CustomDatepickerComponent } from '../components/customdatepicker/custom-datepicker/custom-datepicker.component';
import { MaterialModule } from 'src/app/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ModelComponent, PreferenceCategory , UpcomingEventDuration, WeekDayNamePipe, CustomDatepickerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [ModelComponent, PreferenceCategory, UpcomingEventDuration, WeekDayNamePipe, CustomDatepickerComponent]
})
export class SharedModule { }
