/* NORTHLAMP product tour (redesign D). Wide screens: the app window stays pinned while the
   steps scroll past it; the step in view picks the screen. With no script, or under 901 px,
   every screen shows in turn. Reduced motion: the screens switch with no fade (CSS). */
(function(){
  "use strict";
  var tour=document.querySelector(".tour"); if(!tour||!("IntersectionObserver" in window)) return;
  var steps=[].slice.call(tour.querySelectorAll(".tour-steps li")), frames=[].slice.call(tour.querySelectorAll(".tour-frames figure"));
  if(!steps.length||steps.length!==frames.length) return;
  tour.classList.add("tour-js");
  function pick(i){steps.forEach(function(s,k){s.classList.toggle("on",k===i);}); frames.forEach(function(f,k){f.classList.toggle("on",k===i);});}
  pick(0);
  /* watch each step's HEADING, not the whole step: a step's text sits in the middle of a tall block, so watching the
     block switched the screen while that text was still below the fold and the column looked empty (17 Nov) */
  var heads=steps.map(function(s){return s.querySelector("h3")||s;});
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting) pick(heads.indexOf(e.target));});
  },{rootMargin:"-35% 0px -35% 0px"});
  heads.forEach(function(h){io.observe(h);});
})();
