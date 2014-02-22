$(document).ready(function(){
	$('#simulate-button').click(function(){
		/*var m = $('#m-input').value();
		var k = $('#k-input').value();
		var y0 = $('#y0-input').value();
		var v0 = $('#v0-input').value();
		var time = $('#time-input').value();
		var start = $('#start-input').value();
		var end = $('#end-input').value();*/
		var m = 5;
		var k = 5;
		var y0 = 5;
		var v0 = 5;
		var time = 5;
		var start = 0;
		var end = 5;
		var ufv = new UndampedFreeVibration(m, k, y0, v0);
		graph(start, end, ufv, time)
	});
});

function graph(start, end, type, time) {
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
			min: start*.9,
			max: end*1.1
		},
		yaxis: {
			min: -10,
			max: 10
		},
		legend: {
			show: true
		}
	});

	var t = start;
	var i = (end-start)/time/100;
	console.log(i);

	setInterval(function(){
		if(t > end) return;
		series.push([t, type.call(t)]);
		t+=i;
		plot.setData([series]);
		plot.setupGrid();
		plot.draw();
	}, i*1000);
}