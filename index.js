import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";
const url = "https://script.google.com/macros/s/AKfycbwa8FqTbo3zAPodBzXq7_-rrj3EiqtMMxsfbcDq4KIaoNpOkfx6ZTfxIiIHyYN3BsxClg/exec";
const vapid = "BODBeA7oIsJWdWBWVFINLmNItU9KeipPczaDfGq54Jbx9GlXDRqvaiOqNK2KOIF4P2-9zQeSXWr2KAUKYMbzOnE";
const firebaseConfig = {
  apiKey: "AIzaSyBHgIKGh3DfqKQGsM-AfQjnVo4GEtpUDXs",
  authDomain: "semestaalamsemulajadi.firebaseapp.com",
  projectId: "semestaalamsemulajadi",
  storageBucket: "semestaalamsemulajadi.firebasestorage.app",
  messagingSenderId: "911910247061",
  appId: "1:911910247061:web:453d0751b85d76d7db599c",
  measurementId: "G-NR4TQ8KC21"
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
let deferredPrompt = null;
function isAppInstalled() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isIOSStandalone = window.navigator.standalone === true;
  return isStandalone || (isIOS && isIOSStandalone);
}  
function notif(title, body) {
  if (Notification.permission === 'granted') navigator.serviceWorker.getRegistration().then(reg => {
    if (reg) reg.showNotification(title, {body: body, icon: 'logo.png'});
  });
  else if (Notification.permission !== 'denied') Notification.requestPermission().then(permission => {
    if (permission === 'granted') notif(title, body);
  });
}
window.addEventListener('DOMContentLoaded', () => {
  iframe.src = url + (localStorage.u ? '?u=' + localStorage.u : '');
  if(Notification.permission == 'default') btnsubscribe.style.removeProperty('display');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btninstall.style.removeProperty('display');
  });
  btninstall.addEventListener('click', () => {
    var text = 'App tidak dapat diinstall atau telah diinstall';
    if (!deferredPrompt) return alert(text);
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      btninstall.style.display = 'none';
    });
  });
  btnsubscribe.addEventListener('click', () => {
    var text = 'Sila klik ALLOW apabila popup notification request keluar';
    alert(text);
    subscribe();
  });
  window.addEventListener('message', (event) => {
    if (!event.origin.includes('https://script.google.com')) return;
    if (event.data.type === 'notify') notif(event.data.title, event.data.body);
  });
});
async function subscribe() {
  await navigator.serviceWorker.register('sw.js');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;
  if(Notification.permission != 'default') btnsubscribe.style.display = 'none';
  const token = await getToken(messaging, {vapidKey: vapid, serviceWorkerRegistration: await navigator.serviceWorker.ready});
  // fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token })})
  fetch(url + '?d=' + token + (localStorage.u ? '&u=' + localStorage.u : ''), {redirect: 'follow'}).then(res => res.text()).then(data => {
    localStorage.u = data;
    iframe.src = url + '?u=' + data;
  });
}
// subscribe();
