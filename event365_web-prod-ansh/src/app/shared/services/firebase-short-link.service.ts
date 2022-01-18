import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseShortLinkService {
  public firebaselink = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDeUVUdAo43iQh-d9WQuyujs26g55iiALQ';
  constructor(
    private errorHandler: ErrorHandlerService) { }

    
  postDynamicLink(dynamicLinkInfoBody: any) {
    var firebaseheader = new Headers();
    var reqOptions= {
      method: 'Post',
      headers: firebaseheader,
      body: dynamicLinkInfoBody
    } 
    return fetch (this.firebaselink, reqOptions)
      .then((response) => response.json())
      .catch(this.errorHandler.handleError);
  }
}
