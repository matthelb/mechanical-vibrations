$(document).ready(function(){
	$('#simulate-button').click(function(){
		var m = $('#m-input').value();
		var k = $('#k-input').value();
		var y0 = $('#y0-input').value();
		var v0 = $('#v0-input').value();
		var time = $('#time-input').value();
		var start = $('#start-input').value();
		var end = $('#end-input').value();
		var ufv = new UndampedFreeVibration(m, k, y0, v0);
		graph(start, end, ufv, time)
	});
});

function graph(start, end, type, time) {
		var m = parseFloat($('#m-input').val());
		var k = parseFloat($('#k-input').val());
		var y0 = parseFloat($('#y0-input').val());
		var v0 = parseFloat($('#v0-input').val());
		var frames = parseInt($('#time-input').val());
		var start = parseFloat($('#start-input').val());
		var end = parseFloat($('#end-input').val());
		var spring = new Spring(m, k, y0, v0, UndampedFreeVibration);
		graph(start, end, spring, frames);

	});
});

function graph(start, end, spring, seconds) {

	var series = [];
	var container = $('#placeholder');
	var plot = $.plot(container, [series], {
		grid: {
			borderWidth: 1,
			minBorderMargin: 20,
			labelMargin: 10,
			backgroundColor: {
				colors: ["#fff", "#e4f4f4"]
			},
			margin: {
				top: 8,
				bottom: 20,
				left: 20
			},
			markings: function(axes) {
				var markings = [];
				var xaxis = axes.xaxis;
				for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
					markings.push({ xaxis: { from: x, to: x + xaxis.tickSize }, color: "rgba(232, 232, 255, 0.2)" });
				}
				return markings;
			}
		},
		xaxis: {
			min: start,
			max: end
		},
		yaxis: {
			min: -Math.ceil(spring.type.getAmplitude() * 1.1),
			max: Math.ceil(spring.type.getAmplitude() * 1.1)
		},
		legend: {
			show: true
		}
	});

	var t = start;

	var i = (end-start)/(seconds * 60);
	setInterval(function(){
		if(t > end) 
			return;
		series.push([t, spring.type.call(t)]);
		t += i;
		plot.setData([series]);
		plot.setupGrid();
		plot.draw();
		spring.draw(t, $('#spring-canvas')[0]);
	}, 16);
}