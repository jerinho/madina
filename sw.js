self.addEventListener('install', event => {
  console.log('Service Worker installed');
});
self.addEventListener('fetch', event => {
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});