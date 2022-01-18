import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetpaidServiceService {

  public baseUrl = environment.baseAPIUrl;
  public balanceInfo = this.baseUrl + 'organiser/balanceInfo';
  public withdrawnReq = this.baseUrl + 'organiser/withdrawnReq';
  public bankDetails = this.baseUrl + 'organiser/bankDetails';
  public transactionHistory = this.baseUrl + 'organiser/transactionHistory';
  public createAccountId = this.baseUrl + 'createAccountId';
  public accountLink = this.baseUrl + 'organiser/accountLink';
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) { }

              async getAvailableBalance(): Promise<any>{
                try {
                  const response = await this.http
                  .get(this.balanceInfo)
                  .toPromise();
                  return response;
                } catch (error) {
                  return this.errorHandler.handleError(error);
                }
              }

              async postwithdrawnReq(reqbody: any): Promise<any>{
                try {
                  const response = await this.http
                  .post(this.withdrawnReq, reqbody)
                  .toPromise();
                  return response;
                } catch (error) {
                  return this.errorHandler.handleError(error);
                }
              }
              async postbankDetail(reqbody: any): Promise<any>{
                try {
                  const response = await this.http
                  .post(this.bankDetails, reqbody)
                  .toPromise();
                  return response;
                } catch (error) {
                  return this.errorHandler.handleError(error);
                }
              }
              async getTransactionHistoryDetail(tranParams: any): Promise<any>{
                try {
                  const response = await this.http
                  .get(this.transactionHistory,  {
                    params: {
                      limit: tranParams.limit,
                      transStatus: tranParams.transStatus
                    }, })
                  .toPromise();
                  return response;
                } catch (error) {
                  return this.errorHandler.handleError(error);
                }
              }
              async getBankDetailList(bankParams: any): Promise<any>{
                try {
                  const response = await this.http
                  .get(this.bankDetails,  {
                    params: {
                      limit: bankParams.limit,
                      page: bankParams.page
                    }, })
                  .toPromise();
                  return response;
                } catch (error) {
                  return this.errorHandler.handleError(error);
                }
              }
              async deleteBank(bankid: any): Promise<any>{
                try {
                  const response = await this.http
                  .delete(this.bankDetails + '/' + bankid)
                  .toPromise();
                  return response;
                } catch (error) {
                  return this.errorHandler.handleError(error);
                }
              }
              async postAccountId(createBody: any): Promise<any>{
                 // update currency and country code of partner users and craete account id for stripe add bank
                try {
                  const response = await this.http
                  .post(this.createAccountId, createBody)
                  .toPromise();
                  return response;
                } catch (error) {
                  return this.errorHandler.handleError(error);
                }
              }
              async verifyStripeAccount(): Promise<any>{
                // update currency and country code of partner users and craete account id for stripe add bank
               const body = '';
               try {
                 const response = await this.http
                 .post(this.accountLink, body)
                 .toPromise();
                 return response;
               } catch (error) {
                 return this.errorHandler.handleError(error);
               }
             }

}
