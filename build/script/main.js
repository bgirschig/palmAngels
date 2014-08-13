(function() {
  var LEFT, MOUSE, NEXT, PREV, RIGHT, SIDE, aimSeamPos, animSeam, bgWrapper, canPlayVideos, currentPage, direction, enableVideo, init, initSwipe, mouse, next, noVideoUserAgents, onOrientation, onReleaseTouch, onkey, orientationEvent, pageDisplayWidthSuperhackState, pagesCount, prev, seamAnimSmoothness, seamGoTo, seamPos, setImages, supportsOrientationChange, swipeAnimEnd, updateMouse, updateProgressBar, videosCount,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  LEFT = 0;

  RIGHT = 1;

  MOUSE = 2;

  SIDE = 3;

  PREV = 0;

  NEXT = 1;

  noVideoUserAgents = ["iPhone", "iPad"];

  seamAnimSmoothness = 2;

  pagesCount = 105;

  videosCount = 3;

  bgWrapper = document.getElementById("backgroundWrapper");

  currentPage = 0;

  direction = null;

  seamPos = null;

  aimSeamPos = null;

  seamGoTo = null;

  mouse = {};

  pageDisplayWidthSuperhackState = true;

  enableVideo = supportsOrientationChange = __indexOf.call(window, "onorientationchange") >= 0;

  orientationEvent = supportsOrientationChange != null ? supportsOrientationChange : {
    "orientationchange": "resize"
  };

  init = function() {
    var bookpage, bookpageWrap, fallback, i, src, vid, wrap, _i, _ref;
    enableVideo = canPlayVideos();
    enableVideo = false;
    for (i = _i = 0, _ref = videosCount - 1; _i <= _ref; i = _i += 1) {
      wrap = document.createElement("div");
      wrap.className = "video";
      wrap.id = i;
      bookpageWrap = document.createElement("div");
      bookpageWrap.className = "bookpageWrap";
      bookpage = document.createElement("img");
      bookpage.draggable = false;
      bookpage.className = "bookpage no-select";
      fallback = document.createElement("img");
      fallback.src = "assets/videos/fallback" + i + ".png";
      fallback.draggable = false;
      fallback.className = "fallback no-select";
      if (enableVideo) {
        vid = document.createElement("video");
        vid.autoplay = true;
        vid.loop = true;
        src = document.createElement("source");
        src.src = "assets/videos/vid" + i + ".mp4";
        src.type = "video/mp4";
      }
      if (enableVideo) {
        vid.appendChild(src);
        bookpageWrap.appendChild(bookpage);
        wrap.appendChild(bookpageWrap);
        wrap.appendChild(vid);
        bgWrapper.appendChild(wrap);
      } else {
        wrap.appendChild(fallback);
        bookpageWrap.appendChild(bookpage);
        wrap.appendChild(bookpageWrap);
        bgWrapper.appendChild(wrap);
      }
    }
    setImages();
    window.addEventListener("touchstart", initSwipe);
    window.addEventListener("touchend", onReleaseTouch);
    return window.addEventListener("orientationchange", onOrientation);
  };

  onOrientation = function(e) {
    var w;
    e.preventDefault();
    if (pageDisplayWidthSuperhackState) {
      w = "99.9999%";
    } else {
      w = "100%";
    }
    bgWrapper.children[0].style.width = w;
    bgWrapper.children[1].style.width = w;
    pageDisplayWidthSuperhackState = !pageDisplayWidthSuperhackState;
    return false;
  };

  onkey = function(e) {
    if (e.keyCode === 37) {
      return prev();
    } else if (e.keyCode === 39) {
      return next();
    }
  };

  initSwipe = function(e) {
    var go;
    go = false;
    if (e.touches) {
      e = e.touches[0];
    }
    if (e.clientX < window.innerWidth / 2 && currentPage > 0) {
      direction = RIGHT;
      seamPos = 0;
      if (enableVideo) {
        bgWrapper.children[2].lastChild.play();
      }
      go = true;
    } else if (e.clientX > window.innerWidth / 2 && currentPage < pagesCount - 1) {
      direction = LEFT;
      seamPos = window.innerWidth;
      if (enableVideo) {
        bgWrapper.children[0].lastChild.play();
      }
      go = true;
    }
    if (go) {
      window.removeEventListener("touchstart", initSwipe);
      window.addEventListener("touchmove", updateMouse);
      seamGoTo = MOUSE;
      updateMouse(e, false);
      animSeam();
    }
    return false;
  };

  onReleaseTouch = function() {
    seamGoTo = SIDE;
    return updateProgressBar();
  };

  swipeAnimEnd = function() {
    seamGoTo = null;
    bgWrapper.children[1].style.width = "";
    bgWrapper.children[0].style.width = "";
    bgWrapper.children[2].style.width = "";
    if (direction === LEFT) {
      next();
    } else {
      prev();
    }
    window.addEventListener("touchstart", initSwipe);
    return window.removeEventListener("touchmove", updateMouse);
  };

  animSeam = function() {
    if (seamGoTo !== null) {
      if (direction === LEFT) {
        if (seamGoTo === MOUSE) {
          seamPos += (mouse.x - seamPos) / seamAnimSmoothness;
          bgWrapper.children[1].style.width = seamPos + "px";
        } else if (seamGoTo === SIDE) {
          if (seamPos > 10) {
            seamPos -= seamPos / seamAnimSmoothness;
            bgWrapper.children[1].style.width = seamPos + "px";
          } else {
            swipeAnimEnd();
          }
        }
      } else if (direction === RIGHT) {
        if (seamGoTo === MOUSE) {
          seamPos += (mouse.x - seamPos) / seamAnimSmoothness;
          bgWrapper.children[2].style.width = seamPos + "px";
        } else if (seamGoTo === SIDE) {
          if (seamPos < window.innerWidth - 10) {
            seamPos += (window.innerWidth - seamPos) / seamAnimSmoothness;
            bgWrapper.children[2].style.width = seamPos + "px";
          } else {
            swipeAnimEnd();
          }
        }
      }
      return setTimeout(animSeam, 50);
    }
  };

  updateMouse = function(e, doPrevent) {
    if (doPrevent == null) {
      doPrevent = true;
    }
    if (doPrevent) {
      e.preventDefault();
    }
    if (e.touches) {
      e = e.touches[0];
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    return false;
  };

  updateProgressBar = function() {
    return document.getElementById("indicator").style.width = (currentPage / pagesCount) * 100 + "%";
  };

  prev = function() {
    currentPage--;
    bgWrapper.appendChild(bgWrapper.children[0]);
    return setImages();
  };

  next = function() {
    currentPage++;
    bgWrapper.insertBefore(bgWrapper.children[videosCount - 1], bgWrapper.children[0]);
    return setImages();
  };

  setImages = function() {
    bgWrapper.children[0].getElementsByClassName("bookpage")[0].src = "assets/bookImages/" + (Math.min(currentPage + 1, pagesCount - 1)) + ".png";
    bgWrapper.children[1].getElementsByClassName("bookpage")[0].src = "assets/bookImages/" + currentPage + ".png";
    return bgWrapper.children[2].getElementsByClassName("bookpage")[0].src = "assets/bookImages/" + (Math.max(currentPage - 1, 0)) + ".png";
  };

  canPlayVideos = function() {
    var agent, _i, _len;
    for (_i = 0, _len = noVideoUserAgents.length; _i < _len; _i++) {
      agent = noVideoUserAgents[_i];
      if (navigator.userAgent.indexOf(agent) !== -1) {
        return false;
      }
    }
    return true;
  };

  init();

}).call(this);
