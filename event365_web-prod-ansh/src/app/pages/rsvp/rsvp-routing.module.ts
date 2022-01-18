import { CustomPreloadingStrategy } from './../../shared/services/custom-preloading';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckedInRsvpComponent } from './checked-rsvp-listing/checked-in-rsvp.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { InviteComponent } from './invite/invite.component';
import { GroupRspvTicketComponent } from './group-rspv-ticket/group-rspv-ticket.component';

const routes: Routes = [
  { path: 'rspv-listing/:id', component: RsvpComponent},
  { path: 'invite/:id', component: InviteComponent},
  { path: 'checked-listing/:id', component: CheckedInRsvpComponent},
  { path: 'group-ticket', component: GroupRspvTicketComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RsvpRoutingModule { }
