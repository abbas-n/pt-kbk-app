importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBzh2YhgUsDMcIrNlK1iPczPWWnz3IgoWo",
  authDomain: "kbk-safir-app.firebaseapp.com",
  projectId: "kbk-safir-app",
  storageBucket: "kbk-safir-app.firebasestorage.app",
  messagingSenderId: "1007707382592",
  appId: "1:1007707382592:web:9f9aabf76f3beeff7a90a5",
  measurementId: "G-02M3EP6WDP"
});

const messaging = firebase.messaging();

// دریافت نوتیفیکیشن در پس‌زمینه
messaging.onBackgroundMessage((payload) => {
  console.log('پیام در پس‌زمینه دریافت شد:', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon || '/icon1.png',
    badge: '/icon3.png',
    tag: 'kbk-notification',
    renotify: true,
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'مشاهده'
      },
      {
        action: 'close',
        title: 'بستن'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // بستن نوتیف

  if (event.action === 'open') {
    // اگه روی "مشاهده" کلیک کرد
    event.waitUntil(
      clients.openWindow('https://safir.kalaresan1.ir')  // این آدرس رو بذار سایت خودت
    );
  } else {
   
  }
});

