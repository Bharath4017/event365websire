import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
    public baseUrl = environment.baseAPIUrl;
    public listcatogory = this.baseUrl + 'getAllCategorys';
    public listsubcatogory = this.baseUrl + 'getAllSubCategory';
    public subCategoryByCategory = this.baseUrl + 'getSubCategorybyCategoryId';
    public headerBannerImage = this.baseUrl + 'slider';
    public topBanner = this.baseUrl + 'banner';
    public AllRsvpCountUrl = this.baseUrl + 'getUserRSVPCount/?status=pending';

    constructor(private http: HttpClient,
        private errorHandler: ErrorHandlerService){}

    getCatogory(): any {
        return this.http
          .get(this.listcatogory)
          .toPromise()
          .then((response) => response)
          .catch(this.errorHandler.handleError);
      }
    getSubCatogory() {
        return this.http
          .get(this.listsubcatogory)
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
      
      headerBannerImageSlider() {
        return this.http
          .get(this.headerBannerImage)
          .toPromise()
          .then((response) => response)
          .catch(this.errorHandler.handleError);
      }
      topBanners() {
        return this.http
          .get(this.topBanner)
          .toPromise()
          .then((response) => response)
          .catch(this.errorHandler.handleError);
      }
      AllRsvpCountPending(): any {
        return this.http.get(this.AllRsvpCountUrl)
        .toPromise()
        .then((response) => response)
        .catch(this.errorHandler.handleError);
      }
}

