var canvas = document.querySelector("#canvas");
var context = canvas.getContext("2d");
var score = document.querySelector("#score");

var ambientSound = new Audio("files/ambient.mp3");
var goalSound = new Audio("files/goal.mp3");
var kickSound = new Audio("files/kick.wav");

var init = requestAnimationFrame(start);
var player1 = new Player(95, 235);
var player2 = new Player(605, 235);
var ball = new Ball(355, 240);

var wDown, sDown, aDown, dDown = false;
var upDown, downDown, leftDown, rightDown = false;

function start() {
    clear();
	renderGates();
	checkKeyboardStatus();
	checkPlayersBounds();
	checkBallBounds();
	checkPlayersBallTouch();
	movePlayers();
	moveBall();
	renderPlayers();
	renderBall();

    score.innerHTML = player1.score + " - " + player2.score;

	requestAnimationFrame(start);
    
	ambientSound.play();
}

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.xVel = 0;
	this.yVel = 0;
	this.decel = 0.06;
	this.size = 10;
}

function Player(x, y) {
	this.x = x;
	this.y = y;
	this.size = 32;
	this.xVel = 0;
	this.yVel = 0;
	this.score = 0;
	this.accel = 0.6;
	this.decel = 0.6;
	this.maxSpeed = 2;
}

function reset() {
	var score1 = player1.score;
	var score2 = player2.score;
    
	player1 = new Player(100, 250);
	player1.score = score1;

	player2 = new Player(600, 250);
	player2.score = score2;

	ball = new Ball(355, 240);
	wDown = false;
	sDown = false;
	aDown = false;
	dDown = false;
	upDown = false;
	downDown = false;
	leftDown = false;
	rightDown = false;
}

function movePlayers() {
	player1.x += player1.xVel;
	player1.y += player1.yVel;
	player2.x += player2.xVel;
	player2.y += player2.yVel;
}

function checkPlayersBallTouch() { 
	var p1_ball_dis = getDistance(player1.x, player1.y, ball.x, ball.y) - player1.size - ball.size;
	if (p1_ball_dis < 0) {
		collide(ball, player1);
        kickSound.play();
	}

	var p2_ball_dis = getDistance(player2.x, player2.y, ball.x, ball.y) - player2.size - ball.size;
	if (p2_ball_dis < 0) {
		collide(ball, player2);
        kickSound.play();
	}
}

function collide(b, p) {
	var dx = (b.x - p.x) / (b.size);
	var dy = (b.y - p.y) / (b.size);
	p.xVel = -dx;
	p.yVel = -dy;
	b.xVel = dx;
	b.yVel = dy;
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function moveBall() {
	if (ball.xVel !== 0) {
		if (ball.xVel > 0) {
			ball.xVel -= ball.decel;
			if (ball.xVel < 0) ball.xVel = 0;
		} 
        
        else {
			ball.xVel += ball.decel;
			if (ball.xVel > 0) ball.xVel = 0;
		}
	}
    
	if (ball.yVel !== 0) {
		if (ball.yVel > 0) {
			ball.yVel -= ball.decel;
			if (ball.yVel < 0) ball.yVel = 0;
		} 
        
        else {
			ball.yVel += ball.decel;
			if (ball.yVel > 0) ball.yVel = 0;
		}
	}

	ball.x += ball.xVel;
	ball.y += ball.yVel;
}

function checkBallBounds() {
	if (ball.x + ball.size > canvas.width) {
		if (ball.y > 150 && ball.y < 350) {
			player1.score++;
            goalSound.play();
			reset();
			return;
		}
		
        ball.x = canvas.width - ball.size;
		ball.xVel *= -1.5;
	}

	if (ball.x - ball.size < 0) {
		if (ball.y > 150 && ball.y < 350) {
			player2.score++;
            goalSound.play();
			reset();
			return;
		}
		
        ball.x = 0 + ball.size;
		ball.xVel *= -1.5;
	}

	if (ball.y + ball.size > canvas.height) {
		ball.y = canvas.height - ball.size;
		ball.yVel *= -1.5;
	}
    
	if (ball.y - ball.size < 0) {
		ball.y = 0 + ball.size;
		ball.yVel *= -1.5;
	}
}

function checkPlayersBounds() {
	if (player1.x + player1.size > canvas.width) {
		player1.x = canvas.width - player1.size;
		player1.xVel *= -0.5;
	}

	if (player1.x - player1.size < 0) {
		player1.x = 0 + player1.size;
		player1.xVel *= -0.5;
	}

	if (player1.y + player1.size > canvas.height) {
		player1.y = canvas.height - player1.size;
		player1.yVel *= -0.5;
	}

	if (player1.y - player1.size < 0) {
		player1.y = 0 + player1.size;
		player1.yVel *= -0.5;
	}

	if (player2.x + player2.size > canvas.width) {
		player2.x = canvas.width - player2.size;
		player2.xVel *= -0.5;
	}

	if (player2.x - player2.size < 0) {
		player2.x = 0 + player2.size;
		player2.xVel *= -0.5;
	}

	if (player2.y + player2.size > canvas.height) {
		player2.y = canvas.height - player2.size;
		player2.yVel *= -0.5;
	}

	if (player2.y - player2.size < 0) {
		player2.y = 0 + player2.size;
		player2.yVel *= -0.5;
	}
}

function checkKeyboardStatus() {
	if (wDown) {
		if (player1.yVel > -player1.maxSpeed) {
			player1.yVel -= player1.accel;
		}
        
        else {
			player1.yVel = -player1.maxSpeed;
		}
	}
    
    else {
		if (player1.yVel < 0) {
			player1.yVel += player1.decel;
			if (player1.yVel > 0) player1.yVel = 0;
		}
	}

    // ======================================================

	if (sDown) {
		if (player1.yVel < player1.maxSpeed) {
			player1.yVel += player1.accel;
		}
        
        else {
			player1.yVel = player1.maxSpeed;
		}
	}
    
    else {
		if (player1.yVel > 0) {
			player1.yVel -= player1.decel;
			if (player1.yVel < 0) player1.yVel = 0;
		}
	}

    // ======================================================
    
	if (aDown) {
		if (player1.xVel > -player1.maxSpeed) {
			player1.xVel -= player1.accel;
		}
        
        else {
			player1.xVel = -player1.maxSpeed;
		}
	}
    
    else {
		if (player1.xVel < 0) {
			player1.xVel += player1.decel;
			if (player1.xVel > 0) player1.xVel = 0;
		}
	}

    // ======================================================

	if (dDown) {
		if (player1.xVel < player1.maxSpeed) {
			player1.xVel += player1.accel;
		}
        
        else {
			player1.xVel = player1.maxSpeed;
		}
	}
    
    else {
		if (player1.xVel > 0) {
			player1.xVel -= player1.decel;
			if (player1.xVel < 0) player1.xVel = 0;
		}
	}

    // ======================================================

	if (upDown) {
		if (player2.yVel > -player2.maxSpeed) {
			player2.yVel -= player2.accel;
		}
        
        else {
			player2.yVel = -player2.maxSpeed;
		}
	}
    
    else {
		if (player2.yVel < 0) {
			player2.yVel += player2.decel;
			if (player2.yVel > 0) player2.yVel = 0;
		}
	}

    // ======================================================

	if (downDown) {
		if (player2.yVel < player2.maxSpeed) {
			player2.yVel += player2.accel;
		}
        
        else {
			player2.yVel = player2.maxSpeed;
		}
	}
    
    else {
		if (player2.yVel > 0) {
			player2.yVel -= player2.decel;
			if (player2.yVel < 0) player2.yVel = 0;
		}
	}

    // ======================================================

	if (leftDown) {
		if (player2.xVel > -player2.maxSpeed) {
			player2.xVel -= player2.accel;
		}
        
        else {
			player2.xVel = -player2.maxSpeed;
		}
	}
    
    else {
		if (player2.xVel < 0) {
			player2.xVel += player2.decel;
			if (player2.xVel > 0) player2.xVel = 0;
		}
	}

    // ======================================================

	if (rightDown) {
		if (player2.xVel < player2.maxSpeed) {
			player2.xVel += player2.accel;
		}
        
        else {
			player2.xVel = player2.maxSpeed;
		}
	}
    
    else {
		if (player2.xVel > 0) {
			player2.xVel -= player2.decel;
			if (player2.xVel < 0) player2.xVel = 0;
		}
	}
}

document.onkeyup = function(e) {
	if (e.keyCode === 87) {
		wDown = false;
	}

	if (e.keyCode === 65) {
		aDown = false;
	}

	if (e.keyCode === 68) {
		dDown = false;
	}

	if (e.keyCode === 83) {
		sDown = false;
	}

	if (e.keyCode === 38) {
		upDown = false;
	}

	if (e.keyCode === 37) {
		leftDown = false;
	}

	if (e.keyCode === 40) {
		downDown = false;
	}

	if (e.keyCode === 39) {
		rightDown = false;
	}
}

document.onkeydown = function(e) {
	if (e.keyCode === 87) {
		wDown = true;
	}

	if (e.keyCode === 65) {
		aDown = true;
	}

	if (e.keyCode === 68) {
		dDown = true;
	}
    
	if (e.keyCode === 83) {
		sDown = true;
	}

	if (e.keyCode === 38) {
		upDown = true;
	}

	if (e.keyCode === 37) {
		leftDown = true;
	}

	if (e.keyCode === 40) {
		downDown = true;
	}

	if (e.keyCode === 39) {
		rightDown = true;
	}
}

function renderBall() {
	context.fillStyle = "transparent";
	let ballImage = new Image();
	ballImage.src = "files/ball.png";
	context.drawImage(ballImage, ball.x-17, ball.y-25, ball.size+15, ball.size+15);
	context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
	context.fill();
}

function renderPlayers() {
	context.save();
	context.fillStyle = "transparent";

	let player1Image = new Image();
	player1Image.src = "files/player1.png";
	context.drawImage(player1Image, player1.x-30, player1.y-50, 85, 80);
	context.arc(player1.x, player1.y, player1.size,0, Math.PI*2);
	context.fill();

	let player2Image = new Image();
	player2Image.src = "files/player2.png";
	context.drawImage(player2Image, player2.x-50, player2.y-50, 85, 80);
	context.arc(player2.x, player2.y, player1.size, 0, Math.PI*2);
	context.fill();
}

function renderGates(){
	context.save();

	context.beginPath();
	context.moveTo(0, 160);
	context.lineTo(0, 290);
	context.strokeStyle = "red";
	context.lineWidth = 30;
	context.stroke();
	context.closePath();

	context.beginPath();
	context.moveTo(canvas.width, 160);
	context.lineTo(canvas.width, 290);
	context.strokeStyle = "blue";
	context.lineWidth = 30;
	context.stroke();
	context.closePath();
	context.restore();
}

function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}