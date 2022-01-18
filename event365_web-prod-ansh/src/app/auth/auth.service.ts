import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public baseUrl = environment.baseAPIUrl;
  public commonLogin = this.baseUrl + 'loginCommon';
  public socialLogin = this.baseUrl + 'socialLoginCommon';
  public organizerSignup = this.baseUrl + 'organiser/signup';
  public userSignup = this.baseUrl + 'signup';
  public organiserEmailVerify = this.baseUrl + 'organiser/verifyEmail';
  public userEmailVerify = this.baseUrl + 'verifyEmail';
  public organiserResendOtp = this.baseUrl + 'organiser/againResedOTP';
  public userResendOtp = this.baseUrl + 'againResedOTP';
  public updateUserTypeOrganiser =
    this.baseUrl + 'organiser/updateSocialLoginData';
  public fogotPassword = this.baseUrl + 'commonforgot';
  public resetPassword = this.baseUrl + 'commonresetPassword';
  public logOutUser = this.baseUrl + 'logout';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  postOrganiserSignup(body: any): any {
    return this.http
      .post(this.organizerSignup, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postOrganiserUpdateUserType(body: any): any {
    return this.http
      .post(this.updateUserTypeOrganiser, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postUserSignup(body: any): any {
    return this.http
      .post(this.userSignup, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postOrganiserVerifyEmail(body: any): any {
    return this.http
      .post(this.organiserEmailVerify, body, { observe: 'response' })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postUserVerifyEmail(body: any): any {
    return this.http
      .post(this.userEmailVerify, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postOrganiserResendOtp(body: any): any {
    return this.http
      .post(this.organiserResendOtp, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postUserResendOtp(body: any): any {
    return this.http
      .post(this.userResendOtp, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  postSocialLogin(loginbody: any): any {
    return this.http
      .post(this.socialLogin, loginbody, { observe: 'response' })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postCommonLogin(body: any): any {
    return this.http
      .post(this.commonLogin, body, { observe: 'response' })
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  postForgotForm(body: any): any {
    return this.http
      .post(this.fogotPassword, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }
  postResetPasswordForm(body: any): any {
    return this.http
      .post(this.resetPassword, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  logOut(body: any): any {
    return this.http
      .post(this.logOutUser, body)
      .toPromise()
      .then((response) => response)
      .catch(this.errorHandler.handleError);
  }

  updateServerDeviceToken(data:any):any {
    // return this.http.post(this.baseUrl + 'updateDeviceToken', data)
    //   .pipe(
    //     retry(3),
    //     catchError(this.errorHandler.handleError)
    // );
  }

}
