function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}

// utility for adding class instead of elem.className = "" where you might overwrite an existing class
function addClass(element, value) {
  if (!element.className) {
    element.className = value;
  } else {
    newClassName = element.className;
    newClassName+= " ";
    newClassName+= value;
    element.className = newClassName;
  }
}



// Create the object and namespace for the slideshow app
var SLIDESHOW = {};
SLIDESHOW.basicSlideshowApp = function() {

  // PRIVATE vars b/c they are outside the anonymous function return
  var slidshow,
      images,
      curImg,
      fadeInInterval,
      fadeOutInterval,
      slideshowInterval,
      slideshowPaused;
      
  // PRIVATE methods would go here b/c they are outside the anonymous function return
  
  
  // START OBJECT CREATION
  
  // PUBLIC properties and methods, the return statement allows this to work
  return {
    
    debug: function() {
      log("curImg is " + curImg);
      log("photos is " + photos);
      log("----> " + photos.length);
    },
    
    initSlides: function() {
      log("-- INIT --");
      slideshow = document.getElementById("slideshow");
      photos = slideshow.getElementsByTagName("img");
      
      this.setOpacity(slideshow, 0);
      TweenMax.to(slideshow, 2, {css:{opacity:1}, ease:Quad.easeIn});
      //this.fadeIn(slideshow, 0);
      
      // photo container (div that holds image and/or text) settings:
      // set the z-index, set the opacity and make them invisible
      for (var i = 0; i < photos.length; i++) {
        var container = photos[i].parentNode;
        log("container is " + container);
        //log("parentNode is " + photos[i].parentNode);
        //log("index is " + i);
        //log("photo src is " + photos[i].getAttribute("src"));
        log("zIndex is " + ((photos.length-1)-i));
        container.style.zIndex = ((photos.length-1)-i);
        this.setOpacity(container, 0);
//        photos[i].style.top = (40 * i) +"px";
        container.style.visiblity = 'hidden';
      } // close the loop
      
      // just using opacity instead of the additional visibility setting
      //photos[0].parentNode.style.opacity = 1;

      // #### ADD COMMENT HERE DAVE
      this.setOpacity(photos[0].parentNode, 100);
      photos[0].parentNode.style.visibility = 'visible';
      curImg = 0;

      // #### ADD COMMENT HERE DAVE
      //slideshowInterval = setTimeout(this.runSlideshow, 3500);
      TweenMax.delayedCall(4, this.runSlideshow);
    },
    
    runSlideshow: function() {
      log("-- RUN SLIDESHOW --");
      // clear any exiting interval
//      clearInterval(slideshowInterval);
//      log("-- CLEAR EXISTING slideshowInterval --");
      
      // clear any fading intervals
//      clearInterval(fadeOutInterval);
//      log("-- CLEAR EXISTING fadeOutInterval --");
      
      // log( "MAKE SURE next image to fade on top of is at 1 opacity " + (curImg + 1) );
      // photos[(curImg + 1) % photos.length].parentNode.style.visibility = 'visible';
      // photos[(curImg + 1) % photos.length].parentNode.style.opacity = 1;
      SLIDESHOW.basicSlideshowApp.setOpacity(photos[(curImg + 1) % photos.length].parentNode, 100);
      // Make sure the image under is visible and fade out the top photo
      photos[(curImg +1) % photos.length].parentNode.style.visibility = 'visible';
      
      log("runSlideshow curImg is " + curImg);
      log("runSlideshow modulus is " +curImg % (photos.length));

      //SLIDESHOW.basicSlideshowApp.fadeOut(photos[curImg % (photos.length)].parentNode, 100);
      var obj = photos[curImg % (photos.length)].parentNode;
      console.log("-----------> " + obj);
      TweenMax.to(obj, 2, { css:{opacity:0}, ease:Quad.easeIn, onComplete:SLIDESHOW.basicSlideshowApp.onFadeComplete, onCompleteParams:[obj] });
    },
    
    onFadeComplete: function (obj) {
      console.log("----> onFadeComplete: " + obj);
      SLIDESHOW.basicSlideshowApp.shufflezIndex();
      curImg++;
      // set the visibility on the previous slide to hidden to make sure the caption links are clickable
      // MAY NOT APPLY TO THIS VERSION?
      photos[(curImg - 1) % photos.length].parentNode.style.visibility = 'hidden';
      // if the curImg is at 0, we're starting over the show so reset the curImg var
      if (curImg % (photos.length) == 0) { curImg = 0; log("-- RESETTING CURIMG! --") };
      // check the pause state boolean just in case someone presses pause during a fade.
      // if there's no pause set, the slideshow will loop again after this slide fades.
      if(!slideshowPaused) { 
        TweenMax.delayedCall(3.5, SLIDESHOW.basicSlideshowApp.runSlideshow);
//        slideshowInterval = setTimeout(SLIDESHOW.basicSlideshowApp.runSlideshow, 3500) 
        };
    },
    
    
    
    
    fadeIn: function(obj, opacity) {
      if (opacity <= 100) {
        log("fade in slide --> " + opacity);
        this.setOpacity(obj,opacity);
        opacity += 10;
        fadeInInterval = setTimeout(function() {SLIDESHOW.basicSlideshowApp.fadeIn(obj,opacity)}, 20);
      } else {
        log("-- FADE IN COMPLETE --");
        clearInterval(fadeInInterval);
      }
    },
    
    fadeOut: function(obj, opacity) {
      if (opacity >= 0) {
        log("-- FADE OUT SLIDE --> " + opacity + " on " + this);
        this.setOpacity(obj, opacity);
        opacity -= 5;
        fadeOutInterval = setTimeout(function() {SLIDESHOW.basicSlideshowApp.fadeOut(obj,opacity)}, 100);
      } else {
        log("-- FADE OUT COMPLETE --");
        this.shufflezIndex();
        curImg++;
        
        // set the visibility on the previous slide to hidden to make sure the caption links are clickable
        // MAY NOT APPLY TO THIS VERSION?
        photos[(curImg - 1) % photos.length].parentNode.style.visibility = 'hidden';
        
        // if the curImg is at 0, we're starting over the show so reset the curImg var
        if (curImg % (photos.length) == 0) { curImg = 0; log("-- RESETTING CURIMG! --") };
        
        // check the pause state boolean just in case someone presses pause during a fade.
        // if there's no pause set, the slideshow will loop again after this slide fades.
        if(!slideshowPaused) { slideshowInterval = setTimeout(SLIDESHOW.basicSlideshowApp.runSlideshow, 3500) };
      }
    },
    
    setOpacity: function(obj, opacity) {
      // Firefox flicker fix ?
      // opacity = (opacity == 100)?99.999:opacity;
      // IE/Win
      obj.style.filter = "alpha(opacity:"+opacity+")";
      // Safari<1.2, Konqueror
      obj.style.KHTMLOpacity = opacity/100;
      // Older Mozilla and Firefox
      obj.style.MozOpacity = opacity/100;
      // Safari 1.2, newer Firefox and Mozilla, CSS3
      obj.style.opacity = opacity/100;
      //opacity = (opacity == 100)?99.999:opacity;
      obj.style.opacity = opacity / 100;
    },
    
    shufflezIndex: function() {
      // log("------> SHUFFLE Z-INDEX <------");  
      for (var i = 0; i < photos.length; i++) {
        log("---> z modulus " + (((photos.length) - i) + (curImg)) % photos.length);
        photos[i].parentNode.style.zIndex = (((photos.length) - i) + (curImg)) % photos.length; 
      }
    },
    
    pauseSlideshow: function() {
      log("checking slideshowPause boolean: " + slideshowPaused);
      if (!slideshowPaused) {
        log("-- PAUSE THE SLIDESHOW --");
        clearInterval(slideshowInterval);
        slideshowPaused = true;
      } else {
        log("-- START THE SLIDESHOW --");
        this.runSlideshow();
        slideshowPaused = false;
      }
    }
  
  }; // close the return for the anonymous object
}(); // the parens here cause the anonymous function to execute and return

// DO IT
SLIDESHOW.basicSlideshowApp.initSlides();



































