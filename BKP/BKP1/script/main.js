(function() {
  var LEFT, MOUSE, RIGHT, animSeam, init, initSwipe, mouse, nextVidId, onSwipeEnd, pageTurner, prevVidId, qw, releaseSwipe, setBottomVid, setHiddenVid, setTopVid, updateMouse, videos;

  videos = [document.getElementById("video0"), document.getElementById("video1"), document.getElementById("video2")];

  LEFT = 0;

  RIGHT = 1;

  MOUSE = 2;

  pageTurner = {};

  mouse = {};

  init = function() {
    pageTurner.currentTopVideo = 0;
    pageTurner.currentBottomVideo = 0;
    pageTurner.seamPos = window.innerWidth;
    pageTurner.stickSeamToMouse = false;
    pageTurner.topDiv = document.getElementById("videoHolderTop");
    pageTurner.bottomDiv = document.getElementById("videoHolderBottom");
    pageTurner.hiddenDiv = document.getElementById("hiddenVideos");
    document.addEventListener("mousedown", initSwipe);
    return document.addEventListener("mouseup", releaseSwipe);
  };

  initSwipe = function(e) {
    document.removeEventListener("mousedown", initSwipe);
    pageTurner.swipeBeginX = e.clientX;
    if (e.clientX < window.innerWidth / 2) {
      pageTurner.direction = RIGHT;
      setBottomVid(prevVidId(pageTurner.currentTopVideo));
      pageTurner.topDiv.className = pageTurner.topDiv.className.replace("attachLeft", "attachRight");
    } else {
      pageTurner.direction = LEFT;
      setBottomVid(nextVidId(pageTurner.currentTopVideo));
      pageTurner.topDiv.className = pageTurner.topDiv.className.replace("attachRight", "attachLeft");
    }
    window.addEventListener("mousemove", updateMouse);
    updateMouse(e);
    pageTurner.aimSeamPos = MOUSE;
    return animSeam();
  };

  releaseSwipe = function() {
    if ((pageTurner.direction === RIGHT && mouse.x - pageTurner.swipeBeginX < 50) || (pageTurner.direction === LEFT && mouse.x - pageTurner.swipeBeginX > -50)) {
      return pageTurner.aimSeamPos = 1 - pageTurner.direction;
    } else {
      return pageTurner.aimSeamPos = pageTurner.direction;
    }
  };

  onSwipeEnd = function(e) {
    if ((pageTurner.direction === RIGHT && mouse.x - pageTurner.swipeBeginX > 50) || (pageTurner.direction === LEFT && mouse.x - pageTurner.swipeBeginX < -50)) {
      setTopVid(pageTurner.currentBottomVideo);
      videos[pageTurner.currentTopVideo].play();
    } else {
      setHiddenVid(pageTurner.currentBottomVideo);
    }
    pageTurner.seamPos = window.innerWidth;
    pageTurner.topDiv.style.width = pageTurner.seamPos + "px";
    document.addEventListener("mousedown", initSwipe);
    return pageTurner.currentBottomVideo = -1;
  };

  setBottomVid = function(id) {
    pageTurner.currentBottomVideo = id;
    pageTurner.bottomDiv.appendChild(videos[pageTurner.currentBottomVideo]);
    return videos[pageTurner.currentBottomVideo].play();
  };

  setTopVid = function(id) {
    hiddenVideos.appendChild(videos[pageTurner.currentTopVideo]);
    pageTurner.currentTopVideo = id;
    return pageTurner.topDiv.appendChild(videos[pageTurner.currentTopVideo]);
  };

  setHiddenVid = function(id) {
    return pageTurner.hiddenDiv.appendChild(videos[id]);
  };

  animSeam = function() {
    var pixelAim;
    if (pageTurner.aimSeamPos === MOUSE && pageTurner.direction === LEFT) {
      pixelAim = mouse.x;
    } else if (pageTurner.aimSeamPos === MOUSE && pageTurner.direction === RIGHT) {
      pixelAim = window.innerWidth - mouse.x;
    } else if (pageTurner.aimSeamPos === LEFT && pageTurner.direction === LEFT) {
      pixelAim = 0;
    } else if (pageTurner.aimSeamPos === LEFT && pageTurner.direction === RIGHT) {
      pixelAim = window.innerWidth;
    } else if (pageTurner.aimSeamPos === RIGHT && pageTurner.direction === RIGHT) {
      pixelAim = 0;
    } else if (pageTurner.aimSeamPos === RIGHT && pageTurner.direction === LEFT) {
      pixelAim = window.innerWidth;
    }
    pageTurner.seamPos += (pixelAim - pageTurner.seamPos) * 0.4;
    pageTurner.topDiv.style.width = pageTurner.seamPos + "px";
    if (Math.abs(pixelAim - pageTurner.seamPos) > 5 || pageTurner.aimSeamPos === MOUSE) {
      return setTimeout(animSeam, 50);
    } else {
      return onSwipeEnd();
    }
  };

  updateMouse = function(e) {
    mouse.x = e.clientX;
    return mouse.y = e.clientY;
  };

  nextVidId = function(current) {
    if (current < videos.length - 1) {
      return current + 1;
    } else {
      return 0;
    }
  };

  prevVidId = function(current) {
    if (current > 0) {
      return current - 1;
    } else {
      return videos.length - 1;
    }
  };

  qw = function(a) {
    return console.log("debug: " + a);
  };

  init();

}).call(this);
