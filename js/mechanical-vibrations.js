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