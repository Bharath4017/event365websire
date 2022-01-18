import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueRoutingModule } from './venue-routing.module';
import { VenueListComponent } from './venue-list/venue-list.component';
import { VenueDetailComponent } from './venue-detail/venue-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material';
import { VenueListSearchComponent } from './venue-list-search/venue-list-search.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VenueCreateComponent } from './venue-create/venue-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { VenueEditComponent } from './venue-edit/venue-edit.component';
import { AvatarModule } from 'ngx-avatar';
import { VenueLocationComponent } from './venue-location/venue-location.component';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: 'vertical',
  threshold: 5,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: false
};
@NgModule({
  declarations: [VenueListComponent, VenueDetailComponent,
     VenueListSearchComponent, VenueCreateComponent, VenueEditComponent, VenueLocationComponent],
  imports: [
    CommonModule,
    VenueRoutingModule,
    SwiperModule,
    ReactiveFormsModule,
    AvatarModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class VenueModule { }
