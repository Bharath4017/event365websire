import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { retry, timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  public baseUrl = environment.baseAPIUrl;
  public listAllRspv = this.baseUrl + 'organiser/allRSVP';
  public listCheckedRspv = this.baseUrl + 'organiser/fetchCheckedInUser';
  public sendInviteUser = this.baseUrl + 'organiser/inviteUser/';
  public rsvpInviteListAllContacts = this.baseUrl + 'organiser/contactListAttendees';
  public rsvpInviteListPastAttendees = this.baseUrl + 'organiser/contactListAttendees';
  public partnerEvents = this.baseUrl + 'organiser/events';
  public eventTickets = this.baseUrl + 'organiser/getEventTicket/';
  public moveCheckedIn = this.baseUrl + 'organiser/checkIn/';
  public USerDetails = this.baseUrl + 'organiser/getUser/';
  public TicketDetails = this.baseUrl + 'organiser/ticketDetail/';
  public userRsvpDetails = this.baseUrl + 'getUSerRSVP/';
  public userRsvpstatus = this.baseUrl + 'statusRSPV/';
  public userRsvpTicketBooked = this.baseUrl + 'getUserTicketBooked/';
  public userRsvpTicketCancel = this.baseUrl + 'userTicketCancelled';
  public userRsvpTicketBookedWithPage = this.baseUrl + 'getUserTicketBookedWithPage/';
  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService){}

    getRspvLIst(queryParams: any): any {
      return this.http
        .get(this.listAllRspv , { params: queryParams })
        .toPromise()
        .then((response) => response)
        .catch(this.errorHandler.handleError);
    }

    getRspvCheckedLIst(queryParams: any): any {
      return this.http
        .get(this.listCheckedRspv , { params: queryParams })
        .toPromise()
        .then((response) => response)
        .catch(this.errorHandler.handleError);
    }

    postSendInviteUser(id: any, body: any): any {
      return this.http
      .post(this.sendInviteUser + id, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
    postRsvpInviteListAllContacts(queryParams: any, body: any): any {
      let query = '';
      if (queryParams) {
      let esc = encodeURIComponent;
      query = Object.keys(queryParams)
        .map(k => esc(k) + '=' + esc(queryParams[k]))
        .join('&');
      }
      query = query !== '' ? '?' + query : '';
      return this.http
      .post(this.rsvpInviteListAllContacts + query, body).pipe(
        retry(3),
        timeout(1000),
        catchError(this.errorHandler.handleError)
      );
    }
   
    postRsvpInviteListPastAttendees(body: any): any {
      return this.http
      .post(this.rsvpInviteListPastAttendees, body).pipe(
        retry(3),
        timeout(1000),
        catchError(this.errorHandler.handleError)
      );
    }

    getEventTicketDetails(queryParams: any): any {
      return this.http
        .get(this.eventTickets + queryParams)
        .toPromise()
        .then((response) => response)
        .catch(this.errorHandler.handleError);
    }
    getAllPartnerEvents(): any {
      return this.http.get(this.partnerEvents)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
    putCheckdInMOve(body: any): any {
      return this.http.put(this.moveCheckedIn, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }

    getUserDetails(id: any): any {
      return this.http.get(this.USerDetails + id)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }

    getTicketDetails(queryParams: any): any {
      return this.http.get(this.TicketDetails, { params: queryParams })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }


    getUserRsvpDetails(queryParams: any): any {
      return this.http.get(this.userRsvpDetails,  { params: queryParams })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }

    putRsvpStatus(body: any): any {
      return this.http.put(this.userRsvpstatus, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
    putRsvpTicketCancel(body: any): any {
      return this.http.put(this.userRsvpTicketCancel, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
    

 
    getUserRsvpTicketBooked(): any {
      return this.http.get(this.userRsvpTicketBooked)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }
    getUserRsvpTicketBookedPage(queryParams: any): any {
      return this.http.get(this.userRsvpTicketBookedWithPage, { params: queryParams })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
    }

}
