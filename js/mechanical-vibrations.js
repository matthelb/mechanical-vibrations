function Spring(constants, type) {
	this.type = new type(constants);
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

function UndampedFreeVibration(constants) {
	this.m = constants['m'];
	this.k = constants['k'];
	this.y0 = constants['y0'];
	this.v0 = constants['v0'];
	this.w0 = Math.sqrt(this.k / this.m);
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

function DampedFreeVibration(constants) {
	this.m = constants['m'];
	this.k = constants['k'];
	this.y0 = constants['y0'];
	this.v0 = constants['v0'];
	this.gamma = constants['gamma'];
	this.w0 = Math.sqrt(this.k / this.m);
	this.wd = this.w0 * Math.sqrt(1 - this.gamma * this.gamma);
	this.determinant = this.gamma * this.gamma - 4 * this.m * this.k;
	this.mu = -this.gamma / 2 / this.m;
	if (this.determinant < 0) {
		this.getPosition = this.getPositionUnderdamped;
		this.getVelocity = this.getVelocityUnderdamped;
		this.getAcceleration = this.getAccelerationUnderdamped;
		this.getAmplitude = this.getAmplitudeUnderdamped;
		this.getMaximumVelocity = this.getMaximumVelocityUnderdamped;
		this.getMaximumAcceleration = this.getMaximumAccelerationUnderdamped;
	} else if (this.determinant > 0) {
		this.getPosition = this.getPositionOverdamped;
		this.getVelocity = this.getVelocityOverdamped;
		this.getAcceleration = this.getAccelerationOverdamped;
		this.getAmplitude = this.getAmplitudeOverdamped;
		this.getMaximumVelocity = this.getMaximumVelocityOverdamped;
		this.getMaximumAcceleration = this.getMaximumAccelerationOverdamped;
		this.root1 = this.mu + Math.sqrt(this.determinant) / 2 / this.m;
		this.root2 = this.mu - Math.sqrt(this.determinant) / 2 / this.m;
	} else {
		this.getPosition = this.getPositionCriticallyDamped;
		this.getVelocity = this.getVelocityCriticallyDamped;
		this.getAcceleration = this.getAccelerationCriticallyDamped;
		this.getAmplitude = this.getAmplitudeCriticallyDamped;
		this.getMaximumVelocity = this.getMaximumVelocityCriticallyDamped;
		this.getMaximumAcceleration = this.getMaximumAccelerationCriticallyDamped;	
	}
}

DampedFreeVibration.prototype.getPositionUnderdamped = function(t) {
	return Math.exp(this.mu * t) * (this.y0 * Math.cos(this.wd * t) + this.v0 / this.w0 * Math.sin(this.wd * t));
}

DampedFreeVibration.prototype.getVelocityUnderdamped = function(t) {
	return 0;//return -Math.exp(-this.determinant * t) * (this.y0 * this.determinant * Math.cos(this.wd * t) - this.v0 / this.w0 * this.wd * Math.cos(this.wd * t) + this.y0 * this.gamma * Math.sin(this.gamma * t) + this.v0 / this.w0 * this.determinant * Math.sin(this.wd * t));
}

DampedFreeVibration.prototype.getAccelerationUnderdamped = function(t) {
	return 0;//return Math.exp(-this.determinant *  t) * (-this.determinant * this.wd * this.wd * Math.cos(this.wd * t) + this.y0 * this.determinant * this.determinant * Math.cos(this.wd * t) + 2 * this.y0 * this.wd * this.determinant * Math.sin(this.wd * t)+this.v0 / this.w0 * this.determinant * this.determinant * Math.sin(this.gamma * t) - 2 * this.v0 / this.w0 * this.determinant * this.gamma * Math.cos(this.gamma * t) - this.v0 / this.w0 * this.gamma * this.gamma * Math.sin(this.gamma * t));
}

DampedFreeVibration.prototype.getAmplitudeUnderdamped = function() {
	return Math.max(Math.abs(this.y0), Math.abs(this.v0 / this.w0));
}

DampedFreeVibration.prototype.getMaximumVelocityUnderdamped = function() {
	return 0;
}

DampedFreeVibration.prototype.getMaximumAccelerationUnderdamped = function() {
	return 0;
}

DampedFreeVibration.prototype.getPositionCriticallyDamped = function(t) {
	return (this.y0 + this.v0 / this.w0 * t) * Math.exp(this.mu * t);
}

DampedFreeVibration.prototype.getVelocityCriticallyDamped = function(t) {
	return (this.y0 * this.mu + this.v0 / this.w0 * this.mu * t + this.v0 / this.w0) * Math.exp(this.mu * t);
}

DampedFreeVibration.prototype.getAccelerationCriticallyDamped = function(t) {
	return (this.y0 * this.mu + this.v0 / this.w0 * this.mu * t + 2 * this.v0 / this.w0) * this.mu * Math.exp(this.mu * t);
}

DampedFreeVibration.prototype.getAmplitudeCriticallyDamped = function() {
	return Math.abs(this.y0);
}

DampedFreeVibration.prototype.getMaximumVelocityCriticallyDamped = function() {
	return Math.abs(this.y0 * this.mu + this.v0 / this.w0);
}

DampedFreeVibration.prototype.getMaximumAccelerationCriticallyDamped = function() {
	return Math.abs(this.mu * this.mu * this.y0 + 2 * this.mu * this.v0 / this.w0);
}

DampedFreeVibration.prototype.getPositionOverdamped = function(t) {
	return this.y0 * Math.exp(this.root1 * t) + this.v0 / this.w0 * Math.exp(this.root2 * t);
}

DampedFreeVibration.prototype.getVelocityOverdamped = function(t) {
	return this.y0 * this.root1 * Math.exp(this.root1 * t) + this.v0 / this.w0 * this.root2 * Math.exp(this.root2 * t);
}

DampedFreeVibration.prototype.getAccelerationOverdamped = function(t) {
	return this.y0 * this.root1 * this.root1 * Math.exp(this.root1 * t) + this.v0 / this.w0 * this.root2 * this.root2 * Math.exp(this.root2 * t);
}

DampedFreeVibration.prototype.getAmplitudeOverdamped = function() {
	return Math.abs(this.y0 + this.v0 / this.w0);
}

DampedFreeVibration.prototype.getMaximumVelocityOverdamped = function() {
	return Math.abs(this.y0 * this.root1 + this.v0 / this.w0 * this.root2);
}

DampedFreeVibration.prototype.getMaximumAccelerationOverdamped = function() {
	return Math.abs(this.y0 * this.root1 * this.root1 + this.v0 / this.w0 * this.root2 * this.root2);
}