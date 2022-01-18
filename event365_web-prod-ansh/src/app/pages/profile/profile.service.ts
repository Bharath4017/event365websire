import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Subject } from 'rxjs';    

​
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public baseUrl = environment.baseAPIUrl;
  public organizerProfile = this.baseUrl + 'organiser/profileDetail';
  public userProfile = this.baseUrl + 'getUser';
  public organizerUpdateProfile = this.baseUrl + 'organiser/updateProfile';
  public userUpdateProfile = this.baseUrl + 'updateProfile';
  public termscondition = this.baseUrl + 'terms';
  public changepassword = this.baseUrl + 'changePassword';
  public policy = this.baseUrl + 'policy';
  public organiserUserUrl = this.baseUrl + 'organiser/users';
  public addOrganiserUserUrl = this.baseUrl + 'organiser/addUser';
  public getOrganiserUserUrl = this.baseUrl + 'organiser/getUserByVenuer/';
  public deleteOrganiserUserUrl = this.baseUrl + 'organiser/user/';
  public sendMobileOtp = this.baseUrl + 'organiser/sendPhoneOTP';
  public verifyOtp = this.baseUrl + 'organiser/verifyPhone';
  public isRemindOrNotify = this.baseUrl + 'isRemindOrNotify';
  public isRemindOrNotifyForPartner= this.baseUrl + 'organiser/statusNotify';
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private httpService: HttpService
  ) {}
  profileImageUpdate$ = new Subject<string>();
  footerlogoChange$ = new Subject<string>();
  headerFilterChange$ = new Subject<boolean>();
  RsvpPendingStatusUpdate$ = new Subject<any>();
  PermissionStatusUpdate$ = new Subject<any>();

  getOrganizerProfile() {
    return this.httpService.get(this.organizerProfile);
  }
​
  getUserProfile() {
      return this.httpService.get(this.userProfile);
  }
  getUser() {
    return this.http.get(this.organiserUserUrl)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  getUserwithbody(queryParams: any) {
    return this.http.get(this.organiserUserUrl, { params: queryParams })
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  getOrganiserForEditUser(id:any) {
    return this.http.get(this.getOrganiserUserUrl+id)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  postOrganiserUser(body: any): any {
    return this.http
      .post(this.addOrganiserUserUrl, body,  { observe: 'response' })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  updateOrganiserUser(id:any, body: any): any {
    return this.http
      .put(this.deleteOrganiserUserUrl+id, body,  { observe: 'response' })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
​
  postOrganiserProfileUpdate(body: any) {
    return this.http.post(this.organizerUpdateProfile, body);
  }
  deleteOrganiserUser(id:any): any {
    return this.http
      .delete(this.deleteOrganiserUserUrl+id)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postUserProfileUpdate(body: any) {
    return this.http.post(this.userUpdateProfile, body);
  }
​
  postOrganiserUpdateProfile(body: any): any {
    return this.http
      .post(this.organizerUpdateProfile, body,  { observe: 'response' })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postUserUpdateProfile(body: any): any {
    return this.http
      .post(this.userUpdateProfile, body,  { observe: 'response' })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getTermsCondition() {
    return this.http
      .get(this.termscondition)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  getPrivacyPolicy() {
    return this.http
      .get(this.policy)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postChangePassword(changePasswordBody:any){
    return this.http
    .post(this.changepassword,changePasswordBody)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  sendOtp(body: any): any{
    return this.http
    .post(this.sendMobileOtp, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  verifyMobileNumber(body: any): any{
    return this.http
    .post(this.verifyOtp, body, { observe: 'response' })
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  remindOrNotify(body: any): any{
    return this.http
    .post(this.isRemindOrNotify, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
  remindOrNotifyForPartner(body: any): any{
    return this.http
    .put(this.isRemindOrNotifyForPartner, body)
    .toPromise()
    .then((response) => response)
    .catch(this.errorHandler.handleError);
  }
}
