import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertdialogComponent } from './alertdialog/alertdialog.component';
import { ImageuploadComponent } from './image-upload/imageupload.component';
import { MaterialModule } from 'src/app/material';
import { DndDirective } from 'src/app/shared/services/dragndrop.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PosteventComponent } from './post-event/postevent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YoureventalertComponent } from './your-event-alert/youreventalert.component';
import { AlerteventComponent } from './alertevent/alertevent.component';
import { SubVenueAvaliableAlertComponent } from './sub-venue-avaliable-alert/sub-venue-avaliable-alert.component';
import { TwentyMinPopUpComponent } from './twenty-min-pop-up/twenty-min-pop-up.component';
import { AlertNoSubVenueComponent } from './alert-no-sub-venue/alert-no-sub-venue.component';
import { RspvDialogComponent } from './rspv-dialog/rspv-dialog.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import { TicketSearchComponent } from './ticket-search/ticket-search.component';
import { TicketChekedInSuccessComponent } from './ticket-cheked-in-success/ticket-cheked-in-success.component';
import { AddCalendarEventComponent } from './add-calendar-event/add-calendar-event.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ContactUsCallComponent } from './contact-us-call/contact-us-call.component';
import { SendMessageAlertComponent } from './send-message-alert/send-message-alert.component';
import { DeleteVenueAlertComponent } from './delete-venue-alert/delete-venue-alert.component';
import { AddNewAccountComponent } from './add-new-account/add-new-account.component';
import { RouterModule } from '@angular/router';
import { PaymentSubmitComponent } from './payment-submit/payment-submit.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { BecomePartnerComponent } from './become-partner/become-partner.component';
import { AvatarModule } from 'ngx-avatar';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [AlertdialogComponent, ImageuploadComponent,
     DndDirective, PosteventComponent, YoureventalertComponent,
     AlerteventComponent, SubVenueAvaliableAlertComponent,
     TwentyMinPopUpComponent, AlertNoSubVenueComponent,
     RspvDialogComponent, ShareDialogComponent, LoginDialogComponent,
      TicketSearchComponent, TicketChekedInSuccessComponent,
       AddCalendarEventComponent, ContactUsCallComponent,
        SendMessageAlertComponent, DeleteVenueAlertComponent,
         AddNewAccountComponent,  PaymentSubmitComponent, SuccessDialogComponent, BecomePartnerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxQRCodeModule,
    AvatarModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    NgxIntlTelInputModule,
    QuillModule.forRoot()

  ],
  exports: [
    DndDirective
  ],
  entryComponents: [AlertdialogComponent, DeleteVenueAlertComponent, ImageuploadComponent, RspvDialogComponent, ShareDialogComponent]
})
export class dialogModule { }
