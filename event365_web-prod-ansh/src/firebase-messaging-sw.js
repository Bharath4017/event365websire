importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');


// // messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "689198147494",
});

if (firebase.messaging.isSupported()) {
  // // Retrieve an instance of Firebase Messaging so that it can handle background
  // // messages.
  const messaging = firebase.messaging();

  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var promise = new Promise(function(resolve) {
      setTimeout(resolve, 1000);
    }).then(function() {
      return clients.openWindow(event.notification.data.click_action);
    });

    event.waitUntil(promise);
  });

  messaging.setBackgroundMessageHandler(function (payload) {
    //console.log(payload,"payload")

    var dataBody = JSON.parse(payload.data.notification);
   // console.log(dataBody,"payload")

    const notificationTitle = dataBody.title;
    const notificationOptions = {
      body: dataBody.body,
      icon: "",
      click_action: "https://test.365live.com/notification",
      data: {
          click_action: "https://test.365live.com/notification"
      }
    };

   // console.log(notificationOptions, "notificationOptions")
  //   self.addEventListener('notificationclick', function (event) {
  //     console.log(event,'event');
  //     if (!event.action) {
  //         self.clients.openWindow(event.notification.data.click_action, '_blank')
  //         event.notification.close();
  //         return;
  //     } else {
  //         event.notification.close();
  //     }
  // });
  return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });





}












