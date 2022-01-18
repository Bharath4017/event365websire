import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  constructor(private http: HttpClient ) { }

  get (url: string, queryParams = {}) {
    return this.http.get(url, {
      params : queryParams
    })
  }

  post(url: string, queryParams = {}) {
    return this.http.post(url, queryParams);
  }

  put(url: string, queryParams = {}) {
    const token: any = localStorage.getItem('token');
    const headers = {
      headers: new HttpHeaders().set('Authorization', token)
    };
    return this.http.put(url, queryParams, headers);
  }



  patch(url: string, queryParams = {}) {
    const token: any = localStorage.getItem('token');
    const headers = {
      headers: new HttpHeaders().set('Authorization', token)
    };
    return this.http.patch(url, queryParams, headers);
  }

  delete(url: string) {
    const token: any = localStorage.getItem('token');
    const headers = {
      headers: new HttpHeaders().set('Authorization', token)
    };
    return this.http.delete(url, headers);
  }
}
