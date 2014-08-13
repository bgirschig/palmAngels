# shortcuts
LEFT = 0
RIGHT = 1
MOUSE = 2
SIDE = 3
PREV = 0
NEXT = 1

# settings
noVideoUserAgents = ["iPhone", "iPad"]
seamAnimSmoothness = 2
pagesCount = 105


videosCount = 3
bgWrapper = document.getElementById("backgroundWrapper");
currentPage = 0

direction = null
seamPos = null
aimSeamPos = null
seamGoTo = null
mouse = {}

pageDisplayWidthSuperhackState = true

enableVideo =
supportsOrientationChange = "onorientationchange" in window
orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

init = () ->
	enableVideo = canPlayVideos()
	enableVideo = false #DEBUG
	
	for i in [0..videosCount-1] by 1
		wrap = document.createElement("div")
		wrap.className = "video"
		wrap.id = i

		bookpageWrap = document.createElement("div")
		bookpageWrap.className = "bookpageWrap"

		bookpage = document.createElement("img")
		bookpage.draggable = false
		bookpage.className = "bookpage no-select"

		fallback = document.createElement("img")
		fallback.src = "assets/videos/fallback"+i+".png"
		fallback.draggable = false
		fallback.className = "fallback no-select"

		if enableVideo
			vid  = document.createElement("video")
			vid.autoplay = true
			vid.loop = true

			src = document.createElement("source")
			src.src = "assets/videos/vid"+i+".mp4"
			src.type = "video/mp4"


		if enableVideo
			vid.appendChild 			src
			bookpageWrap.appendChild	bookpage
			wrap.appendChild 			bookpageWrap
			wrap.appendChild 			vid
			bgWrapper.appendChild 		wrap
		else
			wrap.appendChild 			fallback
			bookpageWrap.appendChild 	bookpage
			wrap.appendChild			bookpageWrap
			bgWrapper.appendChild 		wrap
	setImages()

	window.addEventListener "touchstart", initSwipe
	window.addEventListener "touchend", onReleaseTouch

	window.addEventListener("orientationchange", onOrientation);

onOrientation = (e) ->
	e.preventDefault()
	if pageDisplayWidthSuperhackState then w = "99.9999%" else w = "100%"
	bgWrapper.children[0].style.width = w
	bgWrapper.children[1].style.width = w
	pageDisplayWidthSuperhackState = !pageDisplayWidthSuperhackState
	return false

onkey = (e) ->
	if e.keyCode == 37
		prev()
	else if e.keyCode == 39
		next()

initSwipe = (e) ->
	go = false

	if e.touches then e = e.touches[0]

	if e.clientX < window.innerWidth/2 && currentPage > 0
		direction = RIGHT
		seamPos = 0
		if enableVideo
			bgWrapper.children[2].lastChild.play()
		go = true
	else if e.clientX > window.innerWidth/2 && currentPage < pagesCount-1
		direction = LEFT
		seamPos = window.innerWidth
		if enableVideo
			bgWrapper.children[0].lastChild.play()
		go = true

	if go
		window.removeEventListener("touchstart", initSwipe)
		window.addEventListener("touchmove", updateMouse)
		seamGoTo = MOUSE
		updateMouse(e, false) # update mouse object even if the mouse has not moved yet
		animSeam();

	return false;

onReleaseTouch = () ->
	seamGoTo = SIDE
	updateProgressBar()

swipeAnimEnd = () ->
	seamGoTo = null
	bgWrapper.children[1].style.width = ""
	bgWrapper.children[0].style.width = ""
	bgWrapper.children[2].style.width = ""
	if direction == LEFT then next() else prev()
	# When the line animation ends, after the user has relesed touch
	window.addEventListener("touchstart", initSwipe)
	window.removeEventListener("touchmove", updateMouse)

animSeam = () ->
	if seamGoTo != null
		if direction == LEFT
			if seamGoTo == MOUSE
				seamPos += (mouse.x - seamPos)/seamAnimSmoothness
				bgWrapper.children[1].style.width = seamPos+"px";
			else if seamGoTo == SIDE
				if seamPos > 10
					seamPos -= seamPos/seamAnimSmoothness
					bgWrapper.children[1].style.width = seamPos+"px";
				else
					swipeAnimEnd()
		else if direction == RIGHT
			if seamGoTo == MOUSE
				seamPos += (mouse.x - seamPos)/seamAnimSmoothness
				bgWrapper.children[2].style.width = seamPos+"px";
			else if seamGoTo == SIDE
				if seamPos < window.innerWidth - 10
					seamPos += (window.innerWidth-seamPos)/seamAnimSmoothness
					bgWrapper.children[2].style.width = seamPos+"px";
				else
					swipeAnimEnd()
		setTimeout(animSeam, 50)

updateMouse = (e, doPrevent=true) ->

	if doPrevent then e.preventDefault();
	if e.touches then e = e.touches[0]
	mouse.x = e.clientX
	mouse.y = e.clientY
	return false

updateProgressBar = () ->
	document.getElementById("indicator").style.width = (currentPage/pagesCount)*100+"%"

# preload previous and next images on preV() and next()
prev = () ->
	currentPage--
	bgWrapper.appendChild(bgWrapper.children[0])
	setImages()
next = () ->
	currentPage++
	bgWrapper.insertBefore(bgWrapper.children[videosCount-1], bgWrapper.children[0])
	setImages()

setImages = () ->
	bgWrapper.children[0].getElementsByClassName("bookpage")[0].src = "assets/bookImages/"+(Math.min(currentPage+1, pagesCount-1))+".png"
	bgWrapper.children[1].getElementsByClassName("bookpage")[0].src = "assets/bookImages/"+currentPage+".png"
	bgWrapper.children[2].getElementsByClassName("bookpage")[0].src = "assets/bookImages/"+(Math.max(currentPage-1, 0))+".png"
	# bgWrapper.children[0].firstChild.src = "assets/bookImages/"+(Math.min(currentPage+1, pagesCount-1))+".png"
	# bgWrapper.children[1].firstChild.src = "assets/bookImages/"+currentPage+".png"
	# bgWrapper.children[2].firstChild.src = "assets/bookImages/"+(Math.max(currentPage-1, 0))+".png"

canPlayVideos = () ->
	for agent in noVideoUserAgents
		if navigator.userAgent.indexOf(agent) != -1 then return false
	return true

init()