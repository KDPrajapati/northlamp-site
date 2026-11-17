/* NORTHLAMP scroll upgrades (17 Nov, owner asked to see three before picking). <html data-upg="A|B|C">.
   A  star drift: faint stars behind the hero and the big lines, drifting slower than the page, fading as you scroll.
   B  light sweep: one soft sweep of light across each app screenshot as it comes into view (once).
   C  light dividers: each section's top rule draws itself left to right as a thin stroke of light with a small star at its end.
   Reduced motion: none of it runs. */
(function(){
  "use strict";
  var mode=document.documentElement.getAttribute("data-upg");
  if(!mode||matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)) return;
  function once(els,cls,th){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add(cls);io.unobserve(e.target);}});},{threshold:th||0.35});
    els.forEach(function(el){io.observe(el);});}
  function rnd(s){var x=Math.sin(s*127.1)*43758.5453;return x-Math.floor(x);}
  var dark=matchMedia("(prefers-color-scheme: dark)").matches;

  if(mode==="A"){
    var hosts=[].slice.call(document.querySelectorAll(".hero, .claim-band")),layers=[];
    hosts.forEach(function(h,hi){
      var cv=document.createElement("canvas");cv.className="nl-drift";cv.setAttribute("aria-hidden","true");h.insertBefore(cv,h.firstChild);
      var st=[];for(var i=0;i<70;i++){var b=Math.pow(rnd(hi*97+i+1),3);st.push([rnd(hi*97+i+11),rnd(hi*97+i+21)*1.6-0.3,b,rnd(hi*97+i+31)<0.15]);}
      layers.push({h:h,cv:cv,ctx:cv.getContext("2d"),st:st,hero:h.classList.contains("hero")});});
    function draw(){var dpr=Math.min(devicePixelRatio||1,2);
      layers.forEach(function(L){var r=L.h.getBoundingClientRect();if(r.bottom<-50||r.top>innerHeight+50) return;
        var w=r.width,hh=r.height;if(L.cv.width!==Math.round(w*dpr)||L.cv.height!==Math.round(hh*dpr)){L.cv.width=Math.round(w*dpr);L.cv.height=Math.round(hh*dpr);}
        var c=L.ctx;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,hh);
        var drift=-r.top*0.35,fade=L.hero?Math.max(0,1-scrollY/(innerHeight*0.9)):1;   /* slower than the page */
        L.st.forEach(function(s){var x=s[0]*w,y=s[1]*hh+drift*(0.4+s[2]);if(y<-10||y>hh+10) return;
          var a=(0.2+0.5*s[2])*fade;
          if(s[3]){var g=c.createRadialGradient(x,y,0,x,y,6+8*s[2]);g.addColorStop(0,"rgba(226,182,81,"+(a*1.4)+")");g.addColorStop(1,"rgba(226,182,81,0)");c.fillStyle=g;c.beginPath();c.arc(x,y,6+8*s[2],0,7);c.fill();}
          c.fillStyle=(dark?"rgba(232,237,243,":"rgba(27,42,65,")+a+")";c.beginPath();c.arc(x,y,0.6+1.3*s[2],0,7);c.fill();});});}
    var raf=0;function req(){if(!raf) raf=requestAnimationFrame(function(){raf=0;draw();});}
    addEventListener("scroll",req,{passive:true});addEventListener("resize",req);draw();
  }
  if(mode.indexOf("B")>=0){ once([].slice.call(document.querySelectorAll(".frame")),"nl-swept",0.4); }
  if(mode.indexOf("C")>=0){
    var secs=[].slice.call(document.querySelectorAll("main > section")).slice(1);
    secs.forEach(function(s){var d=document.createElement("div");d.className="nl-div";d.setAttribute("aria-hidden","true");d.innerHTML="<b></b><i><svg viewBox=\"-20 -20 40 40\" width=\"40\" height=\"40\"><defs><radialGradient id=\"nlg\"><stop offset=\"0\" stop-color=\"#FFF6DC\"/><stop offset=\".25\" stop-color=\"#E2B651\" stop-opacity=\".7\"/><stop offset=\"1\" stop-color=\"#E2B651\" stop-opacity=\"0\"/></radialGradient><linearGradient id=\"nls\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#E2B651\"/><stop offset=\"1\" stop-color=\"#E2B651\" stop-opacity=\"0\"/></linearGradient></defs><circle r=\"9\" fill=\"url(#nlg)\"/>"+[0,60,120,180,240,300,90,270].map(function(a,i){return "<rect x=\"-.45\" y=\"0\" width=\".9\" height=\""+(i>5?8:18)+"\" fill=\"url(#nls)\" transform=\"rotate("+(a+180)+")\" opacity=\""+(i>5?.5:1)+"\"/>";}).join("")+"<circle r=\"1.8\" fill=\"#fff\"/></svg></i>";s.insertBefore(d,s.firstChild);});
    once([].slice.call(document.querySelectorAll(".nl-div")),"nl-drawn",0.9);
  }
})();
