import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Body } from '@angular/http/src/body';
import { promise } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  public baseUrl = environment.baseAPIUrl;
  public listvenue = this.baseUrl + 'organiser/myVenues';
  public listvenueid = this.baseUrl + 'organiser/venue/';
  public lockSubVenue = this.baseUrl + 'organiser/lockVenueSubVenue';
  public subVenueList = this.baseUrl + 'organiser/subvenueDetail?venueId=';
  public searchVenueList = this.baseUrl + 'organiser/venues?';
  public createVenue = this.baseUrl + 'organiser/createVenue';
  public deleteVeneueapi = this.baseUrl + 'organiser/venue/' ;
  public userlistvenue = this.baseUrl + 'organiser/usersVenues';
  private subvenueList = new BehaviorSubject(0);
  currentvenueID = this.subvenueList.asObservable();
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) { }

    async getVenueList(): Promise<any>{
      try {
        const response = await this.http
        .get(this.listvenue)
        .toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }
    async getVenuebyid(id: any): Promise<any>{
      try {
        const response = await this.http
        .get(this.listvenueid + id)
        .toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }
    async getBookedVenuebyid(id: any, body: any): Promise<any>{
      try {
        const response = await this.http
        .get(this.listvenueid + id, {
        params: {
          eventStartDateTime: body.eventStartDateTime,
          eventEndDateTime: body.eventEndDateTime
        }
      })//'https://api.365live.com/api/organiser/venue/479?eventEndDateTime=2021-08-18%2015:11:00&eventStartDateTime=2021-07-31%2015:11:00'
        .toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }
    shareComponentSubvenueList(venueid: number): any {
      this.subvenueList.next(venueid);
    }

    async lockVenue(subVenues: any): Promise<any>{
      try {
        const response = await this.http
        .post(this.lockSubVenue, subVenues)
        .toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }
    async getSubvenueList(venueId: any): Promise<any>{
      try {
        const response = await this.http
        .get(this.subVenueList + venueId)
        .toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }

    async getSearchVenueList(parms: any): Promise<any>{
      try {
        const response = await this.http
        .get(this.searchVenueList + 'latitude=' + parms.latitude + '&longitude='
        + parms.longitude + '&searchValue=' + parms.searchValue + '&miles=' + parms.miles).toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }
    async postVenue(body: any): Promise<any>{
      try {
        const response = await this.http.post(this.createVenue, body)
          .toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }
    async deleteVenue(id: any): Promise<any>{
      try{
         const response = await this.http.delete(this.deleteVeneueapi + id)
         .toPromise();
         return response;
      }catch (error){
        return this.errorHandler.handleError(error);
      }
    }
    async updateVenue(id: any, venueUpdateData: any): Promise<any>{
      try{
         const response = await this.http.patch(this.deleteVeneueapi + id, venueUpdateData)
         .toPromise();
         return response;
      }catch (error){
        return this.errorHandler.handleError(error);
      }
    }


    async getuserVenueList(): Promise<any>{
      try {
        const response = await this.http
        .get(this.userlistvenue)
        .toPromise();
        return response;
      } catch (error) {
        return this.errorHandler.handleError(error);
      }
    }

}
