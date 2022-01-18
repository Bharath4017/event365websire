import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from '../../shared/utils/strings';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  STRINGS: any = localString;
  constructor(private router: Router,  private sharedService: SharedService) { }

  handleError(error: any): Promise<any> {
    if (error.status === 401) {
      return Promise.reject(error);
    }
    if (error.status === 400) {
      return Promise.reject(error);
    }
    if (error.status === 500) {
      return Promise.reject(error);
    }
    if (error.status === 404) {
      return Promise.reject(error);
    }
    if (error.status === 601) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }

  routeAccordingToError(error: any): any {
    if (error.status === 401) {
      localStorage.clear();
      localStorage.setItem(
        'userType',
        JSON.stringify(this.STRINGS.userType.guestUser)
      );
      this.sharedService.headerContent.emit({ isLogin: true });
      this.router.navigate(['/home']);
    }
  }
}
