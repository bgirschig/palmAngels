(function() {
  var LEFT, MOUSE, NEXT, PREV, RIGHT, SIDE, canPlayVideos, enableVideo, noVideoUserAgents;

  LEFT = 0;

  RIGHT = 1;

  MOUSE = 2;

  SIDE = 3;

  PREV = 0;

  NEXT = 1;

  noVideoUserAgents = ["iPhone", "iPad"];

  window.BookBrowser = (function() {
    function BookBrowser(_pagesCount, appendTo) {
      BookBrowser.seamAnimSmoothness = 1.5;
      BookBrowser.pagesCount = _pagesCount;
      BookBrowser.currentPage = 0;
      BookBrowser.direction = null;
      BookBrowser.seamPos = null;
      BookBrowser.aimSeamPos = null;
      BookBrowser.seamGoTo = null;
      BookBrowser.stickToMouse = false;
      BookBrowser.mouse = {};
      BookBrowser.pageDisplayWidthSuperhackState = true;
      BookBrowser.mainWrapper = appendTo;
      BookBrowser.videosCount = 3;
      BookBrowser.init();
    }

    return BookBrowser;

  })();

  BookBrowser.init = function() {
    BookBrowser.generateDom();
    BookBrowser.setImages();
    window.addEventListener("touchstart", BookBrowser.initSwipe);
    window.addEventListener("touchend", this.onReleaseTouch);
    return window.addEventListener("orientationchange", this.onOrientation);
  };

  BookBrowser.initSwipe = function(e) {
    var go;
    go = false;
    if (e.touches) {
      e = e.touches[0];
    }
    if (e.clientX < window.innerWidth / 2 && BookBrowser.currentPage > 0) {
      BookBrowser.direction = RIGHT;
      BookBrowser.seamPos = 0;
      if (enableVideo) {
        BookBrowser.mainWrapper.getElementsByClassName("layer")[2].lastChild.play();
      }
      go = true;
    } else if (e.clientX > window.innerWidth / 2 && BookBrowser.currentPage < BookBrowser.pagesCount - 1) {
      BookBrowser.direction = LEFT;
      BookBrowser.seamPos = window.innerWidth;
      if (enableVideo) {
        BookBrowser.mainWrapper.getElementsByClassName("layer")[0].lastChild.play();
      }
      go = true;
    }
    if (go) {
      window.removeEventListener("touchstart", BookBrowser.initSwipe);
      window.addEventListener("touchmove", BookBrowser.updateMouse);
      BookBrowser.seamGoTo = MOUSE;
      BookBrowser.updateMouse(e, false);
      BookBrowser.animSeam();
    }
    return false;
  };

  BookBrowser.swipeAnimEnd = function() {
    BookBrowser.seamGoTo = null;
    BookBrowser.stickToMouse = false;
    BookBrowser.mainWrapper.getElementsByClassName("layer")[1].style.width = "";
    BookBrowser.mainWrapper.getElementsByClassName("layer")[0].style.width = "";
    BookBrowser.mainWrapper.getElementsByClassName("layer")[2].style.width = "";
    if (BookBrowser.direction === LEFT) {
      BookBrowser.next();
    } else {
      BookBrowser.prev();
    }
    window.addEventListener("touchstart", BookBrowser.initSwipe);
    return window.removeEventListener("touchmove", BookBrowser.updateMouse);
  };

  BookBrowser.animSeam = function() {
    if (BookBrowser.seamGoTo !== null) {
      if (BookBrowser.direction === LEFT) {
        if (BookBrowser.seamGoTo === MOUSE) {
          if (BookBrowser.stickToMouse) {
            BookBrowser.seamPos = BookBrowser.mouse.x;
          } else {
            BookBrowser.seamPos += (BookBrowser.mouse.x - BookBrowser.seamPos) / BookBrowser.seamAnimSmoothness;
            if (Math.abs(BookBrowser.seamPos - BookBrowser.mouse.x) < 1) {
              BookBrowser.stickToMouse = true;
            }
          }
          BookBrowser.mainWrapper.getElementsByClassName("layer")[1].style.width = BookBrowser.seamPos + "px";
        } else if (BookBrowser.seamGoTo === SIDE) {
          if (BookBrowser.seamPos > 10) {
            BookBrowser.seamPos -= BookBrowser.seamPos / BookBrowser.seamAnimSmoothness;
            BookBrowser.mainWrapper.getElementsByClassName("layer")[1].style.width = BookBrowser.seamPos + "px";
          } else {
            BookBrowser.swipeAnimEnd();
          }
        }
      } else if (BookBrowser.direction === RIGHT) {
        if (BookBrowser.seamGoTo === MOUSE) {
          BookBrowser.seamPos += (BookBrowser.mouse.x - BookBrowser.seamPos) / BookBrowser.seamAnimSmoothness;
          BookBrowser.mainWrapper.getElementsByClassName("layer")[2].style.width = BookBrowser.seamPos + "px";
        } else if (BookBrowser.seamGoTo === SIDE) {
          if (BookBrowser.seamPos < window.innerWidth - 10) {
            BookBrowser.seamPos += (window.innerWidth - BookBrowser.seamPos) / BookBrowser.seamAnimSmoothness;
            BookBrowser.mainWrapper.getElementsByClassName("layer")[2].style.width = BookBrowser.seamPos + "px";
          } else {
            BookBrowser.swipeAnimEnd();
          }
        }
      }
      return setTimeout(BookBrowser.animSeam, 50);
    }
  };

  BookBrowser.updateMouse = function(e, doPrevent) {
    if (doPrevent == null) {
      doPrevent = true;
    }
    if (doPrevent) {
      e.preventDefault();
    }
    if (e.touches) {
      e = e.touches[0];
    }
    BookBrowser.mouse.x = e.clientX;
    BookBrowser.mouse.y = e.clientY;
    return false;
  };

  BookBrowser.onReleaseTouch = function() {
    BookBrowser.seamGoTo = SIDE;
    BookBrowser.updateProgressBar();
    return null;
  };

  BookBrowser.setImages = function() {
    BookBrowser.mainWrapper.getElementsByClassName("layer")[0].getElementsByClassName("bookpage")[0].src = "assets/bookImages/" + (Math.min(BookBrowser.currentPage + 1, BookBrowser.pagesCount - 1)) + ".png";
    BookBrowser.mainWrapper.getElementsByClassName("layer")[1].getElementsByClassName("bookpage")[0].src = "assets/bookImages/" + BookBrowser.currentPage + ".png";
    return BookBrowser.mainWrapper.getElementsByClassName("layer")[2].getElementsByClassName("bookpage")[0].src = "assets/bookImages/" + (Math.max(BookBrowser.currentPage - 1, 0)) + ".png";
  };

  BookBrowser.updateProgressBar = function() {
    return document.getElementById("indicator").style.width = (BookBrowser.currentPage / BookBrowser.pagesCount) * 100 + "%";
  };

  BookBrowser.generateDom = function() {
    var bookpage, bookpageWrap, fallback, i, indicator, layer, layersWrap, progressBar, progressBarWrap, src, vid, _i, _ref;
    layersWrap = document.createElement("div");
    indicator = document.createElement("div");
    progressBar = document.createElement("div");
    progressBarWrap = document.createElement("div");
    indicator.id = "indicator";
    progressBar.id = "progressBar";
    layersWrap.className = "layers";
    progressBarWrap.className = "progressBarWrap";
    progressBar.appendChild(indicator);
    progressBarWrap.appendChild(progressBar);
    for (i = _i = 0, _ref = BookBrowser.videosCount - 1; _i <= _ref; i = _i += 1) {
      layer = document.createElement("div");
      bookpageWrap = document.createElement("div");
      bookpage = document.createElement("img");
      fallback = document.createElement("img");
      layer.className = "layer";
      bookpageWrap.className = "bookpageWrap";
      bookpage.className = "bookpage no-select";
      fallback.className = "fallback no-select";
      bookpage.draggable = false;
      fallback.draggable = false;
      layer.id = i;
      fallback.src = "assets/videos/fallback" + i + ".jpg";
      if (enableVideo) {
        vid = document.createElement("video");
        src = document.createElement("source");
        vid.autoplay = true;
        vid.loop = true;
        src.src = "assets/videos/vid" + i + ".mp4";
        src.type = "video/mp4";
      }
      bookpageWrap.appendChild(bookpage);
      if (enableVideo) {
        vid.appendChild(src);
        layer.appendChild(vid);
      } else {
        layer.appendChild(fallback);
      }
      layer.appendChild(bookpageWrap);
      layersWrap.appendChild(layer);
    }
    BookBrowser.mainWrapper.appendChild(layersWrap);
    BookBrowser.mainWrapper.appendChild(progressBarWrap);
    return null;
  };

  BookBrowser.onOrientation = function(e) {
    var w;
    e.preventDefault();
    scrollTo(0, 0);
    if (BookBrowser.pageDisplayWidthSuperhackState) {
      w = "99.9999%";
    } else {
      w = "100%";
    }
    BookBrowser.mainWrapper.getElementsByClassName("layer")[0].style.width = w;
    BookBrowser.mainWrapper.getElementsByClassName("layer")[1].style.width = w;
    BookBrowser.pageDisplayWidthSuperhackState = !BookBrowser.pageDisplayWidthSuperhackState;
    return false;
  };

  BookBrowser.prev = function() {
    BookBrowser.currentPage--;
    BookBrowser.mainWrapper.getElementsByClassName("layers")[0].appendChild(BookBrowser.mainWrapper.getElementsByClassName("layer")[0]);
    return BookBrowser.setImages();
  };

  BookBrowser.next = function() {
    BookBrowser.currentPage++;
    BookBrowser.mainWrapper.getElementsByClassName("layers")[0].insertBefore(BookBrowser.mainWrapper.getElementsByClassName("layer")[BookBrowser.videosCount - 1], BookBrowser.mainWrapper.getElementsByClassName("layer")[0]);
    return BookBrowser.setImages();
  };

  BookBrowser.kill = (function(_this) {
    return function() {
      var wrap;
      wrap = BookBrowser.mainWrapper;
      while (wrap.firstChild) {
        wrap.removeChild(wrap.firstChild);
      }
      return null;
    };
  })(this);

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

  enableVideo = canPlayVideos();

  enableVideo = false;

}).call(this);

(function() {
  var bookBrowser;

  bookBrowser = document.getElementById("bookBrowser");

  new BookBrowser(105, bookBrowser);

}).call(this);
