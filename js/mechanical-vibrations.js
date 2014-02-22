function Spring(m, k, y0, v0, type) {
	this.type = new type(m, k, y0, v0);
	this.y = this.type.call;
}

Spring.prototype.draw = function(t, canvas) {
	var context = canvas.getContext('2d');
	context.fillStyle = "blue";
	context.clearRect(0, 0, canvas.width, canvas.height)
	var y = this.type.getAmplitude() - this.type.call(t);
	y = (canvas.height / 4) * y / this.type.getAmplitude();
	var size = Math.max(10, Math.min(100, this.type.m));
	context.fillRect(0, y, size, size);
}

function UndampedFreeVibration(m, k, y0, v0) {
	this.m = m;
	this.k = k;
	this.y0 = y0;
	this.v0 = v0;
	this.w0 = Math.sqrt(k / m);
}

UndampedFreeVibration.prototype.call = function(t) {
	return this.y0 * Math.cos(this.w0 * t) + this.v0 / this.w0 * Math.sin(this.w0 * t);
}

UndampedFreeVibration.prototype.getAmplitude = function() {
	return Math.max(Math.abs(this.y0), Math.abs(this.v0 / this.w0));
}