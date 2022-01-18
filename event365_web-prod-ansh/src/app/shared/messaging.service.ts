import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/messaging';

import jwt_decode from 'jwt-decode';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class MessagingService {

    currentMessage = new BehaviorSubject(null);

    constructor(
        private angularFireDB: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth,
        private angularFireMessaging: AngularFireMessaging,
        private authService: AuthService) {
        if (firebase.messaging.isSupported()) {
            this.angularFireMessaging.messaging.subscribe(
                (_messaging) => {
                    _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                    _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
                }
            )
        }

    }

    /**
     * update token in firebase database
     * 
     * @param userId userId as a key 
     * @param token token as a value
     */
    updateToken(userId:any, token:any) {
        console.log("updateToken");
        // we can change this function to request our backend service
        if (firebase.messaging.isSupported()) {
            this.angularFireAuth.authState.pipe(take(1)).subscribe(
                () => {
                    const data = [{}];
                    data[userId] = token
                    this.angularFireDB.object('fcmTokens/').update(data)
                    console.log("fcm ", data);
                });
            this.authService.updateServerDeviceToken({ device_token: token }).subscribe((response:any) => {
            })
        }
    }

    /**
     * request permission for notification from firebase cloud messaging
     * 
     * @param userId userId
     */
    requestPermission() {
        if (firebase.messaging.isSupported()) {
            this.angularFireMessaging.requestToken.subscribe(
                (token : any) => {
                    console.log(token, "token")
                    localStorage.setItem('tokenserviceworker',token);
                },
                (err) => {
                     console.error('Unable to get permission to notify.', err);
                }
            );
        }
    }

    /**
     * hook method when new notification received in foreground
     */
    receiveMessage() {
        if (firebase.messaging.isSupported()) {
            this.angularFireMessaging.messages.subscribe(
                (payload:any) => {

                    alert("new message received. " + payload);
                    this.currentMessage.next(payload);
                })
        }
    }
}