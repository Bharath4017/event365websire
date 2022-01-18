import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RsvpRoutingModule } from './rsvp-routing.module';
import { RsvpComponent } from './rsvp/rsvp.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material';
import { CheckedInRsvpComponent } from './checked-rsvp-listing/checked-in-rsvp.component';
import { InviteComponent } from './invite/invite.component';
import { AvatarModule } from 'ngx-avatar';
import { GroupRspvTicketComponent, Alertdialog } from './group-rspv-ticket/group-rspv-ticket.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { StylePaginatorDirective } from '../../shared/services/custompagination';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    RsvpComponent,
    CheckedInRsvpComponent,
    InviteComponent,
    GroupRspvTicketComponent,
    Alertdialog,
    StylePaginatorDirective
  ],
  imports: [
    CommonModule,
    RsvpRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    AvatarModule,
    NgxQRCodeModule,
    QuillModule.forRoot()

  ]
})
export class RsvpModule { }
