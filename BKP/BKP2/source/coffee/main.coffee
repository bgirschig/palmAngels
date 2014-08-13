# shortcuts
LEFT = 0
RIGHT = 1
MOUSE = 2
SIDE = 3
PREV = 0
NEXT = 1

videosCount = 3
bgWrapper = document.getElementById("backgroundWrapper");
currentPage = 0

direction = null
seamPos = null
aimSeamPos = null
seamGoTo = null
mouse = {}

for i in [0..videosCount-1] by 1
	wrap = document.createElement("div")
	wrap.className = "video"
	wrap.id = i;

	image = document.createElement("img");
	image.src = "assets/bookImages/"+(videosCount-1-i)+".png"

	vid  = document.createElement("video")
	vid.autoplay = true
	vid.loop = true

	src = document.createElement("source")
	src.src = "assets/videos/vid"+i+".mp4"
	src.type = "video/mp4"

	vid.appendChild 		src
	wrap.appendChild 		image
	wrap.appendChild 		vid
	bgWrapper.appendChild 	wrap

init = () ->
	document.addEventListener("mousedown", initSwipe);
	document.addEventListener("mouseup", onReleaseTouch);
	window.addEventListener("keydown", onkey);

onkey = (e) ->
	if e.keyCode == 37
		prev()
	else if e.keyCode == 39
		next()

initSwipe = (e) ->
	document.removeEventListener("mousedown", initSwipe);
	# swipeBeginX = e.clientX;
	seamGoTo = MOUSE
	if e.clientX < window.innerWidth/2
		direction = RIGHT
	else
		direction = LEFT
		# seamPos = 0
		seamPos = window.innerWidth

	window.addEventListener("mousemove", updateMouse)
	updateMouse(e) # init the mouse position if the mouse is not moved
	
	animSeam();

onReleaseTouch = () ->
	# When the user releases touch
	seamGoTo = SIDE
	
swipeAnimEnd = () ->
	seamGoTo = null
	bgWrapper.children[1].style.width = ""
	if direction == LEFT
		next()
	# When the line animation ends, after the user has relesed touch
	document.addEventListener("mousedown", initSwipe)
	window.removeEventListener("mousemove", updateMouse)

animSeam = () ->
	if seamGoTo != null
		if direction == LEFT
			if seamGoTo == MOUSE
				seamPos += (mouse.x - seamPos)/1.3
				bgWrapper.children[1].style.width = seamPos+"px";
			else if seamGoTo == SIDE
				if seamPos > 0.1
					seamPos -= seamPos/1.3
					bgWrapper.children[1].style.width = seamPos+"px";
				else
					swipeAnimEnd()
		# else if pageTurner.direction == RIGHT
			#lalala

		setTimeout(animSeam, 50)
	# else, end animation

updateMouse = (e) ->
	mouse.x = e.clientX
	mouse.y = e.clientY
	return true

# preload previous and next images on preV() and next()
prev = () ->
	console.log "prev"
	currentPage--
	roll(videosCount-1)
	bgWrapper.children[videosCount-1].lastChild.play()
	bgWrapper.children[videosCount-1].firstChild.src = "assets/bookImages/"+currentPage+".png"
next = () ->
	console.log "next"
	currentPage++
	roll()
	bgWrapper.children[videosCount-1].lastChild.play()
	bgWrapper.children[videosCount-1].firstChild.src = "assets/bookImages/"+currentPage+".png"

roll = (count=1) ->
	for i in [0..count-1] by 1
		bgWrapper.insertBefore(bgWrapper.children[videosCount-1], bgWrapper.children[0]);

init()