import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
​
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule) },
  // { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)},
  { path: 'event', loadChildren: () => import('./event/event.module').then(m => m.EventModule)},
  { path: 'notification', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule)},
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)},
  { path: 'rsvp', loadChildren: () => import('./rsvp/rsvp.module').then(m => m.RsvpModule)},
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  { path: 'venue', loadChildren: () => import('./venue/venue.module').then(m => m.VenueModule)},
  { path: 'getpaid', loadChildren: () => import('./getpaid/getpaid.module').then(m => m.GetpaidModule)},
  { path: 'model', loadChildren: () => import('../components/components.module').then(m => m.ComponentsModule)},
  { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)},
];
​
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }