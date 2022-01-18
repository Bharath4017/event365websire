// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseAPIUrl: 'https://api.365live.com/api/',
  googlekey: 'AIzaSyCZsz-29RYfsMydC3n2Gd_IU4_6X1Ybr7k',
  shareBaseUrl: 'https://api.365live.com/', // change this also for shareing event social media
  firebase: {
    apiKey: "AIzaSyDeUVUdAo43iQh-d9WQuyujs26g55iiALQ",
    authDomain: "eventlive365.firebaseapp.com",
    databaseURL: "https://eventlive365.firebaseio.com",
    projectId: "eventlive365",
    storageBucket: "eventlive365.appspot.com",
    messagingSenderId: "689198147494",
    appId: "1:689198147494:web:8681804f20c56acd3fd167",
    measurementId: "G-5F7N9EG9XN"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
