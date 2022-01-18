import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public baseUrl = environment.baseAPIUrl + 'organiser/';
  public baseUrlWithoutOrg = environment.baseAPIUrl;
 notificationStatusUpdate$ = new Subject<any>();

  constructor( 
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private httpService: HttpService) { }
    
    getNotificationCount() {
      return this.http.get(this.baseUrl + 'countHostNotifications')
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
  /*partner side Notification*/
    getNotification(limit:number, page:number, notificationType:any, notificationTab:any ) {
      return this.http.get(this.baseUrl + `getAllNotification?limit=${limit}&page=${page}&notificationType=${notificationType}&notificationTab=${notificationTab}`)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
    
    /*user side Notification*/
    getUserNotification(limit:number, page:number, notificationType:any, notificationTab:any) {
      return this.http.get(this.baseUrlWithoutOrg + `userAllNotification?limit=${limit}&page=${page}&notificationType=${notificationType}&notificationTab=${notificationTab}`)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
    
    readAllNotification(body:any) {
      return this.http.put(environment.baseAPIUrl + `readAllNotification`, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }

}