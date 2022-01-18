import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookTicketComponent } from './book-ticket/book-ticket.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventviewComponent } from './event-view/eventview.component';
import { EventdetailComponent } from './event-detail/eventdetail.component';
import { ReviewEventComponent } from './review-event/review-event.component';
import { YoureventComponent } from './your-event/yourevent.component';
import { EditEventTicketComponent } from './edit-event-ticket/edit-event-ticket.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { RelatedEventComponent } from './related-event/related-event.component';
const routes: Routes = [
  { path: 'list', component: EventListComponent, canActivate: [AuthGuard] },
 { path: 'detail/:id', component: EventdetailComponent},
  { path: 'detail/:id/:eventUrl', component: EventdetailComponent},
  { path: 'update-event/:id', component: CreateEventComponent, canActivate: [AuthGuard]},
  { path: 'create-event', component: CreateEventComponent, canActivate: [AuthGuard]} ,
  { path: 'your-event', component: YoureventComponent, canActivate: [AuthGuard]},
  { path: 'create-ticket', component: CreateTicketComponent, canActivate: [AuthGuard]},
  { path: 'create-ticket/:edit', component: CreateTicketComponent, canActivate: [AuthGuard]},
  { path: 'review-event', component: ReviewEventComponent},
  { path: 'book-ticket/:id', component: BookTicketComponent},
  { path: 'view-event/:id', component: EventviewComponent},
  { path: 'view-event/:id/:ispastevent', component: EventviewComponent},
  { path: 'edit-event-ticket/:id', component: EditEventTicketComponent, canActivate: [AuthGuard] },
  { path: 'related-event/:id', component: RelatedEventComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
