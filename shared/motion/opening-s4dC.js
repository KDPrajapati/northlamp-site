/* NORTHLAMP opening: REV 4, POV camera + forward rush, star C (17 Nov, owner storyboard). Coded, no film, about 5.9 s. Rev 3: no box until the upright is drawn; two fly-bys.
   A real star shines. Inside the closed box, one stroke of light draws the N as a journey: it rises
   up the left upright, slow and searching; meets the closed lid and turns down the diagonal; meets
   the closed bottom and stops; the star's light reaches DOWN into the box and charges it; then it
   slingshots round the corner, rises up the right upright fast and breaks through the lid (the lid opens only there, no pieces). Its tip races to
   the star, the star flares, and the light becomes the paper page. The finished trail is exactly
   the NORTHLAMP mark. Any scroll, key, tap or click ends it at once. */
(function(){
  "use strict";
  var root=document.documentElement;
  if(!root.classList.contains("op-on")) return;
  var cv=document.createElement("canvas"), ctx=cv.getContext&&cv.getContext("2d");
  var host=document.createElement("div"); host.className="opening-e"; host.setAttribute("aria-hidden","true"); host.style.background="#030305";
  function release(){root.classList.remove("op-on");root.classList.add("op-done");if(host.parentNode)host.parentNode.removeChild(host);}
  if(!ctx){release();return;}
  try{sessionStorage.setItem("nl-opening","1");}catch(e){}
  if("scrollRestoration" in history) history.scrollRestoration="manual";
  window.scrollTo(0,0);
  cv.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(cv); document.body.appendChild(host);

  var W,H,dpr,tall;
  function layout(){dpr=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;tall=W/H<0.75;
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  layout(); window.addEventListener("resize",layout);

  function pts(s){return s.split(" ").map(function(p){var a=p.split(",");return [+a[0],+a[1]];});}
  var LEFT=pts("14,56 12.26,55.74 10.67,54.99 9.36,53.81 8.46,52.3 8.03,50.59 8,50 8,14 8.03,13.41 8.46,11.7 9.36,10.19 10.67,9.01 12.26,8.26 14,8 38,8");
  var RIGHT=pts("26,56 50,56 51.74,55.74 53.33,54.99 54.64,53.81 55.54,52.3 55.97,50.59 56,50 56,14 55.97,13.41 55.54,11.7 54.64,10.19 53.33,9.01 51.74,8.26 50,8");
  var LID=pts("38,8 50,8");
  var NBODY=pts("20,62 20,24 20.17,21.84 20.67,20.67 21.46,20.4 22.5,20.9 23.75,22.06 25.18,23.78 26.76,25.95 28.45,28.45 30.21,31.17 32,34 33.79,36.83 35.55,39.55 37.24,42.05 38.82,44.22 40.25,45.94 41.5,47.1 42.54,47.6 43.33,47.33 43.83,46.16 44,44 44,10.2");
  function cl(x){return x<0?0:x>1?1:x;}
  function out3(x){x=cl(x);return 1-Math.pow(1-x,3);}
  function in3(x){x=cl(x);return x*x*x;}
  function inout(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
  function len(ps){var c=0;for(var i=1;i<ps.length;i++)c+=Math.hypot(ps[i][0]-ps[i-1][0],ps[i][1]-ps[i-1][1]);return c;}
  function sample(ps,n){var out=[],tot=len(ps);for(var j=0;j<n;j++){var want=tot*(n===1?0.5:j/(n-1)),c=0;
    for(var i=1;i<ps.length;i++){var d=Math.hypot(ps[i][0]-ps[i-1][0],ps[i][1]-ps[i-1][1]);if(c+d>=want||i===ps.length-1){var u=d?Math.min(1,(want-c)/d):0;out.push([ps[i-1][0]+(ps[i][0]-ps[i-1][0])*u,ps[i-1][1]+(ps[i][1]-ps[i-1][1])*u]);break;}c+=d;}}return out;}
  function line(ps,frac,T){var tot=len(ps)*frac,c=0;ctx.beginPath();var p=T(ps[0]);ctx.moveTo(p[0],p[1]);
    for(var i=1;i<ps.length;i++){var d=Math.hypot(ps[i][0]-ps[i-1][0],ps[i][1]-ps[i-1][1]);
      if(c+d>=tot){var u=(tot-c)/(d||1),q=T([ps[i-1][0]+(ps[i][0]-ps[i-1][0])*u,ps[i-1][1]+(ps[i][1]-ps[i-1][1])*u]);ctx.lineTo(q[0],q[1]);break;}
      c+=d;q=T(ps[i]);ctx.lineTo(q[0],q[1]);}
    ctx.stroke();}
  function bloom(x,y,r,a){var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,"rgba(255,250,238,"+a+")");g.addColorStop(.12,"rgba(255,236,196,"+(.55*a)+")");g.addColorStop(.4,"rgba(226,182,81,"+(.16*a)+")");g.addColorStop(1,"rgba(226,182,81,0)");
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}
  function realStar(x,y,s,a,tw){                                    /* hot core, bloom, four thin fading spikes, faint colour fringe */
    if(a<=0||s<=0) return;
    ctx.save(); ctx.globalCompositeOperation="lighter";
    bloom(x,y,s*5,0.75*a*(1+0.12*tw));
    var L=Math.min(s*9,Math.min(W,H)*0.16), Lh=L*0.82;
    [[0.7071,-0.7071,L],[-0.7071,0.7071,L],[-0.7071,-0.7071,L*0.6,0.8],[0.7071,0.7071,L*0.6,0.8],[0,-1,L*0.3,0.3],[0,1,L*0.3,0.3],[-1,0,L*0.3,0.3],[1,0,L*0.3,0.3]].forEach(function(d){
      [[0,"255,246,228",1],[0.9,"255,170,120",0.35],[-0.9,"150,190,255",0.35]].forEach(function(f){
        var ox=-d[1]*f[0], oy=d[0]*f[0], ex=x+d[0]*d[2], ey=y+d[1]*d[2];
        var g=ctx.createLinearGradient(x,y,ex,ey); g.addColorStop(0,"rgba("+f[1]+","+(0.9*a*f[2]*(d[3]||1))+")");g.addColorStop(0.28,"rgba("+f[1]+","+(0.22*a*f[2]*(d[3]||1))+")"); g.addColorStop(1,"rgba("+f[1]+",0)");
        ctx.strokeStyle=g; ctx.lineWidth=Math.max(0.5,s*0.06); ctx.beginPath(); ctx.moveTo(x+ox,y+oy); ctx.lineTo(ex+ox,ey+oy); ctx.stroke();});});
    bloom(x,y,s*1.6,a);
    ctx.fillStyle="rgba(255,255,255,"+a+")"; ctx.beginPath(); ctx.arc(x,y,Math.max(0.8,s*0.32),0,7); ctx.fill();
    ctx.restore();
  }
  function rnd(seed){var x=Math.sin(seed*127.1)*43758.5453;return x-Math.floor(x);}   /* fixed scatter, same on every visit */

  var field=[]; for(var q=0;q<220;q++){var b=Math.random(); field.push([Math.random(),Math.random(),b*b*b,Math.random()*6.28,Math.random()<.5]);}

  var NFULL=NBODY.slice(0,-1).concat([[44,4]]);
  var CUM=[0]; for(var i0=1;i0<NFULL.length;i0++) CUM.push(CUM[i0-1]+Math.hypot(NFULL[i0][0]-NFULL[i0-1][0],NFULL[i0][1]-NFULL[i0-1][1]));
  function at(d){d=Math.max(0,Math.min(CUM[CUM.length-1],d));for(var i=1;i<CUM.length;i++){if(CUM[i]>=d){var u=(d-CUM[i-1])/((CUM[i]-CUM[i-1])||1);return [NFULL[i-1][0]+(NFULL[i][0]-NFULL[i-1][0])*u,NFULL[i-1][1]+(NFULL[i][1]-NFULL[i-1][1])*u];}}return NFULL[NFULL.length-1];}
  function cumAt(x,y){for(var i=0;i<NFULL.length;i++) if(NFULL[i][0]===x&&NFULL[i][1]===y) return CUM[i]; return 0;}
  function seg(d0,d1,T){d0=Math.max(0,d0);if(d1<=d0) return;var p=T(at(d0));ctx.beginPath();ctx.moveTo(p[0],p[1]);
    for(var i=1;i<NFULL.length;i++){if(CUM[i]<=d0) continue;if(CUM[i]>=d1) break;var q=T(NFULL[i]);ctx.lineTo(q[0],q[1]);}
    var e=T(at(d1));ctx.lineTo(e[0],e[1]);ctx.stroke();}
  var C1A=cumAt(20,24), C1B=cumAt(22.5,20.9), C2A=cumAt(41.5,47.1), C2B=cumAt(44,44), L_END=CUM[CUM.length-1], L_LID=L_END-4;
  /* the flight plan, as (time, distance, speed) knots joined by smooth curves. Like a fly-by orbit:
     slower INTO each corner, a tight curve, then a slingshot OUT of it. FIRST fly-by: round the top
     corner, down to the bottom. SECOND fly-by, powered by the star: round the bottom corner, up and out. Every leg is faster than the
     last: up (about 33 units/s), down the diagonal (about 54), up through the lid (about 200), then the
     rise to the star (faster still). At the bottom it waits while the star's light charges it. */
  var KN=[[1.0,0,0],[2.15,C1A,3],[2.35,C1A+0.5,3],[2.5,C1B,60],[3.1,C2A,0.5],[3.95,C2A+0.4,0.5],[4.05,C2B,110],[4.25,L_END,300]];
  function herm(c,K){if(c<=K[0][0]) return K[0][1];for(var i=1;i<K.length;i++){if(c<=K[i][0]){var a=K[i-1],b=K[i],h=b[0]-a[0],s=(c-a[0])/h,s2=s*s,s3=s2*s;
    return (2*s3-3*s2+1)*a[1]+(s3-2*s2+s)*h*a[2]+(-2*s3+3*s2)*b[1]+(s3-s2)*h*b[2];}}return K[K.length-1][1];}
  function drawn(c){return Math.min(L_END,herm(c,KN));}
  function speed(c){return (drawn(c)-drawn(c-0.04))/0.04;}
  var T_PIERCE=(function(){var lo=4.05,hi=4.25;for(var j=0;j<30;j++){var md=(lo+hi)/2;if(drawn(md)<L_LID) lo=md; else hi=md;}return hi;})();
  var T_RACE=4.25, T_PASS=5.05, T_HIT=5.6, T_BOX=2.1;   /* 4.25-5.0: the logo holds; T_PASS: the rush begins; T_HIT: it turns to light */   /* T_PASS: it flies past the star; T_HIT: the rush turns to light */                          /* T_BOX: the box snaps shut around the upright */                                       /* the tip leaves the lid, then reaches the star */
  function geom(){
    var m=Math.min(W,H)*(tall?0.42:0.32);
    return {m:m,k:m/64,bx:tall?W*0.5:W*0.4,by:tall?H*0.6:H*0.58,S:tall?[W*0.72,H*0.18]:[W*0.76,H*0.22]};
  }
  var G=geom(); window.addEventListener("resize",function(){G=geom();});
  /* the cluster: a far galaxy like a telescope photo. Many stars, sizes by a steep power law (few bright, many faint),
     warm gold / white / a few blue-white, packed toward a tilted core with a soft glow. Same on every visit. */
  /* a telescope-photo star: tiny hot core, soft halo with faint rings, long hairline spikes with colour fringes */
  var STAR_PAT="W";
  function webbStar(x,y,s,a,lenF){if(a<=0||s<=0) return;ctx.save();ctx.globalCompositeOperation="lighter";
    var L=Math.min(s*(lenF||42),Math.max(W,H)*0.42),lw2=Math.max(0.7,s*0.1);
    bloom(x,y,s*7,0.5*a);
    for(var ri=1;ri<=2;ri++){ctx.strokeStyle="rgba(255,236,200,"+(0.07*a/ri)+")";ctx.lineWidth=Math.max(0.6,s*0.3);ctx.beginPath();ctx.arc(x,y,s*(1.5+ri*1.4),0,7);ctx.stroke();}
    var SP=STAR_PAT==="W"?[[0,1,1],[60,0.82,0.85],[120,0.82,0.85],[180,1,1],[240,0.82,0.85],[300,0.82,0.85],[90,0.3,0.4],[270,0.3,0.4]]
                         :[[45,1,1],[225,1,1],[135,0.6,0.8],[315,0.6,0.8],[0,0.22,0.3],[90,0.22,0.3],[180,0.22,0.3],[270,0.22,0.3]];
    SP.forEach(function(p){var an=p[0]*Math.PI/180,dx=Math.sin(an),dy=-Math.cos(an),Lp=L*p[1];
      [[0,"255,248,236",1],[1.3,"255,176,108",0.4],[-1.3,"150,190,255",0.4]].forEach(function(f){var ox=-dy*f[0]*lw2,oy=dx*f[0]*lw2;
        var g=ctx.createLinearGradient(x,y,x+dx*Lp,y+dy*Lp);g.addColorStop(0,"rgba("+f[1]+","+(0.95*a*p[2]*f[2])+")");g.addColorStop(0.25,"rgba("+f[1]+","+(0.5*a*p[2]*f[2])+")");g.addColorStop(1,"rgba("+f[1]+",0)");
        ctx.strokeStyle=g;ctx.lineWidth=lw2;ctx.beginPath();ctx.moveTo(x+ox,y+oy);ctx.lineTo(x+dx*Lp+ox,y+dy*Lp+oy);ctx.stroke();});});
    bloom(x,y,s*2.2,a);ctx.fillStyle="rgba(255,255,255,"+a+")";ctx.beginPath();ctx.arc(x,y,Math.max(0.8,s*0.32),0,7);ctx.fill();ctx.restore();}
  var CL=[{dx:0,dy:0,b:0,col:"255,250,242",d:0.45,tw:0}];
  for(var ci=1;ci<320;ci++){var r1=Math.max(1e-4,rnd(ci+1)),r2=rnd(ci+101),r4=rnd(ci+301),rad=Math.sqrt(-2*Math.log(r1))*0.38,an=r2*6.283;
    CL.push({dx:Math.cos(an)*rad*1.4,dy:Math.sin(an)*rad*0.7,b:Math.pow(rnd(ci+201),7),col:r4<0.16?"190,210,255":r4<0.55?"255,232,195":"255,250,242",d:0.35+rnd(ci+401)*1.15,tw:rnd(ci+501)*6.28});}
  var CL_BRIGHT=[];   /* filled below from the wide field: the nearest bright stars */
  /* stars everywhere: a wide field over the whole frame, brightest few with telescope spikes; none crowd the frame centre,
     where the logo is held, so the logo's own star is the nearest one */
  var WS=[];for(var wi=0;wi<90;wi++){var r5=rnd(wi+1401);WS.push({x:rnd(wi+901),y:rnd(wi+1001),b:Math.pow(rnd(wi+1101),5),d:0.4+rnd(wi+1201)*1.3,tw:rnd(wi+1301)*6.28,
    col:r5<0.16?"190,210,255":r5<0.55?"255,232,195":"255,250,242"});}
  function wideOk(s){return Math.hypot(s.x*W-W/2,s.y*H-H/2)>G.m*1.05;}
  CL_BRIGHT=WS.filter(function(s){return s.b>0.45&&wideOk(s);}).map(function(s){return {w:s,dd:Math.hypot(s.x*W-G.bx,s.y*H-G.by)};}).sort(function(a,b){return a.dd-b.dd;}).slice(0,4).map(function(o){return o.w;});
  function wideField(c,wp,V){var gA=out3((c-0.3)/1.4);if(gA<=0) return;var grow=1+wp*3,D=Math.hypot(W,H);
    ctx.save();ctx.globalCompositeOperation="lighter";
    ctx.save();ctx.translate(W*0.5,H*0.55);ctx.rotate(-0.42);ctx.scale(1,0.16);var bg=ctx.createRadialGradient(0,0,0,0,0,D*0.6);
    bg.addColorStop(0,"rgba(220,215,235,"+(0.07*gA)+")");bg.addColorStop(0.5,"rgba(180,190,235,"+(0.035*gA)+")");bg.addColorStop(1,"rgba(170,180,235,0)");
    ctx.fillStyle=bg;ctx.beginPath();ctx.arc(0,0,D*0.6,0,7);ctx.fill();ctx.restore();
    [[0.14,0.28,0.7,-0.3],[0.44,0.1,0.5,0.5],[0.24,0.8,0.45,-0.8],[0.9,0.72,0.55,0.2],[0.62,0.88,0.35,1.1]].forEach(function(g){ctx.save();ctx.translate(g[0]*W,g[1]*H);ctx.rotate(g[3]);ctx.scale(1,0.4);
      var r=G.m*0.24*g[2],gg=ctx.createRadialGradient(0,0,0,0,0,r);gg.addColorStop(0,"rgba(255,238,210,"+(0.35*gA)+")");gg.addColorStop(0.3,"rgba(220,205,235,"+(0.12*gA)+")");gg.addColorStop(1,"rgba(170,180,240,0)");
      ctx.fillStyle=gg;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.restore();});
    ctx.restore();
    WS.forEach(function(s){var a=cl((c-s.d)/0.5);if(a<=0||!wideOk(s)) return;var x=V[0]+(s.x*W-V[0])*grow,y=V[1]+(s.y*H-V[1])*grow,al=a*(0.8+0.2*Math.sin(c*3+s.tw))*(1-wp*0.4);
      if(s.b>0.45) webbStar(x,y,G.k*(0.3+0.8*s.b),al,18);
      else {ctx.fillStyle="rgba("+s.col+","+((0.3+0.7*Math.sqrt(s.b))*al)+")";ctx.beginPath();ctx.arc(x,y,0.6+2*s.b,0,7);ctx.fill();}});}
  function clPos(s,grow){var S=G.S,R=G.m*0.95,ca=Math.cos(-0.45),sa=Math.sin(-0.45),x0=s.dx*R,y0=s.dy*R;return [S[0]+(x0*ca-y0*sa)*grow,S[1]+(x0*sa+y0*ca)*grow];}
  function cluster(c,wp,boost){var S=G.S,m=G.m,k=G.k,R=m*0.95,grow=1+wp*3,gA=out3((c-0.35)/1.3);if(gA<=0) return;
    ctx.save();ctx.globalCompositeOperation="lighter";ctx.translate(S[0],S[1]);ctx.rotate(-0.45);ctx.scale(grow,grow*0.42);
    var gg=ctx.createRadialGradient(0,0,0,0,0,R*1.25);gg.addColorStop(0,"rgba(255,236,205,"+(0.42*gA)+")");gg.addColorStop(0.18,"rgba(235,212,228,"+(0.18*gA)+")");
    gg.addColorStop(0.55,"rgba(160,176,235,"+(0.08*gA)+")");gg.addColorStop(1,"rgba(150,170,235,0)");ctx.fillStyle=gg;ctx.beginPath();ctx.arc(0,0,R*1.25,0,7);ctx.fill();ctx.restore();
    CL.forEach(function(s,i){if(i===0) return;var a=cl((c-s.d)/0.5);if(a<=0) return;var p=clPos(s,grow),al=a*(0.8+0.2*Math.sin(c*3+s.tw))*(1-wp*0.4);
      if(s.b>0.6) webbStar(p[0],p[1],k*(0.3+0.7*s.b),al,16);
      else {ctx.fillStyle="rgba("+s.col+","+((0.35+0.65*Math.sqrt(s.b))*al)+")";ctx.beginPath();ctx.arc(p[0],p[1],0.6+2.2*s.b,0,7);ctx.fill();}});
    webbStar(S[0],S[1],m*0.03*(1+boost)*(0.4+0.6*gA),gA*(0.92+0.08*Math.sin(c*5)),42);}   /* the target: the big one */
  function mix(a,b,u){return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];}
  function lerp(a,b,u){return a+(b-a)*u;}
  function galaxy(){return G.S;}
  function racePath(Sx){var S=Sx,k=G.k,tip0=[G.bx+12*k,G.by-28*k],Gx=galaxy();
    return [tip0,[tip0[0],Math.max(H*0.05,S[1]-H*0.05)],[S[0]-W*0.035,S[1]-H*0.085],Gx];}
  function camera(c){
    var S=G.S,k=G.k,T=function(p){return [G.bx+(p[0]-32)*k, G.by+(p[1]-32)*k];},bc=T([32,30]),ctr=[W/2,H/2];
    var hd=c<1.0?T([20,62]):T(at(drawn(c))),uA=cl((c-0.8)/(T_BOX-0.8)),scrA=[W*(W/H<0.75?0.4:0.34),lerp(H*0.94,H*0.6,inout(uA))],A=[hd[0]-(scrA[0]-W/2)/2.7,hd[1]-(scrA[1]-H/2)/2.7],B=mix(bc,hd,0.3),C=mix(bc,S,0.16),Dd=mix(bc,hd,0.45);
    var z,F;
    if(c<T_BOX){z=2.7;F=A;}
    else if(c<T_BOX+0.5){var u=inout((c-T_BOX)/0.5);z=lerp(2.7,1.2,u);F=mix(A,B,u);}
    else if(c<3.1){z=1.2;F=B;}
    else if(c<3.95){var u2=inout((c-3.1)/0.6);z=lerp(1.2,1.34,u2);F=mix(B,C,u2);}
    else if(c<T_RACE){var u3=inout((c-3.95)/0.3);z=lerp(1.34,1.15,u3);F=mix(C,Dd,u3);}
    else if(c<T_PASS){var u4=inout((c-T_RACE)/(T_PASS-T_RACE)),d4=mix(bc,T([44,4]),0.45);z=lerp(1.15,1.55,u4);F=mix(d4,T([32,28]),u4);}   /* frame the logo */
    else {var u5=inout((c-T_PASS)/(T_HIT+0.3-T_PASS));z=lerp(1.55,2.3,u5);F=mix(T([32,28]),T([44,4]),u5*0.6);}   /* a gentle push toward the logo */   /* zoom INTO the cluster, which holds still */
    return {z:z,F:F};
  }
  function bez(P,e){var u=1-e;return [u*u*u*P[0][0]+3*u*u*e*P[1][0]+3*u*e*e*P[2][0]+e*e*e*P[3][0],u*u*u*P[0][1]+3*u*u*e*P[1][1]+3*u*e*e*P[2][1]+e*e*e*P[3][1]];}

  function scene(c){
    var S=G.S,m=G.m,k=G.k,bx=G.bx,by=G.by,T=function(p){return [bx+(p[0]-32)*k, by+(p[1]-32)*k];};
    var cam=camera(c),z=cam.z,Fc=cam.F,lw=Math.max(2,2.4*k)/Math.sqrt(z),GX=T([44,4]);
    var P2S=function(p){return [(p[0]-Fc[0])*z+W/2,(p[1]-Fc[1])*z+H/2];},GS=P2S(GX),NF=1-cl((c-T_HIT+0.05)/0.3);   /* the logo fades as the rush takes over, so it never sits on the page */
    ctx.setTransform(dpr,0,0,dpr,0,0);
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#07080B");g.addColorStop(1,"#030305");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    var warp=0.5*in3((c-T_PASS)/(T_HIT+0.25-T_PASS));
    field.forEach(function(s){var pz=0.18*s[2]*s[2],x=s[0]*W-(Fc[0]-W/2)*pz*z,y=s[1]*H-(Fc[1]-H/2)*pz*z,   /* near (bright) stars drift with the camera */dx=x-GS[0],dy=y-GS[1],f=1+warp*5,x2=GS[0]+dx*f,y2=GS[1]+dy*f,tw=(0.75+0.25*Math.sin(c*3+s[3]))*out3((c-0.6)/1.2);
      if(warp>0.02){ctx.strokeStyle="rgba(225,232,245,"+(0.25+0.6*s[2])+")";ctx.lineWidth=0.6+s[2]+warp;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-dx*warp*0.45*f,y2-dy*warp*0.45*f);ctx.stroke();}
      else if(s[2]>0.6) realStar(x,y,1+s[2]*1.4,0.5*tw,0);
      else {ctx.fillStyle=(s[4]?"rgba(255,240,225,":"rgba(215,228,255,")+(0.22+0.6*s[2])*tw+")";ctx.beginPath();ctx.arc(x,y,0.5+s[2]*1.0,0,7);ctx.fill();}});

    var boost=0;
    wideField(c,warp,GS);
    cluster(c,warp,boost);
    /* everything near: seen through the camera */
    ctx.setTransform(dpr*z,0,0,dpr*z,dpr*(W/2-Fc[0]*z),dpr*(H/2-Fc[1]*z));
    S=[Fc[0]+(G.S[0]-W/2)/z, Fc[1]+(G.S[1]-H/2)/z];                 /* the cluster's centre, seen through the camera */
    var appear=out3((c-0.35)/1.0), hit=c>=T_PASS?Math.sin(Math.PI*cl((c-T_PASS)/0.4)):0, flood=in3((c-T_HIT-0.05)/0.6);
    /* the star's light falls toward the box: soft-edged (four layered widths), swaying gently */
    var beamOn=0;   /* the stars aim nothing at the stroke */
    /* rev 4d: the stroke's own headlight, a forward beam from its head lighting the dark ahead */
    if(c>=1.0&&c<T_PIERCE+0.2){var hl=Math.min(1,(c-1.0)/0.3)*(1-cl((c-T_PIERCE)/0.2)),dh=drawn(c),h0=T(at(dh)),h1=T(at(dh+4)),
        han=Math.atan2(h1[1]-h0[1],h1[0]-h0[0]),HL=m*0.75;
      if(Math.hypot(h1[0]-h0[0],h1[1]-h0[1])<0.5) han=-Math.PI/2;
      ctx.save();ctx.globalCompositeOperation="lighter";
      [[0.34,0.022],[0.2,0.035],[0.09,0.05]].forEach(function(w){var hg=ctx.createRadialGradient(h0[0],h0[1],0,h0[0],h0[1],HL);
        hg.addColorStop(0,"rgba(255,244,222,"+(w[1]*hl*1.3)+")");hg.addColorStop(0.5,"rgba(255,236,200,"+(w[1]*0.5*hl)+")");hg.addColorStop(1,"rgba(255,236,200,0)");
        ctx.fillStyle=hg;ctx.beginPath();ctx.moveTo(h0[0],h0[1]);ctx.arc(h0[0],h0[1],HL,han-w[0]/2,han+w[0]/2);ctx.closePath();ctx.fill();});ctx.restore();}
    beamOn=0;
    if(beamOn>0){var tb=c<T_BOX+0.5?mix(T(at(drawn(c))),T([32,30]),cl((c-T_BOX)/0.5)):T([32,30]),ang=Math.atan2(tb[1]-S[1],tb[0]-S[0])+0.05*Math.sin(c*0.9),Lb=Math.hypot(W,H);ctx.save();ctx.globalCompositeOperation="lighter";
      [[0.34,0.03],[0.22,0.045],[0.12,0.06],[0.05,0.06]].forEach(function(w){var bg=ctx.createRadialGradient(S[0],S[1],0,S[0],S[1],Lb);
        bg.addColorStop(0,"rgba(255,226,170,"+(w[1]*beamOn)+")");bg.addColorStop(0.55,"rgba(226,182,81,"+(w[1]*0.35*beamOn)+")");bg.addColorStop(1,"rgba(226,182,81,0)");
        ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(S[0],S[1]);ctx.arc(S[0],S[1],Lb,ang-w[0]/2,ang+w[0]/2);ctx.closePath();ctx.fill();});ctx.restore();}

    /* the box: NOT there at first. Once the stroke has drawn the N's left upright in open space, the box
       snaps shut around it (in from a little larger), trapping it. The lid stays shut between x=38 and x=50
       until the stroke breaks it. */
    var snap=out3((c-T_BOX)/0.22), boxA=cl((c-T_BOX)/0.1), sc=1+0.28*(1-snap), Tb=function(p){return [bx+(p[0]-32)*k*sc, by+(p[1]-32)*k*sc];};
    var d=drawn(c), pierce=c>=T_PIERCE, burn=pierce?out3((c-T_PIERCE)/0.3):0;
    var gap=burn*6,l1=T([38+Math.max(0,6-gap),8]),r1=T([50-Math.max(0,6-gap),8]);
    if(boxA>0){var drawBox=function(){line(LEFT,1,Tb);line(RIGHT,1,Tb);var a1=Tb([38+Math.max(0,6-gap),8]),b1=Tb([50-Math.max(0,6-gap),8]),a0=Tb([38,8]),b0=Tb([50,8]);
        ctx.beginPath();ctx.moveTo(a0[0],a0[1]);ctx.lineTo(a1[0],a1[1]);ctx.moveTo(b0[0],b0[1]);ctx.lineTo(b1[0],b1[1]);ctx.stroke();};
      ctx.save();ctx.globalAlpha=boxA*NF;ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#E8EDF3";ctx.lineWidth=lw;drawBox();ctx.restore();
      var thud=c>=T_BOX+0.18&&c<T_BOX+0.5?1-(c-T_BOX-0.18)/0.32:0;     /* the moment it shuts: the walls flash once */
      if(thud>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="rgba(232,237,243,"+(0.45*thud)+")";ctx.lineWidth=lw*3.2;drawBox();ctx.restore();}}

    var charge=c<3.35?0:c<4.25?cl((c-3.35)/0.6):1;                   /* how much of the star's light it holds */
    if(d>0){
      var hd=T(at(d));
      /* the trail it leaves: the N */
      ctx.save();ctx.globalAlpha=NF;ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#E8EDF3";ctx.lineWidth=lw;seg(0,d,T);ctx.restore();
      /* the speed streak: the faster it flies, the longer and brighter the glow behind it */
      if(c<T_RACE+0.05){var v=Math.max(0,speed(c)),vn=cl(v/250),tl=3+26*vn;
        if(v>1){var tp=T(at(d-tl));ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.lineJoin="round";
          var sg=ctx.createLinearGradient(tp[0],tp[1],hd[0],hd[1]);sg.addColorStop(0,"rgba(255,226,170,0)");sg.addColorStop(1,"rgba(255,240,210,"+(0.3+0.65*vn)+")");
          ctx.strokeStyle=sg;ctx.lineWidth=lw*(1.3+1.4*vn);seg(d-tl,d,T);ctx.restore();}}
      ctx.save();ctx.globalCompositeOperation="lighter";
      /* blocked: the closed bottom flashes where it meets it */
      if(c>=3.1&&c<3.4){var bb=T([42.5,56]);bloom(bb[0],bb[1],m*0.12,0.35*Math.sin(Math.PI*(c-3.1)/0.3));}
      /* the slingshot: a flash at the corner as it whips round and leaves faster */
      if(c>=2.38&&c<2.65){var w1=T([21.2,20.6]);bloom(w1[0],w1[1],m*0.11,0.5*Math.sin(Math.PI*(c-2.38)/0.27));}
      if(c>=3.97&&c<4.22){var w2=T([43,47.4]);bloom(w2[0],w2[1],m*0.18,0.75*Math.sin(Math.PI*(c-3.97)/0.25));}
      ctx.restore();
      /* from the start it looks at the star: a faint glint from its head toward the light */
      if(c>=1.0&&c<2.5){var la=0.32*Math.min(1,(c-1.0)/0.3)*(1-cl((c-2.35)/0.15))*(0.75+0.25*Math.sin(c*6)),ax=S[0]-hd[0],ay=S[1]-hd[1],al=Math.hypot(ax,ay)||1,gl=m*0.2;
        ctx.save();ctx.globalCompositeOperation="lighter";var ag=ctx.createLinearGradient(hd[0],hd[1],hd[0]+ax/al*gl,hd[1]+ay/al*gl);ag.addColorStop(0,"rgba(255,236,196,"+la+")");ag.addColorStop(1,"rgba(255,236,196,0)");
        ctx.strokeStyle=ag;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(hd[0],hd[1]);ctx.lineTo(hd[0]+ax/al*gl,hd[1]+ay/al*gl);ctx.stroke();ctx.restore();}
      /* trapped at the bottom, the star's light reaches DOWN into the box and charges it */
      if(c>=3.1&&c<4.1){var rr=out3((c-3.1)/0.25),ra=Math.min(1,(c-3.1)/0.1)*(1-cl((c-3.95)/0.1)),ex=hd[0],ey=hd[1];
        if(ra>0){var dx2=ex-S[0],dy2=ey-S[1],dl=Math.hypot(dx2,dy2)||1,nx=-dy2/dl,ny=dx2/dl,hw=m*0.05;
          ctx.save();ctx.globalCompositeOperation="lighter";
          var cg=ctx.createLinearGradient(S[0],S[1],ex,ey);cg.addColorStop(0,"rgba(255,236,196,"+(0.05*ra)+")");cg.addColorStop(1,"rgba(255,226,170,"+(0.22*ra)+")");
          ctx.fillStyle=cg;ctx.globalAlpha=rr*rr;ctx.beginPath();ctx.moveTo(S[0],S[1]);ctx.lineTo(ex+nx*hw,ey+ny*hw);ctx.lineTo(ex-nx*hw,ey-ny*hw);ctx.closePath();ctx.fill();
          var kg=ctx.createLinearGradient(S[0],S[1],ex,ey);kg.addColorStop(0,"rgba(255,246,228,"+(0.75*ra)+")");kg.addColorStop(1,"rgba(255,246,228,"+(0.9*ra)+")");
          ctx.strokeStyle=kg;ctx.lineWidth=1.6;ctx.beginPath();ctx.globalAlpha=1;ctx.moveTo(hd[0],hd[1]);ctx.lineTo(hd[0]+(S[0]-hd[0])*rr,hd[1]+(S[1]-hd[1])*rr);ctx.stroke();   /* it reaches out */
          if(c>3.3){for(var j=0;j<9;j++){var f=((c-3.3)*1.7+j/9)%1,mx=S[0]+dx2*f,my=S[1]+dy2*f;ctx.fillStyle="rgba(255,240,210,"+(ra*Math.sin(Math.PI*f))+")";ctx.beginPath();ctx.arc(mx,my,1+1.6*f,0,7);ctx.fill();}}
          if(charge>0){bloom(hd[0],hd[1],m*(0.06+0.14*charge),0.25+0.55*charge);
            var ring=m*0.2*(1-((c-3.35)*2.5)%1);ctx.strokeStyle="rgba(255,226,170,"+(0.35*charge*ra)+")";ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(hd[0],hd[1],ring,0,7);ctx.stroke();}
          ctx.restore();}}
      /* the cluster's light: more threads reach in from its brightest stars */
      if(c>=3.1&&c<4.1&&ra>0){ctx.save();ctx.globalCompositeOperation="lighter";CL_BRIGHT.forEach(function(sb,bi){var ps=[sb.x*W,sb.y*H],pc=[Fc[0]+(ps[0]-W/2)/z,Fc[1]+(ps[1]-H/2)/z],re=hd,re2=mix(hd,pc,rr);
        var tg3=ctx.createLinearGradient(pc[0],pc[1],re[0],re[1]);tg3.addColorStop(0,"rgba(255,240,215,"+(0.45*ra)+")");tg3.addColorStop(1,"rgba(255,240,215,"+(0.6*ra)+")");
        ctx.strokeStyle=tg3;ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(hd[0],hd[1]);ctx.lineTo(re2[0],re2[1]);ctx.stroke();
        if(c>3.3){for(var j2=0;j2<5;j2++){var f2=((c-3.3)*1.5+j2/5+bi*0.13)%1,mp=mix(pc,re,f2);ctx.fillStyle="rgba(255,240,210,"+(ra*0.8*Math.sin(Math.PI*f2))+")";ctx.beginPath();ctx.arc(mp[0],mp[1],0.8+1.2*f2,0,7);ctx.fill();}}});ctx.restore();}
      if(c<T_RACE) realStar(hd[0],hd[1],k*(0.85+0.8*charge)/Math.pow(z,0.75),0.72+0.2*charge,0);
      /* the break: a beam through the lid; the lid's cut edges glow as it opens */
      if(pierce&&c<4.75){ctx.save();ctx.globalCompositeOperation="lighter";var a0=1-cl((c-4.45)/0.3),bt=T([44,4]),bb2=T([44,30]);var bgr=ctx.createLinearGradient(bt[0],bt[1],bb2[0],bb2[1]);
        bgr.addColorStop(0,"rgba(255,244,220,"+a0+")");bgr.addColorStop(1,"rgba(255,244,220,0)");ctx.strokeStyle=bgr;ctx.lineWidth=lw*2.4;ctx.beginPath();ctx.moveTo(bt[0],bt[1]);ctx.lineTo(bb2[0],bb2[1]);ctx.stroke();
        if(burn<1){[l1,r1].forEach(function(e){bloom(e[0],e[1],lw*5,1-burn);});}ctx.restore();}}

    /* powered by the star, the tip rises HIGH, flies PAST the star and on toward the far galaxy: the fastest leg */
    var tip0=T([44,4]);
    if(false){   /* rev 4: the tip no longer races off; the stroke stays as the logo */
      var P=racePath(S);
      var plen=0,pp=P[0];for(var q2=1;q2<=40;q2++){var pq=bez(P,q2/40);plen+=Math.hypot(pq[0]-pp[0],pq[1]-pp[1]);pp=pq;}
      var avg=1/(T_HIT-T_RACE),v0=Math.min(300*k/plen,1.6*avg),RK=[[T_RACE,0,v0],[T_HIT,1,2.2*avg]];
      var e=cl(herm(c,RK)),ev=cl((herm(c,RK)-herm(c-0.03,RK))/0.03/(2.2*avg)),e2=Math.max(0,e-(0.1+0.2*ev)),far=1-0.75*in3(e);
      ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";var h0=bez(P,e2),lp2=bez(P,e);
      var tg2=ctx.createLinearGradient(h0[0],h0[1],lp2[0],lp2[1]);tg2.addColorStop(0,"rgba(255,226,170,0)");tg2.addColorStop(1,"rgba(255,240,210,"+(0.7+0.3*ev)+")");
      ctx.strokeStyle=tg2;ctx.lineWidth=lw*(1.3+1.2*ev)*far;ctx.beginPath();ctx.moveTo(h0[0],h0[1]);for(var q3=1;q3<=8;q3++){var pr=bez(P,e2+(e-e2)*q3/8);ctx.lineTo(pr[0],pr[1]);}ctx.stroke();ctx.restore();
      realStar(lp2[0],lp2[1],k*1.5*far,0.85,0);}
    if(c>=T_BOX+0.2){var lit=c>=T_RACE,fl=lit?Math.max(0,1-(c-T_RACE)/0.45):0;webbStar(tip0[0],tip0[1],lit?k*(1.5+2.2*fl):k*1.15,(lit?1:0.6*cl((c-T_BOX-0.2)/0.3))*NF,lit?11:9);}   /* it touches the star: the logo */
    var seen=c>=3.1&&c<3.95?0.4*Math.sin(Math.PI*(c-3.1)/0.85):0;     /* the star answers while it gives its light */
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(flood>0){ctx.save();ctx.globalCompositeOperation="lighter";bloom(GS[0],GS[1],flood*Math.hypot(W,H)*1.3,flood);ctx.restore();
      ctx.fillStyle="rgba(247,245,242,"+cl(flood*1.3)+")";ctx.fillRect(0,0,W,H);}
  }

  var t0=null,ended=false,raf=0;
  function frame(now){
    if(ended) return; if(t0===null) t0=now; var c=(now-t0)/1000;
    scene(c);
    if(c>T_HIT+0.75&&!root.classList.contains("op-settling")) root.classList.add("op-settling");
    if(c>=T_HIT+1.05){ended=true;host.style.transition="opacity 450ms ease-out";host.style.opacity="0";setTimeout(release,450);return;}
    raf=requestAnimationFrame(frame);
  }
  function stop(){if(ended)return;ended=true;cancelAnimationFrame(raf);root.classList.add("op-settling");host.style.transition="opacity 350ms ease-out";host.style.opacity="0";setTimeout(release,350);}
  ["wheel","touchstart","keydown","pointerdown"].forEach(function(ev){window.addEventListener(ev,stop,{once:true,passive:true});});
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",function(m){if(m.matches){ended=true;release();}});
  raf=requestAnimationFrame(frame);
})();
