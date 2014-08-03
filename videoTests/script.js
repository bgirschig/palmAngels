
var holders = [document.getElementById("VideoHolder0"),
			   document.getElementById("VideoHolder1")];
var topHolder = 1;
var dragStartX;
var mousePosX;
var seamPos = 0;

var animTimer;

window.addEventListener("mousedown", startSeam);

function startSeam(e){
	window.addEventListener("mousemove", updateMousePos);
	window.addEventListener("mouseup", endSeam);
	updateSeam();
	dragStartX = e.clientX;
}
function endSeam(e){
	window.removeEventListener("mousemove", updateMousePos);
	window.removeEventListener("mouseup", endSeam);
	if(dragStartX-e.clientX>250){
		seamPos = parseFloat(holders[topHolder].style.width);
		window.clearTimeout(animTimer);
		animTimer = animTimer = setTimeout(endAnimation, 50);
		endAnimation();
	}
}
function animSeamTo(percten){
	// holders[topHolder].style.width = 	X) + "px";
	animTimer = setTimeout(updateSeam, 50);
}
function updateMousePos(e){ mousePosX = e.clientX;}

function updateSeam(){
	dragStartX += (window.innerWidth-dragStartX) / 5;
	
	holders[topHolder].style.width = window.innerWidth - (dragStartX-mousePosX) + "px";
	setTimeout(updateSeam, 50);
}
function endAnimation(){
	seamPos += 1;
	holders[topHolder].style.width = window.innerWidth - seamPos + "px";
}

function qw(a){ console.log("debug: "+a); }