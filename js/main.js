$(document).ready(function(){
	$('#start-simulation').click(function(){
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
	$('#stop-simulation').click(function(){
		var id = $('#spring-graph').data('interval-id');
		if (id) {
			clearInterval(id);
		}
	});
});

function graph(start, end, spring, seconds) {
	var series = [];
	var container = $('#spring-graph');
	var xMax = (isNaN(end)) ? start + 10 : end;
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
			max: xMax
		},
		yaxis: {
			min: -Math.ceil((spring.type.getAmplitude() + spring.type.y0) * 1.1),
			max: Math.ceil((spring.type.getAmplitude() + spring.type.y0) * 1.1)
		},
		legend: {
			show: true
		}
	});

	var t = start;
	var i;
	if (isNaN(end)) {
		i = 0.05;
	} else {
		i = (end-start)/(seconds * 60);
	}
	
	container.data('interval-id', setInterval(function(){
		if(t >= end) 
			return;
		if (t >= xMax) {
			series = series.slice(1);
			plot.getOptions().xaxes[0].min += i;
			plot.getOptions().xaxes[0].max += i;
		}
		series.push([t, spring.type.call(t)]);
		t += i;
		plot.setData([series]);
		plot.setupGrid();
		plot.draw();
		spring.draw(t, $('#spring-canvas')[0]);
	}, 16));
}