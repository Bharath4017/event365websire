import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
​
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  userType: any;
  activeUrl: any;
  customUrl: any;
  useraccessPermissions: any = ['notification', 'profile', 'user', 'payment', 'model', 'chat', 'event/detail'];
  organiseraccessPermissions: any = ['notification', 'profile', 'event', 'venue', 'payment', 'getpaid'];
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.activeUrl = state.url.split('/')[1];
   // console.log(this.activeUrl);
​
    this.customUrl = state.url.split('/')[1] + '/' + state.url.split('/')[2];
  //  console.log(this.customUrl);
​
    const authToken = localStorage.getItem('authToken');
    this.userType = localStorage.getItem('userType');
​
    if (authToken) {
      if (JSON.parse(this.userType) === 'customer'
        && (this.useraccessPermissions.includes(this.activeUrl))
        || (this.useraccessPermissions.includes(this.customUrl))) {
      //  console.log(this.userType + '1');
        return true;
      }
      if (JSON.parse(this.userType) !==  'customer'
        && (this.organiseraccessPermissions.includes(this.activeUrl))
        || (this.organiseraccessPermissions.includes(this.customUrl))) {
      //  console.log(this.userType);
        return true;
      }
      else {
        this.router.navigate(['/home']);
        return false;
      }
    }
    else {
      this.router.navigate(['/auth/login']);
      return false;
    }
​
  }
}
