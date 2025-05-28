self.addEventListener('install', event => {
  console.log('Service Worker installed');
});
self.addEventListener('fetch', event => {
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.notification.title;
  const options = {
    body: data.notification.body,
    icon: 'logo.png',
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
