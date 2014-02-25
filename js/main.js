$(document).ready(function(){
	$('#spring-canvas').attr('width', $('#spring-canvas').width());
	$('#spring-canvas').attr('height', $('#spring-canvas').width());
	$('#start-simulation').click(function(){
		$('#graph-modal').modal('show');
		$('#graph-modal').on('shown.bs.modal', function(e){
			initGraph();
		});
	});
	$('#stop-simulation').click(function(){
		stopGraphing();
	});
	$('#graph-modal').on('hidden.bs.modal', function(e){
		stopGraphing();
	});
	$('#start-simulation').click(function(){
		initGraph();
	});
});

function initGraph(){
	var m = parseFloat($('#m-input').val());
	var k = parseFloat($('#k-input').val());
	var y0 = parseFloat($('#y0-input').val());
	var v0 = parseFloat($('#v0-input').val());
	var frames = parseInt($('#time-input').val());
	var start = parseFloat($('#start-input').val());
	var end = parseFloat($('#end-input').val());
	var type = window[$('input[name=type]:radio:checked').val()];
	var spring = new Spring(m, k, y0, v0, type);
	graph(start, end, spring, frames);
}

function graph(start, end, spring, seconds) {
	stopGraphing();
	$('#modal-title').text(spring.type.constructor.name.split(/(?=[A-Z])/).join(" "));
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
	$("#spring-graph").append($("<div>").addClass("axisLabel").addClass("yaxisLabel").text("y-displacement"));
	$("#spring-graph").append($("<div>").addClass("axisLabel").addClass("xaxisLabel").text("time (s)"));
	var t = start;
	var i = (isNaN(end)) ? 0.016666 : (end - start)/(seconds * 60);

	container.data('interval-id', setInterval(function(){
		if(t >= end) {
			return;
		}
		if(isNaN(end) && t >= seconds) {
			return;
		}
		if (t >= xMax) {
			series = series.slice(1);
			plot.getOptions().xaxes[0].min += i;
			plot.getOptions().xaxes[0].max += i;
		}
		series.push([t, spring.type.getPosition(t)]);
		t += i;
		plot.setData([series]);
		plot.setupGrid();
		plot.draw();
		spring.draw(t, $('#spring-canvas')[0]);
		$('#simulation-time').text(t.toFixed(3));
		$('#spring-position').text(spring.type.getPosition(t).toFixed(3));
		$('#spring-velocity').text(spring.type.getVelocity(t).toFixed(3));
		$('#spring-acceleration').text(spring.type.getAcceleration(t).toFixed(3));
	}, 16));
}

function stopGraphing() {
	var id = $('#spring-graph').data('interval-id');
	if (id) {
		clearInterval(id);
	}
}