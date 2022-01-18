import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  public baseUrl = environment.baseAPIUrl;
  stripePayment: any = this.baseUrl + 'createSessionId';
  allPayment: any = this.baseUrl + 'organiser/getUsersPayments';
  paymentsDetails: any = this.baseUrl + 'organiser/userPaymentDetails';
  cancelEventTicket: any = this.baseUrl + 'organiser/ticketCancelled';
  ticketForEvent: any = this.baseUrl + 'organiser/ticketForEvent/';
  ticketPaymentRequestUser: any = this.baseUrl + 'TicketPaymentRequest';
  paymentConfirmetion: any = this.baseUrl + 'PaymentConfirm';
  public cardDetails: any = this.baseUrl + 'stripeCard/2';
  public clientSecret = this.baseUrl + 'organiser/GetClientSecret';
  public paymentDone = this.baseUrl + 'organiser/paidEventPaymentDone';
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) { }


  postStripePayment(body: any): any {
    return this.http
      .post(this.stripePayment, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getAllUserPayments(queryParams: any): any {
    return this.http.get(this.allPayment , { params: queryParams })
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  getAllPaymentsDetails(queryParams: any): any {
    return this.http.get(this.paymentsDetails , { params: queryParams })
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  cancelTicket(body: any): any {
    return this.http.put(this.cancelEventTicket , body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  allTicketForEvent(id: any): any {
    return this.http.get(this.ticketForEvent + id)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  postClientSecret(body: any): any {
    return this.http
      .post(this.clientSecret, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getStripeCardDetails(): any {
    return this.http.post(this.cardDetails, {})
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }

  ticketPaymentRequest(body: any): any {
    return this.http
      .post(this.ticketPaymentRequestUser, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  confirmPayment(body: any): any {
    return this.http
      .post(this.paymentConfirmetion, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  paymentDoneAfterEventCreate(body: any): any{
    return this.http
    .post(this.paymentDone, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
}
