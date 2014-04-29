function HomogenousSecondOrderDifferentialEquation(a, b, c, c1, c2) {
	this.a = a;
	this.b = b;
	this.c = c;
	this.determinant = Math.pow(b, 2) - 4 * a * c;
	if (this.determinant > 0) {
		this.lambda1 = (-b + Math.sqrt(this.determinant)) / 2 / a;
		this.lambda2 = (-b - Math.sqrt(this.determinant)) / 2 / a;
		this.y = function(t) {
			return c1 * Math.exp(this.lambda1 * t) + c2 * Math.exp(this.lambda2 * t);
		}
	} else if (this.determinant == 0) {
		this.lambda1 = -b / 2 / a;
		this.y = function(t) {
			return c1 * Math.exp(this.lambda1 * t) + c2 * t * Math.exp(this.lambda1 * t);
		}
	} else {
		this.mu = -b / 2 / a;
		this.v = Math.sqrt(4 * a * c - Math.pow(b, 2)) / 2 / a;
		this.y = function(t) {
			return c1 * Math.exp(this.mu * t) * Math.cos(this.v * t) + c2 * Math.exp(this.mu * t) * Math.sin(this.v * t);
		}
	}
}

HomogenousSecondOrderDifferentialEquation.prototype.y = function() {
	return this.y;
}

function NonhomogenousSecondOrderDifferentialEquation(a, b, c, g) {
	this.g = g;
	this.h = new HomogenousSecondOrderDifferentialEquation(a, b, c);
	this.s = 0;
	if (this.h.determinant > 0 && this.h.lambda1 == 0 && this.h.lambda2 == 0) {
		this.s = 1;
	} else if (this.h.determinant == 0 && this.h.lambda1 == 0) {
		this.s = 2;
	}
	var p = g.getDegree();
	var ypDegree = p + this.s;
	var ypCoefficients = [];
	for (var i = 0; i < this.s; ++i) {
		ypCoefficients[i] = 0;
	}
	ypCoefficients.unshift(g.getCoefficient(p - 1) / c);
	console.log(g.getCoefficient(p - 2));
	ypCoefficients.unshift((g.getCoefficient(p - 2) - (p - 1 + this.s) * ypCoefficients[0]) / c);
	for (var i = p - 2; i > 0; --i) {
		ypCoefficients.unshift((g.getCoefficient(i - 1) - a * (i - 1 + this.s) * (i - 1 + this.s - 1) * ypCoefficients[1] - b * (i - 1 + this.s - 1) * ypCoefficients[0]) / c);
	}
	this.yp = new PolynomialFunction(ypCoefficients);
	this.y = function(t) {
		return this.h.y(t) + this.yp.evaluate(t);
	}
	console.log(this);
}

