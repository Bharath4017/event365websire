import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() { }

  getDeviceId(): any {
    let deviceId = this.getCookie('device-ID');
    console.log('created deviceId', deviceId);
    if (!deviceId) {
      deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const  v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
      this.createCookie('device-ID', deviceId, 5000);
      return deviceId;
  } else {
      return deviceId;
  }
  }
  createCookie(name: string, value: any, days: number): any {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    console.log('cookies set', value);
    document.cookie = name + '=' + value + expires + '; path=/;';
  }

  getCookie(name: string): any {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
        if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
    }
    return null;
  }
}
