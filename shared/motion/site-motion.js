/* NORTHLAMP site motion (BC options).
   Runs ONLY when the visitor allows motion. With reduced motion, or with no script,
   the page is the complete still page and anime.js is never downloaded.
   Rules: ease out, no bounce, nothing flashes, text never moves while it is read
   (reveals finish as a block enters from below), one slow loop (the lamp) with a Pause button.
   Uses anime.js 4.5.0 (MIT, self-hosted, pinned) for reveals, the chart wipe and the
   screenshot settle. The 3D lamp is drawn by hand on a canvas: no library. */
(function(){
  var RM=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(RM.matches||!("IntersectionObserver" in window)) return;
  var here=document.currentScript.src.replace(/[^\/]*$/,"");
  var MOTION={on:true,listeners:[]};   /* the Pause motion button flips this for every effect */

  /* ---------- the lamp mark in 3D (same strokes and star as northlamp_mark.svg) ---------- */
  var P=[
  "50,8 50.59,8.03 51.17,8.12 51.74,8.26 52.3,8.46 52.83,8.71 53.33,9.01 53.81,9.36 54.24,9.76 54.64,10.19 54.99,10.67 55.29,11.17 55.54,11.7 55.74,12.26 55.88,12.83 55.97,13.41 56,14 56,50 55.97,50.59 55.88,51.17 55.74,51.74 55.54,52.3 55.29,52.83 54.99,53.33 54.64,53.81 54.24,54.24 53.81,54.64 53.33,54.99 52.83,55.29 52.3,55.54 51.74,55.74 51.17,55.88 50.59,55.97 50,56 26,56",
  "14,56 13.41,55.97 12.83,55.88 12.26,55.74 11.7,55.54 11.17,55.29 10.67,54.99 10.19,54.64 9.76,54.24 9.36,53.81 9.01,53.33 8.71,52.83 8.46,52.3 8.26,51.74 8.12,51.17 8.03,50.59 8,50 8,14 8.03,13.41 8.12,12.83 8.26,12.26 8.46,11.7 8.71,11.17 9.01,10.67 9.36,10.19 9.76,9.76 10.19,9.36 10.67,9.01 11.17,8.71 11.7,8.46 12.26,8.26 12.83,8.12 13.41,8.03 14,8 38,8",
  "20,62 20,24 20.04,22.79 20.17,21.84 20.38,21.14 20.67,20.67 21.03,20.43 21.46,20.4 21.95,20.56 22.5,20.9 23.1,21.4 23.75,22.06 24.45,22.86 25.18,23.78 25.96,24.82 26.76,25.95 27.59,27.16 28.45,28.45 29.32,29.79 30.21,31.17 31.1,32.58 32,34 32.9,35.42 33.79,36.83 34.68,38.21 35.55,39.55 36.41,40.84 37.24,42.05 38.04,43.18 38.82,44.22 39.55,45.14 40.25,45.94 40.9,46.6 41.5,47.1 42.05,47.44 42.54,47.6 42.97,47.57 43.33,47.33 43.62,46.86 43.83,46.16 43.96,45.21 44,44 44,4"
  ].map(function(s){return s.split(" ").map(function(p){var a=p.split(",");return [a[0]-32,32-a[1]];});});
  P.forEach(function(l){var c=0;l.len=[0];for(var i=1;i<l.length;i++){c+=Math.hypot(l[i][0]-l[i-1][0],l[i][1]-l[i-1][1]);l.len.push(c);}l.total=c;});
  var STAR="44,-2 44.93,3.07 50,4 44.93,4.93 44,10 43.07,4.93 38,4 43.07,3.07".split(" ").map(function(p){var a=p.split(",");return [a[0]-32,32-a[1]];});
  var PAL={light:{front:[27,42,65],back:[120,134,156]},dark:{front:[232,237,243],back:[90,107,133]}};
  var DEPTH=7,T=12,YAW=20*Math.PI/180,PITCH=3*Math.PI/180,CAM=150;
  function ease(x){return 1-Math.pow(1-x,3);}                       /* out cubic: no bounce */

  function drawMark(ctx,size,t,draw,pal){
    var s=size/72; ctx.clearRect(0,0,size,size);
    var ph=2*Math.PI*((t%T)/T), yaw=YAW*Math.sin(ph), pit=PITCH*Math.sin(2*ph);
    var cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pit),sp=Math.sin(pit);
    function pr(x,y,z){var x1=x*cy+z*sy,z1=-x*sy+z*cy,y1=y*cp-z1*sp,z2=y*sp+z1*cp,k=CAM/(CAM-z2);return [size/2+x1*k*s,size/2-y1*k*s];}
    ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=2.4*s;
    var layers=Math.max(4,Math.ceil(DEPTH*s*Math.abs(sy)*1.5)+2);
    for(var L=0;L<=layers;L++){
      var f=L/layers,z=-DEPTH/2+DEPTH*f;
      var c=L===layers?pal.front:pal.back.map(function(b,i){return Math.round(b+(pal.front[i]-b)*f*0.55);});
      ctx.strokeStyle="rgb("+c+")";ctx.beginPath();
      P.forEach(function(l){
        var stop=l.total*draw;
        for(var j=0;j<l.length;j++){
          if(l.len[j]>stop){
            if(j===0) break;
            var a=l[j-1],b=l[j],u=(stop-l.len[j-1])/(l.len[j]-l.len[j-1]);
            var q=pr(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,z);ctx.lineTo(q[0],q[1]);break;
          }
          var q2=pr(l[j][0],l[j][1],z); if(j) ctx.lineTo(q2[0],q2[1]); else ctx.moveTo(q2[0],q2[1]);
        }
      });
      ctx.stroke();
    }
    var so=Math.max(0,Math.min(1,(draw-0.8)/0.2));                   /* the star fades in last, from 95% */
    if(so>0){
      ctx.globalAlpha=so;var sc=0.95+0.05*so,cx=12,cyy=28;ctx.fillStyle="#C8972B";ctx.beginPath();
      STAR.forEach(function(p,m){var r=pr(cx+(p[0]-cx)*sc,cyy+(p[1]-cyy)*sc,DEPTH/2+0.5);if(m)ctx.lineTo(r[0],r[1]);else ctx.moveTo(r[0],r[1]);});
      ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    }
  }

  function lamp(){
    var img=document.querySelector(".hero .mark"); if(!img) return;
    var stage=img.closest("picture")||img;
    var wrap=document.createElement("span"); wrap.className="mark-stage";
    stage.parentNode.insertBefore(wrap,stage); wrap.appendChild(stage);
    var cv=document.createElement("canvas"); cv.setAttribute("role","img"); cv.setAttribute("aria-label",img.getAttribute("alt")||"NORTHLAMP"); wrap.appendChild(cv);
    var ctx=cv.getContext("2d"); if(!ctx){wrap.removeChild(cv);return;}
    var hero=document.querySelector(".hero"), dm=window.matchMedia("(prefers-color-scheme: dark)");
    function pal(){var g=hero.getAttribute("data-ground");return PAL[(g==="dark"||(g==="auto"&&dm.matches))?"dark":"light"];}
    function size(){var px=Math.round(cv.getBoundingClientRect().width*Math.min(window.devicePixelRatio||1,2));if(px&&cv.width!==px){cv.width=cv.height=px;}}
    /* One button stops ALL motion on the page: the lamp, the window tilt and any reveal not yet run. */
    var btn=document.createElement("button"); btn.type="button"; btn.className="motion-pause";
    btn.textContent="Pause motion"; wrap.after(btn);   /* keyboard order = screen order: right after the lamp */
    var t=0,d=0,last=null,raf=0,seen=true,paused=false;
    function frame(now){
      var dt=last===null?0:Math.min(0.1,(now-last)/1000);last=now;
      if(d<1){d=Math.min(1,d+dt/1.6);} else t+=dt;                 /* 1.6 s draw-on, then the 12 s sway */
      size();drawMark(ctx,cv.width,t,ease(d),pal());raf=requestAnimationFrame(frame);
    }
    function run(){var go=seen&&!paused&&!document.hidden;if(go&&!raf){last=null;raf=requestAnimationFrame(frame);}if(!go&&raf){cancelAnimationFrame(raf);raf=0;}}
    img.style.visibility="hidden"; size(); drawMark(ctx,cv.width,0,0,pal());
    new IntersectionObserver(function(e){seen=e[0].isIntersecting;run();}).observe(cv);
    document.addEventListener("visibilitychange",run);
    dm.addEventListener("change",function(){if(!raf){size();drawMark(ctx,cv.width,t,ease(d),pal());}});
    btn.addEventListener("click",function(){
      paused=!paused;btn.textContent=paused?"Play motion":"Pause motion";
      MOTION.on=!paused; MOTION.listeners.forEach(function(f){f(!paused);});
      if(paused){d=1;size();drawMark(ctx,cv.width,t,1,pal());}run();
    });
    RM.addEventListener("change",function(){if(RM.matches){paused=true;run();d=1;t=0;size();drawMark(ctx,cv.width,0,1,pal());btn.hidden=true;MOTION.on=false;MOTION.listeners.forEach(function(f){f(false);});}});
    window.NLLamp={seek:function(sec){paused=true;run();d=Math.min(1,sec/1.6);t=Math.max(0,sec-1.6);size();drawMark(ctx,cv.width,t,ease(d),pal());}};
    run();
  }

  /* ---------- reveals, chart wipe, screenshot settle (anime.js) ---------- */
  function below(el){return el.getBoundingClientRect().top>window.innerHeight*0.92;}
  function scroll(A){
    var groups=[].slice.call(document.querySelectorAll("main section.band h2, main .lede, .t-shot, .facts > div, .places li, .stack figure, .inv .col, .figure-bands")).filter(below);
    if(!MOTION.on) groups=[];
    groups.forEach(function(el){el.style.opacity="0";el.style.transform="translateY(16px)";});
    var io=new IntersectionObserver(function(es){
      var shown=es.filter(function(e){return e.isIntersecting;}).map(function(e){io.unobserve(e.target);return e.target;});
      if(!shown.length) return;
      if(!MOTION.on){shown.forEach(function(el){el.style.opacity="";el.style.transform="";});return;}
      A.animate(shown,{opacity:[0,1],translateY:[16,0],duration:520,delay:A.stagger(70),ease:"outCubic",
        onComplete:function(){shown.forEach(function(el){el.style.transform="";el.style.opacity="";});}});
    },{rootMargin:"0px 0px -8% 0px",threshold:0.12});
    groups.forEach(function(el){io.observe(el);});

    /* the April increment bands fill left to right, once: a wipe, so the words never move */
    var bands=[].slice.call(document.querySelectorAll(".bands > div"));
    if(bands.length&&below(bands[0])&&MOTION.on){
      bands.forEach(function(b){b.style.clipPath="inset(0 100% 0 0)";});
      var bio=new IntersectionObserver(function(es){
        if(!es[0].isIntersecting) return; bio.disconnect();
        if(!MOTION.on){bands.forEach(function(b){b.style.clipPath="";});return;}
        A.animate(bands,{clipPath:["inset(0 100% 0 0)","inset(0 0% 0 0)"],duration:700,delay:A.stagger(160,{start:250}),ease:"outCubic",
          onComplete:function(){bands.forEach(function(b){b.style.clipPath="";});}});
      },{threshold:0.6});
      bio.observe(bands[0].parentNode);
    }

    /* the Today window settles flat as it rises into view, tied to the scroll; flat before it is read */
    var win=document.querySelector(".window .frame");
    if(win&&A.onScroll){
      win.parentNode.style.perspective="1400px";
      var tilt=null;
      var startTilt=function(){tilt=A.animate(win,{rotateX:[8,0],scale:[0.97,1],ease:"linear",
        autoplay:A.onScroll({target:win,enter:"bottom top",leave:"bottom-=30% top",sync:0.4})});};
      if(MOTION.on) startTilt();
      MOTION.listeners.push(function(on){
        if(!on&&tilt){tilt.revert();tilt=null;win.style.transform="";}
        else if(on&&!tilt) startTilt();
      });
    }
    /* paused, or a jump link: anything still waiting to reveal shows at once, so text never moves as it is read */
    function showAll(){
      groups.forEach(function(el){el.style.opacity="";el.style.transform="";});
      bands.forEach(function(b){b.style.clipPath="";});
    }
    MOTION.listeners.push(function(on){ if(!on) showAll(); });
    document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(a) showAll();});
    window.addEventListener("hashchange",showAll);
    if(location.hash) showAll();
  }

  function boot(){
    lamp();
    var s=document.createElement("script"); s.src=here+"anime-4.5.0.umd.min.js"; s.async=true;
    s.onload=function(){ if(window.anime&&!RM.matches) scroll(window.anime); };
    document.head.appendChild(s);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
