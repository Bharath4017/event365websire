import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public baseUrl = environment.baseAPIUrl;
  eventdetail: any = this.baseUrl + "getUserEventDetail/";
  orgainizerEvent: any = this.baseUrl + "organiser/getEventDetails/";
  venueImages: any = this.baseUrl + "organiser/venueimages/";
  createEvent: any = this.baseUrl + 'organiser/postEvent';
  editEvent: any = this.baseUrl + 'organiser/editEvent';
  deleteEvent: any = this.baseUrl + 'organiser/event/';
  createevnt: any = this.baseUrl + 'organiser/event';
  eventHostdetail = this.baseUrl + 'organiser/event/';
  getAllEventList = this.baseUrl + 'getEventList';
  editEventTicket = this.baseUrl + 'organiser/getEventTicket/';
  editedTickets = this.baseUrl + 'organiser/editEventTicket/';
  bookTickets = this.baseUrl + "getTicketInfo/";
  userBookTicket = this.baseUrl + "UserTicketBooked/";
  bookTicketAmountVerify = this.baseUrl + "beforeCheckout";
  eventPrive = this.baseUrl + 'organiser/paidEventPrice';
  eventAvailability = this.baseUrl + 'organiser/eventIsAvailability';
  hostDetails = this.baseUrl + 'organiser/hostDetail';
  relatedEvent = this.baseUrl + 'organiser/relatedEvent/';
  createTicketbyEdit = this.baseUrl + 'organiser/createTicket';
  verifyCoupanCode = this.baseUrl + "verifyCoupanCode";
  customUrlVarify = this.baseUrl + 'organiser/checkCustomeUrl';

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) { }

  // getUserEventdetailbywithUrlId(id: number, customUrl: any) {
  //   let withCusUrl = this.eventdetail + id + '/1'
  //   if(withCusUrl){      
  //     withCusUrl = this.eventdetail + id + '/1/' + customUrl
  //   }else{
  //     withCusUrl = this.eventdetail + id + '/1'
  //   }

  //   return this.http
  //     .get(withCusUrl)
  //     .toPromise()
  //     .then((response) => response)
  //     .catch(this.errorHandler.handleError);
  // }


  getUserEventdetailbyid(id: number, customUrl: any) {
    let getUrl = this.eventdetail + id;
    if (customUrl){
       getUrl = this.eventdetail + id + '/' + customUrl;
    }
    return this.http
      .get(getUrl)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getPartnerEventdetailbyid(id: number) {
    return this.http
      .get(this.eventHostdetail + id)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  createticket(body: any): any {
    return this.http
      .post(this.createevnt, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  postEvent(body: any){
    return this.http.post(this.createEvent, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  editOrganizerEvent(body: any){
    return this.http.post(this.editEvent, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }

  getOrganiserEvent(id: number){
    return this.http.get(this.orgainizerEvent + id)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  getVenueImage(id: number){
    return this.http.get(this.venueImages + id)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }

  deleteOrganiserEvent(id: number){
    return this.http.delete(this.deleteEvent + id)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  putEvent(body: any){
    return this.http.put(this.createEvent, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  puteventAvailability(body:any):any{
    return this.http.put(this.eventAvailability, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }

  reviewEventPostApi(body: any): any {
    return this.http
      .post(this.createEvent, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  getEditEventTicket(id: any): any {
    return this.http.get(this.editEventTicket + id)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  postEditedTickets(body: any, id: any): any {
    return this.http
      .post(this.editedTickets + id, body )
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  getTicketInfo(id: any): any {
    return this.http
      .get(this.bookTickets + id )
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postEventPrice(body: any): any {
    return this.http
    .post(this.eventPrive, body )
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }

  postBookTicketVerify(body: any) {
    return this.http
    .post(this.bookTicketAmountVerify, body )
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }

  postBookUserTicket(id: any, body:any): any {
    return this.http
    .post(this.userBookTicket + id, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }

  getHostDetails():any {
    return this.http
      .get(this.hostDetails)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
getCustomUrl(body:any):any {
    return this.http
      .post(this.customUrlVarify , body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

   getRelatedEventList(idArray: any, eventid: any, body: any): any{
    try {
      let categoryId: any;
      let subcategoryId = '';
      let lengArray = 1;
      let limit  = body.limit;
      let latitude = body.latitude;
      let longitude = body.longitude;
      idArray.forEach((element: any) => {
        categoryId = element.categoryId;
        if (lengArray === idArray.length ){
          subcategoryId += element.id;
        }else{
          subcategoryId += element.id + ',';
          lengArray++;
        }
      });
      const response =  this.http
      .get(this.relatedEvent + eventid, {
        params: {
          categoryId ,
          subcategoryId  ,
          limit,
          latitude,
          longitude
        }, })
      .toPromise();
      return response;
    } catch (error) {
      return this.errorHandler.handleError(error);
    }
  }

  createTicketByEdit(createTicketBody: any): Promise<any>{
    try {
      const response = this.http
      .post(this.createTicketbyEdit , createTicketBody)
      .toPromise();
      return response;
    } catch (error) {
      return this.errorHandler.handleError(error);
    }
  }

  postVerifyCoupanCode(body: any) {
    return this.http
    .post(this.verifyCoupanCode, body )
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
}
