function Spring(m, k, y0, v0, type) {
	this.type = new type(m, k, y0, v0);
	this.y = this.type.getPosition;
}

Spring.prototype.draw = function(t, canvas) {
	var context = canvas.getContext('2d');
	context.fillStyle = "blue";
	context.clearRect(0, 0, canvas.width, canvas.height)
	var y = this.type.getAmplitude() - this.type.getPosition(t);
	y = (canvas.height / 4) * y / this.type.getAmplitude();
	var size = Math.max(canvas.width / 40, Math.min(canvas.width / 4, this.type.m));
	var x = canvas.width / 2 - size / 2;
	var n = 10;
	var i = y / n;
	var m = x + size / 2;
	context.strokeStyle = "black";
	drawZigZag(context, m, 0, n, i, 8);
	drawZigZag(context, m, 0, n, i, -8);
/*	var imageObj = new Image();
	imageObj.src = 'weight.png';
	imageObj.onload = function(){
		context.drawImage(imageObj, x, y, size, size);
	}*/
	context.fillRect(x, y, size, size);
	context.strokeStyle = "red";
	drawVector(context, canvas.width - 20, canvas.height / 2, this.type.getVelocity(t), this.type.getMaximumVelocity(), canvas.height / 4, 8);
	context.strokeStyle = "green";
	drawVector(context, canvas.width - 16, canvas.height / 2, this.type.getAcceleration(t), this.type.getMaximumAcceleration(), canvas.height / 4, 8);
}

function drawZigZag(context, x, y, n, spacing, width) {
	context.beginPath();
	var o = width / 2;
	context.moveTo(x - o, 0);
	for (var j = 1; j <= n; j++) {
		context.lineTo(x + o, j * spacing);
		o = -o;
	}
	context.stroke();
	context.closePath();
}

function drawVector(context, x, y, v, maxValue, maxLength, arrowWidth) {
	var length = v / maxValue * maxLength;
	var arrowDelta = arrowWidth / 2 * ((v < 0) ? -1 : 1);
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x, y - length);
	context.lineTo(x - arrowDelta, y - length + arrowDelta);
	context.moveTo(x, y - length);
	context.lineTo(x + arrowDelta, y - length + arrowDelta);
	context.stroke();
	context.closePath();
}

function UndampedFreeVibration(m, k, y0, v0) {
	this.m = m;
	this.k = k;
	this.y0 = y0;
	this.v0 = v0;
	this.w0 = Math.sqrt(k / m);
	this.name = "Undamped Free Vibration";
}

UndampedFreeVibration.prototype.getPosition = function(t) {
	return this.y0 * Math.cos(this.w0 * t) + this.v0 / this.w0 * Math.sin(this.w0 * t);
}

UndampedFreeVibration.prototype.getAmplitude = function() {
	return Math.max(Math.abs(this.y0), Math.abs(this.v0 / this.w0));
}

UndampedFreeVibration.prototype.getVelocity = function(t) {
	return this.v0 * Math.cos(this.w0 * t) - this.y0 * this.w0 * Math.sin(this.w0 * t);
}

UndampedFreeVibration.prototype.getMaximumVelocity = function(t) {
	return Math.max(Math.abs(this.v0), Math.abs(this.y0 * this.w0));
}

UndampedFreeVibration.prototype.getAcceleration = function(t) {
	return -this.w0 * (this.y0 * this.w0 * Math.cos(this.w0 * t)+ this.v0 * Math.sin(this.w0 * t));
}

UndampedFreeVibration.prototype.getMaximumAcceleration = function(t) {
	return Math.max(Math.abs(this.v0 * this.w0), Math.abs(this.y0 * this.w0 * this.w0));
}
