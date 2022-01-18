import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventRoutingModule } from './event-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventdetailComponent } from './event-detail/eventdetail.component';
import { MaterialModule } from 'src/app/material';
import { AgmCoreModule } from '@agm/core';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { CreateEventComponent } from './create-event/create-event.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTimepickerModule } from 'mat-timepicker';
import { YoureventComponent } from './your-event/yourevent.component';
import { ReviewEventComponent } from './review-event/review-event.component';
import { BookTicketComponent } from './book-ticket/book-ticket.component';
import { EventviewComponent } from './event-view/eventview.component';
import { EditEventTicketComponent } from './edit-event-ticket/edit-event-ticket.component';
import { AvatarModule } from 'ngx-avatar';
import { RelatedEventComponent } from './related-event/related-event.component';
import { QuillModule } from 'ngx-quill';



const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: 'vertical',
  threshold: 5,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: false
};
@NgModule({
  declarations: [EventListComponent,
     CreateTicketComponent, EventdetailComponent, CreateEventComponent, YoureventComponent,
      ReviewEventComponent, BookTicketComponent, EventviewComponent, EditEventTicketComponent, RelatedEventComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    MaterialModule,
    SharedModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatTimepickerModule,
    AvatarModule,
    AgmCoreModule,
    QuillModule.forRoot()
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class EventModule { }
