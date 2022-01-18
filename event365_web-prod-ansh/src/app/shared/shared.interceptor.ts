import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SharedInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      request = request.clone({
        headers: new HttpHeaders({
          accept: 'application/json',
          Authorization: 'Bearer ' + authToken
        }),
      });
    } else {
      request = request.clone({
        headers: new HttpHeaders({
          accept: 'application/json',
        }),
      });
    }
    return next.handle(request);
  }
}
