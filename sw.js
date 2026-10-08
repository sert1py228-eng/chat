self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("push",e=>{
  let d={};
  try{ d=e.data.json(); }catch(_){ d={body:e.data?e.data.text():""}; }
  e.waitUntil(self.registration.showNotification(d.title||"Новое сообщение",{body:d.body||"",tag:d.peer||"msg",renotify:true,data:{peer:d.peer}}));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  const peer=e.notification.data&&e.notification.data.peer;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    if(cs.length){ cs[0].postMessage({open:peer}); return cs[0].focus(); }
    return self.clients.openWindow("./"+(peer?"?chat="+peer:""));
  }));
});
