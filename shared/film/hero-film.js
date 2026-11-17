/* NORTHLAMP hero film (C-060). Self-hosted, no outside calls.
   The poster (the last frame, the lock-up) is the still page: it shows with no script,
   with reduced motion, and with Save-Data. Otherwise the film plays ONCE, muted,
   and holds on its last frame. "Skip" jumps to that frame. Never loops. */
(function(){
  "use strict";
  var box=document.querySelector(".film"); if(!box||!document.createElement("video").canPlayType) return;
  var RM=window.matchMedia("(prefers-reduced-motion: reduce)");
  var conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  if(RM.matches||(conn&&conn.saveData)) return;                       /* poster only */
  var tall=window.matchMedia("(max-aspect-ratio: 3/4)");
  var skip=box.querySelector(".film-skip"), made=box.querySelector(".film-made"), stage=box.querySelector(".film-box"), v=null, done=false;
  function hideSkip(){                                                 /* move focus BEFORE the button goes, so it never drops to the page */
    if(!skip) return;
    if(document.activeElement===skip&&stage) stage.focus({preventScroll:true});
    skip.hidden=true;
  }
  var seen=false;                                                      /* true once the film has played on this page */
  function playing(){seen=true; box.classList.add("is-playing"); if(skip) skip.hidden=false; if(made) made.hidden=false;}
  function still(){                                                    /* back to the poster. The "made with" line stays if the film was seen */
    done=true; hideSkip(); if(made&&!seen) made.hidden=true;
    if(v&&v.parentNode){v.pause();v.parentNode.removeChild(v);} v=null;
  }
  function drop(){if(v&&v.parentNode){v.pause();v.parentNode.removeChild(v);} v=null;}   /* the poster under it IS the last frame */
  function hold(atEnd){                                                /* stay on the last frame */
    done=true; hideSkip();
    if(!v) return;
    v.pause();
    if(atEnd===true) return;                                           /* played to the end: it already shows the last frame, no seek */
    var d=v.duration;
    if(!(d>0)){drop();return;}                                         /* Skip before the length is known: show the poster */
    try{v.currentTime=d-0.05;}catch(e){drop();return;}
    setTimeout(function(){if(v&&v.currentTime<d-0.5) drop();},600);    /* the jump did not land: show the poster */
  }
  function start(){
    var name=tall.matches?"hero_9x16_1080p30":"hero_16x9_1080p30", dir="shared/film/";
    v=document.createElement("video");
    v.muted=true; v.playsInline=true; v.setAttribute("playsinline",""); v.setAttribute("muted","");
    v.preload="auto"; v.loop=false; v.setAttribute("aria-hidden","true"); v.tabIndex=-1;
    [["webm","video/webm"],["mp4","video/mp4"]].forEach(function(t){
      var s=document.createElement("source"); s.src=dir+name+"."+t[0]; s.type=t[1]; v.appendChild(s);});
    v.addEventListener("ended",function(){hold(true);});
    v.lastChild.addEventListener("error",still);                     /* only when the LAST source fails: webm failing still tries mp4 */
    v.addEventListener("canplay",function once(){
      v.removeEventListener("canplay",once);
      if(done) return;
      var p=v.play();
      if(p&&p.then) p.then(playing,still); else playing();
    });
    stage.appendChild(v);
  }
  if(skip) skip.addEventListener("click",function(){hold();});
  RM.addEventListener("change",function(){if(RM.matches) still();});
  tall.addEventListener("change",function(){still();});               /* turned the phone: show the right poster */
  /* lazy: the poster paints first, the film is fetched after the page has loaded */
  if(document.readyState==="complete") start(); else window.addEventListener("load",start);
})();
