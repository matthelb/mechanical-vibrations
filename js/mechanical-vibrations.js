/***
* Spring
*     Represents a springlike object which adheres to a specific type of mechanical vibration.
*     Can be drawn to a canvas
***/ 

function Spring(params, type) {
	this.type = new type(params);
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

/***
* End Spring
***/

/***
* ____Function
*     A set of classes which represent different mathematical functions that can be evaluated at a specific value
***/

/***
* PolynomialFunction
*     Takes an array of constants, c, where the (length of the array - 1) is the degree, n,  of the polynomial
*     Function is of the form: c[0] + c[1] * x + c[2] * x^2 ... + c[n] * x ^ n
***/
function PolynomialFunction(c) {
	this.c = c;
}

PolynomialFunction.prototype.evaluate = function(x) {
	var sum = 0;
	if (this.c.length > 0) {
		sum = this.c[0];
		for (var i = 1; i < this.c.length; ++i) {
			sum += this.c[i] * Math.pow(x, i);
		}
	}
	return sum;
}

PolynomialFunction.prototype.derivative = function() {
	var constants = [];
	if (this.c.length > 0) {
		for (var i = 1; i < this.c.length; ++i) {
			constants.push(i * this.c[i]);
		}
	}
	return new PolynomialFunction(constants);
}

/***
* ExponentialFunction
*     Takes two constants, a and k
*     Function is of the form: a * e ^ k*x
***/
function ExponentialFunction(a, k) {
	this.a = a;
	this.k = k;
}

ExponentialFunction.prototype.evaluate = function(x) {
	return this.a * Math.exp(this.k * x);
}

ExponentialFunction.prototype.derivative = function() {
	return new ExponentialFunction(this.a * this.k, this.k);
}

/***
* SinusoidalFunction
*     Takes 3 constants, a, w, and p, and a sinusoidal function, f
*         f can either be Math.sin or Math.cos
*     Function is of the form: a * f(w*x + p)
***/
function SinusoidalFunction(a, w, p, f) {
	this.a = a;
	this.w = w;
	this.p = p;
	this.f = f;
}

SinusoidalFunction.prototype.evaluate = function(x) {
	return this.a * this.f(this.w*x + this.p);
}

SinusoidalFunction.prototype.derivative = function() {
	if (this.f == Math.sin) {
		return new SinusoidalFunction(this.a * this.w, this.w, this.p, Math.cos);
	} else if (this.f = Math.cos) {
		return new SinusoidalFunction(-this.a * this.w, this.w, this.p, Math.sin);
	} else {
		return -1;
	}
}

/***
* UndampedFreeVibration
*     Takes an array of constants that must contain m, k, y0, and v0
***/
function UndampedFreeVibration(params) {
	this.m = params['m'];
	this.k = params['k'];
	this.y0 = params['y0'];
	this.v0 = params['v0'];
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

/***
* DampedFreeVibration
*     Takes an array of constants that must contain m, k, y0, v0, and gamma
***/
function DampedFreeVibration(params) {
	this.m = params['m'];
	this.k = params['k'];
	this.y0 = params['y0'];
	this.v0 = params['v0'];
	this.gamma = params['gamma'];
	this.w0 = Math.sqrt(this.k / this.m);
	this.A = this.y0;
	this.B = this.v0 / this.w0;
	this.determinant = this.gamma * this.gamma - 4 * this.m * this.k;
	this.wd = Math.sqrt(-this.determinant) / 2 / this.m;
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
	return Math.exp(this.mu * t) * (this.A * Math.cos(this.wd * t) + this.B * Math.sin(this.wd * t));
}

DampedFreeVibration.prototype.getVelocityUnderdamped = function(t) {
	return Math.exp(this.mu * t) * (Math.sin(this.wd * t) * (this.B * this.mu - this.A * this.wd) + Math.cos(this.wd * t) * (this.A * this.wd + this.B * this.mu));
}

DampedFreeVibration.prototype.getAccelerationUnderdamped = function(t) {
	return Math.exp(this.mu * t) * (Math.sin(t*this.wd)*(this.B*(this.mu * this.mu - this.wd * this.wd) - 2 * this.A * this.mu * this.wd) + Math.cos(t*this.wd)*(this.A*(this.mu * this.mu - this.wd * this.wd) + 2 * this.B * this.mu * this.wd));
}

DampedFreeVibration.prototype.getAmplitudeUnderdamped = function() {
	return Math.max(Math.abs(this.A), Math.abs(this.B));
}

DampedFreeVibration.prototype.getMaximumVelocityUnderdamped = function() {
	return 0;
}

DampedFreeVibration.prototype.getMaximumAccelerationUnderdamped = function() {
	return 0;
}

DampedFreeVibration.prototype.getPositionCriticallyDamped = function(t) {
	return (this.A + this.B * t) * Math.exp(this.mu * t);
}

DampedFreeVibration.prototype.getVelocityCriticallyDamped = function(t) {
	return (this.A * this.mu + this.B * this.mu * t + this.B) * Math.exp(this.mu * t);
}

DampedFreeVibration.prototype.getAccelerationCriticallyDamped = function(t) {
	return (this.A * this.mu + this.B * this.mu * t + 2 * this.B) * this.mu * Math.exp(this.mu * t);
}

DampedFreeVibration.prototype.getAmplitudeCriticallyDamped = function() {
	return Math.abs(this.A);
}

DampedFreeVibration.prototype.getMaximumVelocityCriticallyDamped = function() {
	return Math.abs(this.A * this.mu + this.B);
}

DampedFreeVibration.prototype.getMaximumAccelerationCriticallyDamped = function() {
	return Math.abs(this.mu * this.mu * this.A + 2 * this.mu * this.B);
}

DampedFreeVibration.prototype.getPositionOverdamped = function(t) {
	return this.A * Math.exp(this.root1 * t) + this.B * Math.exp(this.root2 * t);
}

DampedFreeVibration.prototype.getVelocityOverdamped = function(t) {
	return this.A * this.root1 * Math.exp(this.root1 * t) + this.B * this.root2 * Math.exp(this.root2 * t);
}

DampedFreeVibration.prototype.getAccelerationOverdamped = function(t) {
	return this.A * this.root1 * this.root1 * Math.exp(this.root1 * t) + this.B * this.root2 * this.root2 * Math.exp(this.root2 * t);
}

DampedFreeVibration.prototype.getAmplitudeOverdamped = function() {
	return Math.abs(this.A + this.B);
}

DampedFreeVibration.prototype.getMaximumVelocityOverdamped = function() {
	return Math.abs(this.A * this.root1 + this.B * this.root2);
}

DampedFreeVibration.prototype.getMaximumAccelerationOverdamped = function() {
	return Math.abs(this.A * this.root1 * this.root1 + this.B * this.root2 * this.root2);
}

function UndampedForcedVibration(params) {
	this.free = new UndampedFreeVibration(params);

	this.polynomial = new PolynomialFunction(params['polynomial']);
	this.alpha = params['alpha'];
	this.exponential = new ExponentialFunction(this.alpha);
	this.beta = params['beta'];
	this.wavefunction = new SinusoidalFunction(1, this.beta, 0, params['wavetype']);


}

UndampedForcedVibration.prototype.getPosition = function(t) {
	return this.free.getPosition(t) + this.yp(t);
}

UndampedForcedVibration.prototype.getAmplitude = function() {
	return 0;
}

UndampedForcedVibration.prototype.getVelocity = function(t) {
	return 0;
}

UndampedForcedVibration.prototype.getMaximumVelocity = function(t) {
	return 0;
}

UndampedForcedVibration.prototype.getAcceleration = function(t) {
	return 0;
}

UndampedForcedVibration.prototype.getMaximumAcceleration = function(t) {
	return 0;
}

UndampedForcedVibration.prototype.yp = function(t){

}

UndampedForcedVibration.prototype.getFunction = function (polynomial, exponential, sinusoidal){

}