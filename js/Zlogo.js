
var canvas;
var context;
var images = {};
var totalResources = 6;
var numResourcesLoaded = 0;
var fps = 30;
var x = 110;
var y = 300;
var breathInc = 0.14;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 3.7;
var breathInterval = setInterval(updateBreath, 1000 / fps);
//var maxEyeHeight = 12;
var maxEyeHeight = 3;
var curEyeHeight = maxEyeHeight;
var eyeOpenTime = 0;
var timeBtwBlinks = 4000;
var blinkUpdateTime = 200;                    
var blinkTimer = setInterval(updateBlink, blinkUpdateTime);
var fpsInterval = setInterval(updateFPS, 1000);
var numFramesDrawn = 0;
var curFPS = 0;
var mstatus=0;
var mover=0;
var mmove=0;
var ex=0;
var ey=0;

var pageWidth = $(this).width();
var pageHeight = $(this).height();

var timeout = null;

function updateFPS() {
	
	curFPS = numFramesDrawn;
	numFramesDrawn = 0;
}		
function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	//loadImage("logohandr");
	loadImage("logocornr");
	loadImage("logobody");
	//loadImage("logohandl");
	loadImage("logohead");
	loadImage("logocornl");
	loadImage("eyeskinl");
	loadImage("eyeskinr");
	loadImage("eyel");
	loadImage("eyer");
}

function loadImage(name) {

  images[name] = new Image();
  images[name].onload = function() { 
	  resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {

  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
  
	setInterval(redraw, 1000 / fps);
  }
}

function redraw() {
				
  canvas.width = canvas.width; // clears the canvas 
  context.drawImage(images["logobody"], x-6, y - 65);
  //context.drawImage(images["logohandl"], x-25, y - 51 - breathAmt);
 
  context.drawImage(images["logocornl"], x-85, y - 280 - breathAmt);
  context.drawImage(images["logocornr"], x+112, y - 300 - breathAmt);
 drawEyes(ex,ey);
  
 drawEyecover(x-23,y-93+2*curEyeHeight- breathAmt,x-curEyeHeight,y-91+4*curEyeHeight- breathAmt,x+15,y-88+2*curEyeHeight- breathAmt,x+curEyeHeight,y-138+4*curEyeHeight- breathAmt,x-23,y-96+2*curEyeHeight- breathAmt);//left eye lid
  
  drawEyecover(x-28,y-93+2*curEyeHeight- breathAmt,x+14-curEyeHeight,y-35-4*curEyeHeight- breathAmt,x+13,y-88+2*curEyeHeight- breathAmt,x-6+curEyeHeight,y-67-4*curEyeHeight- breathAmt,x-16,y-92+2*curEyeHeight- breathAmt);//left eye under
   // a/b: left bottom pos, c/d: mid bottom pos, e/f: right pos, g/h: mid top pos, i/j:left top pos
    drawEyecover(x,y-60- breathAmt,x+40+curEyeHeight,y-70- breathAmt,x+21-curEyeHeight,y-100- breathAmt,x+18-curEyeHeight,y-105+2*curEyeHeight- breathAmt,x-4+curEyeHeight,y-67-4*curEyeHeight- breathAmt);
   
  //drawEyecover(x-28,y-110- breathAmt,x-35-curEyeHeight,y-45- breathAmt,x+13,y-78+2*curEyeHeight- breathAmt,x-6+curEyeHeight,y-67-4*curEyeHeight- breathAmt,x-16,y-92+2*curEyeHeight- breathAmt);//left eye under 2nd
  
  
  
  drawEyeskin(x-16,y-92+2*curEyeHeight- breathAmt,x-curEyeHeight,y-91+4*curEyeHeight- breathAmt,x+10,y-88+2*curEyeHeight- breathAmt,x-6+curEyeHeight,y-67-4*curEyeHeight- breathAmt);//left eyeline
  
  drawEyecover(x+77,y-88+2*curEyeHeight- breathAmt,x+95+curEyeHeight,y-91+4*curEyeHeight- breathAmt,x+120-curEyeHeight,y-92+2*curEyeHeight- breathAmt,x+98-curEyeHeight,y-140+4*curEyeHeight- breathAmt,x+73,y-91+2*curEyeHeight- breathAmt);//right eye lid
  
  drawEyecover(x+76,y-88+2*curEyeHeight- breathAmt,x+110+curEyeHeight,y-35-4*curEyeHeight- breathAmt,x+116-curEyeHeight,y-97+2*curEyeHeight- breathAmt,x+102-curEyeHeight,y-67-4*curEyeHeight- breathAmt,x+83,y-88+2*curEyeHeight- breathAmt);//right eye under 2nd
  // a/b: left bottom pos, c/d: mid bottom pos, e/f: right pos, g/h: mid top pos, i/j:left top pos 
  
  drawEyecover(x+95,y-60- breathAmt,x+124+curEyeHeight,y-52- breathAmt,x+129-curEyeHeight,y-110- breathAmt,x+116-curEyeHeight,y-105+2*curEyeHeight- breathAmt,x+102-curEyeHeight,y-75-2*curEyeHeight- breathAmt);//right eye under
  
  
  
  drawEyeskin(x+83,y-88+2*curEyeHeight- breathAmt,x+95+curEyeHeight,y-91+4*curEyeHeight- breathAmt,x+111-curEyeHeight,y-92+2*curEyeHeight- breathAmt,x+102-curEyeHeight,y-67-4*curEyeHeight- breathAmt);//right eyeline
 
  // a/b: left bottom pos, c/d: mid bottom pos, e/f: right pos, g/h: mid top pos, i/j:left top pos
  
  
   context.drawImage(images["logohead"], x - 40, y -220 - breathAmt);
}

function drawEyes(a,b){
	var leftX= -4 * (x / 2 - 35 - a) / x;
	var eyeY = -4* (y / 2 - b) /y;
	//context.translate(leftX, eyeY);
	context.drawImage(images["eyel"], leftX+x-17,eyeY+y-93);
	context.drawImage(images["eyer"], leftX+x+82,eyeY+y-93);	
}

function drawEyeskin(a,b,c,d,e,f,g,h){
	//  context.fillStyle = 'rgba(255,255,255,1.0)';
			context.strokeStyle = 'rgba(115,115,115,0.9)';
			context.beginPath();
			context.lineWidth = 3;
			context.lineJoin = 'round';
			context.moveTo( a, b);
			context.quadraticCurveTo( c, d, e, f);
			context.quadraticCurveTo( g, h, a,b );
			context.closePath();
			context.stroke();
			//context.fill();
}

function drawEyecover(a,b,c,d,e,f,g,h,i,j){
	        context.fillStyle = 'rgba(234,234,234,1.0)';//(255,255,255,1.0)';//
			//context.strokeStyle = 'rgba(109,109,109,1.0)';
			context.beginPath();
			context.lineWidth = 1;
			context.lineJoin = 'round';
			context.moveTo( a, b);
			context.quadraticCurveTo( c, d, e, f);
			context.quadraticCurveTo( g, h, i,j );
			context.closePath();
			//context.stroke();
			context.fill();
}

function drawEyecover2(a,b,c,d,e,f,g,h,i,j){
	        context.fillStyle = 'rgba(4,4,4,1.0)';//(255,255,255,1.0)';//
			//context.strokeStyle = 'rgba(109,109,109,1.0)';
			context.beginPath();
			context.lineWidth = 1;
			context.lineJoin = 'round';
			context.moveTo( a, b);
			context.quadraticCurveTo( c, d, e, f);
			context.quadraticCurveTo( g, h, i,j );
			context.closePath();
			//context.stroke();
			context.fill();
}





function updateBreath() { 
if(mstatus==0){			
  if (breathDir === 1) {  // breath in
	breathAmt -= breathInc;
	if (breathAmt < -breathMax) {
	  breathDir = -1;
	}
  } else {  // breath out
	breathAmt += breathInc;
	if(breathAmt > breathMax) {
	  breathDir = 1;
	}
  }
}else{
	breathAmt=breathAmt;
}
}

function updateBlink() { 
				
  eyeOpenTime += blinkUpdateTime;
	
  if(mover==1){
	eyesopen();
	mstatus=1;
  }else if(mover==0){
	  eyesclose();
  }
}

function eyesopen() {

  curEyeHeight -= 0.1;
  if (curEyeHeight <= 0) {
	curEyeHeight = 0;//maxEyeHeight;	
  } else {
	setTimeout(eyesopen, 45);
  }
}

function eyesclose() {
  curEyeHeight += 0.05;
  if (curEyeHeight >= maxEyeHeight) {
	curEyeHeight = maxEyeHeight;
	mmove=0;
	mstatus=0;	
  } else {
	setTimeout(eyesclose, 45);
  }
  
  
}


/*$('#canvasDiv').mouseover(function() {
	mover=1;
});*/
"use strict"  
var timeout = null;

$("article").mousemove(function(e)  {
    if (timeout !== null) {
        if(mmove==0){
		  mover=1;
          ex=e.pageX;
		  ey=e.pageY;
		  }
        clearTimeout(timeout);
    }

    timeout = setTimeout(function() {
        mover=0;
		mmove=1;
    }, 600);
});

	  
	  