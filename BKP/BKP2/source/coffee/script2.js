
var topDiv = document.getElementById("videoHolderTop");
var bottomDiv = document.getElementById("videoHolderBottom");
var hiddenDiv = document.getElementById("hiddenVideos");

var videos = [ document.getElementById("video0"),
			   document.getElementById("video1"),
			   document.getElementById("video2")
			 ];

var currentTopVideo = 0;
var currentBottomVideo = 0;
var seamPos = window.innerWidth;
var aimSeamPos;
var mouse = {};
var stickSeamToMouse = false;
var direction;
var swipeBeginX;

document.addEventListener("mousedown", initSwipe);
document.addEventListener("mouseup", finishSwipe);

var LEFT = 0; var RIGHT = 1; var MOUSE = 2;

function initSwipe(e){
	document.removeEventListener("mousedown", initSwipe);
	swipeBeginX = e.clientX;

	if(e.clientX < window.innerWidth/2){
		direction = RIGHT;
		setBottomVid(prevVidId(currentTopVideo));
		topDiv.className = topDiv.className.replace("attachLeft", "attachRight");
	}
	else {
		direction = LEFT;
		setBottomVid(nextVidId(currentTopVideo));
		topDiv.className = topDiv.className.replace("attachRight", "attachLeft");
	}

	window.addEventListener("mousemove", updateMouse); updateMouse(e);
	
	aimSeamPos = MOUSE;
	animSeam();
}
function endSwipe(e){
	if((direction == RIGHT && mouse.x - swipeBeginX > 50)|| (direction == LEFT && mouse.x - swipeBeginX < -50)){
		setTopVid(currentBottomVideo);
		videos[currentTopVideo].play();		
	}
	else{
		setHiddenVid(currentBottomVideo);
	}
	seamPos = window.innerWidth;
	topDiv.style.width = seamPos + "px";	
	document.addEventListener("mousedown", initSwipe);
	currentBottomVideo = -1;
}

function finishSwipe(){
	if((direction == RIGHT && mouse.x - swipeBeginX < 50)|| (direction == LEFT && mouse.x - swipeBeginX > -50)){
		aimSeamPos = 1-direction;
	}
	else aimSeamPos = direction;
}

function setBottomVid(id){
	currentBottomVideo = id;
	bottomDiv.appendChild(videos[currentBottomVideo]);
	videos[currentBottomVideo].play();
}
function setTopVid(id){
	hiddenVideos.appendChild(videos[currentTopVideo]);
	currentTopVideo = id;
	topDiv.appendChild(videos[currentTopVideo]);
}
function setHiddenVid(id){
	hiddenDiv.appendChild(videos[id]);
}

function animSeam(){
	if(aimSeamPos == MOUSE && direction == LEFT) var pixelAim = mouse.x;
	else if(aimSeamPos == MOUSE && direction == RIGHT) var pixelAim = window.innerWidth - mouse.x;
	else if(aimSeamPos == LEFT && direction == LEFT) var pixelAim = 0;
	else if(aimSeamPos == LEFT && direction == RIGHT) var pixelAim = window.innerWidth;
	else if (aimSeamPos == RIGHT && direction == RIGHT) var pixelAim = 0;
	else if (aimSeamPos == RIGHT && direction == LEFT) var pixelAim = window.innerWidth;

	seamPos += (pixelAim - seamPos) * 0.6;
	topDiv.style.width = seamPos + "px";

	if( (Math.abs(pixelAim - seamPos) > 5 || aimSeamPos == MOUSE) ) setTimeout(animSeam, 50);
	else endSwipe();
}

function updateMouse(e){
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}

function nextVidId(current){return (current < videos.length-1)? current+1 : 0; }
function prevVidId(current){return (current > 0)? current-1 : videos.length-1; }

function qw(a){ console.log("debug: "+a); }