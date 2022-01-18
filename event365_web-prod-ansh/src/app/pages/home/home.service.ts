import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  public baseUrl = environment.baseAPIUrl;
  public allCategories = this.baseUrl + 'getAllCategorys';
  public getAllCategorysUser = this.baseUrl + 'getAllCategorysUser';
  public allSubCategories = this.baseUrl + 'getAllSubCategory';
  public searchNearBy = this.baseUrl;
  public subCategoryByCategory = this.baseUrl + 'getSubCategorybyCategoryId';
  public organiserCount = this.baseUrl + 'organiser/home';
  public partnerEvents = this.baseUrl + 'organiser/events';
  public allEvent = this.baseUrl + 'allEventList'
  public userProfile = this.baseUrl + 'getUser';
  public PartnerProfile = this.baseUrl + '/organiser/getUser/'
  public organiserProfile = this.baseUrl + 'organiser/profileDetail';
  public featuredEvent = this.baseUrl + 'featureEvent';
  public updateCategoryCount  = this.baseUrl + 'updateCategoryCount ';
  public likeDislike = this.baseUrl + 'isLikeAndDisLike';
  public pastEvent: any;
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getAllCategories(): any {
    return this.http
      .get(this.allCategories)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
   pastbackButton(event: any):any{
      this.pastEvent = event;
   }
  //this is for user for limited categories
  getAllCategorys(): any {
    return this.http
      .get(this.getAllCategorysUser)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getAllSubCategories(): any {
    return this.http
      .get(this.allSubCategories)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getUserProfile(): any {
    return this.http
      .get(this.userProfile)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getUserProfileById(id:any): any {
    return this.http
      .get(this.PartnerProfile+id)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getOrganiserProfile(): any {
    return this.http
    .get(this.organiserProfile)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  postSearchNearBy(body: any, query: any): any {
    return this.http
    .post(this.searchNearBy + query, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  postUpdateCategoryCount (body: any): any {
    return this.http
    .put(this.updateCategoryCount, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  postSubCategoryByCategory(body: any): any {
    return this.http
      .post(this.subCategoryByCategory, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getOrganiserCount(): any {
    return this.http
      .get(this.organiserCount)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getAllPartnerEvents(queryParams: any): any {
    return this.http.get(this.partnerEvents , { params: queryParams })
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  getAllEvent(body:any): any {
    return this.http.post(this.allEvent, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  postfeaturedEvent(body: any, query: any): any {
    return this.http
    .post(this.featuredEvent + query, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  EventLikeDislike(body: any): any{
    return this.http
    .post(this.likeDislike, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
}
