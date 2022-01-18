import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public baseUrl = environment.baseAPIUrl;
  eventdetail: any = this.baseUrl + "getUserEventDetail/";
  public getAllFavourites = this.baseUrl + 'getFavourite';
  public addpreference = this.baseUrl + 'getCategory';
  public categorypreference = this.baseUrl + 'getAllCategorys';
  public subCategoryPreference = this.baseUrl + 'getSubCategorybyCategoryIdWithAuth';
  public selectedSubCategory = this.baseUrl + 'chooseSubCategory';
  public deleteCategoryOrSubCategory = this.baseUrl + 'deleteUserCategory';
  public deleteAllPreferences = this.baseUrl + 'deleteUserallCategory';
  public submitPreference = this.baseUrl + 'chooseSubCategory';
  public markFavorites = this.baseUrl + 'markFav';
  public userReview = this.baseUrl + 'getReview/';
  public createReview = this.baseUrl + 'createReview';
  public getIssue = this.baseUrl + 'getIssues';
  public conatactUs = this.baseUrl + 'contactUsNoAuth';
  public bookedEvent = this.baseUrl + 'getEventList';
  public getreCommandations = this.baseUrl + 'getRecommend';
  public organiserUserReview = this.baseUrl + 'organiser/getReview/';
  public likeDislike = this.baseUrl + 'isLikeAndDisLike';

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService
  ) { }
  getUserEventdetail(id: number) {
    return this.http
      .get(this.eventdetail + id)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getIssueList() {
    return this.http
      .get(this.getIssue)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  contactUs(body: any): any {
    return this.http
      .post(this.conatactUs, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  getFavouriteEvents(): any {
    return this.http
      .get(this.getAllFavourites)
      .toPromise().then((response: any) => response)
      .catch(this.errorHandler.handleError);
  }
  putMarkFavorite(body: any): any {
    return this.http
      .put(this.markFavorites, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getpreference(): any {
    return this.http
      .get(this.addpreference)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getsubCategorypreference(body: any): any {
    return this.http
      .get(this.subCategoryPreference, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getcatlistpreference(): any {
    return this.http
      .get(this.addpreference)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  deletepreference(id: any): any {
    return this.http
      .delete(this.baseUrl + `category/${id}`)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  deleteAllpreference(): any {
    return this.http
      .delete(this.deleteAllPreferences)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  deleteSubCategoryPreference(body:any): any {
    return this.http
      .delete(this.deleteCategoryOrSubCategory, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  deleteCategoryPreference(body:any): any {
    return this.http
      .delete(this.deleteCategoryOrSubCategory, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postSubCategoryPreference(body: any): any {
    return this.http
      .post(this.subCategoryPreference, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postSelectedSubCategoryPreference(body: any): any {
    return this.http
      .post(this.selectedSubCategory, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postSubmitPreference(body: any): any {
    return this.http
      .post(this.submitPreference, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getAllUserReviews(id: any): any {
    return this.http
      .get(this.userReview + id)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  getAllUserReviewsByRating(id: any, rating: any): any {
    return this.http
      .get(this.userReview + id + '?rating=' + rating)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postUsersReview(body: any): any {
    return this.http
      .post(this.createReview, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  organiserUserReviews(id: any): any {
    return this.http
      .get(this.organiserUserReview + id)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  //get booked Event 
  getBookedEvent(): any {
    return this.http
      .get(this.bookedEvent)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getreCommandationsEvent(queryParams: any): any {
    return this.http
      .get(this.getreCommandations, { params: queryParams })
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
