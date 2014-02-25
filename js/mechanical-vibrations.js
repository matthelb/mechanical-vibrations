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
	var x = canvas.width / 2 - size / 2;
	var n = 10;
	var i = y / n;
	var m = x + size / 2;
	drawZigZag(context, m, 0, n, i, 8)
	drawZigZag(context, m, 0, n, i, -8)
	context.fillRect(x, y, size, size);
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
function UndampedFreeVibration(m, k, y0, v0) {
	this.m = m;
	this.k = k;
	this.y0 = y0;
	this.v0 = v0;
	this.w0 = Math.sqrt(k / m);
	this.name = "Undamped Free Vibration";
}

UndampedFreeVibration.prototype.call = function(t) {
	return this.y0 * Math.cos(this.w0 * t) + this.v0 / this.w0 * Math.sin(this.w0 * t);
}

UndampedFreeVibration.prototype.getAmplitude = function() {
	return Math.max(Math.abs(this.y0), Math.abs(this.v0 / this.w0));
}