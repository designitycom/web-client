console.log("service worker runnnnnnnn");
self.addEventListener("fetch",e=>{
console.warn(`>>>>>>>>>${e.request.method}`);
const url = new URL(event.request.url);
//
console.log(">>>url:",url);
if (url.pathname === 'mint') {
  //I want the notification to display the response data
  event.waitUntil(
    self.registration.showNotification('custom title', {
      body: 'custom body'
    })
  );
}
});
self.addEventListener('message', function (event) {
    console.log('postMessage received', event);
});