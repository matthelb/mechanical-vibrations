$(document).ready(function(){
	$('.required').append($("<span>").addClass("required-label").text("*"));
	$('input[name=type]:radio').each(function() {
		resetForm($(this));
	});
	$('input[name=type]:radio').click(function() {
		resetForm($(this));
	});
	$('#spring-canvas').attr('width', $('#spring-canvas').width());
	$('#spring-canvas').attr('height', $('#spring-canvas').width());
	$('#start-simulation').click(function(){
		var constants = {
			m : parseFloat($('#m-input').val()),
			k : parseFloat($('#k-input').val()),
			y0 : parseFloat($('#y0-input').val()),
			v0 : parseFloat($('#v0-input').val()),
			frames : parseInt($('#time-input').val()),
			start : parseFloat($('#start-input').val()),
			end : parseFloat($('#end-input').val())
		};
		if ($('#gamma-input').is(':visible')) {
			constants['gamma'] = parseFloat($('#gamma-input').val());
		}
		if(invalidForm(constants)){
			$('#warning-modal').modal('show');
			return;
		}
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
	$('#resume-simulation').click(function(){
		initGraph();
	});
});

function resetForm(radio) {
	if (radio.is(':checked')) {
		if (radio.attr('value') == 'DampedFreeVibration') {
			$('#gamma-input').parents('.form-group').fadeIn();
		} else {
			$('#gamma-input').parents('.form-group').fadeOut();
		}
	}
}
function invalidForm(constants){
	if(isNaN(constants['m']) || isNaN(constants['k']) || isNaN(constants['y0']) || isNaN(constants['v0'])) {
		return true;
	}
	else {
		return false;
	}
}

function initGraph(){
	var m = parseFloat($('#m-input').val());
	var k = parseFloat($('#k-input').val());
	var y0 = parseFloat($('#y0-input').val());
	var v0 = parseFloat($('#v0-input').val());
	var frames = parseInt($('#time-input').val());
	var start = parseFloat($('#start-input').val());
	var end = parseFloat($('#end-input').val());
	if(isNaN(start)) {
		start = 0;
	}
	var type = window[$('input[name=type]:radio:checked').val()];
	var constants = {'m' : m, 'k' : k, 'y0' : y0, 'v0' : v0};
	if ($('#gamma-input').is(':visible')) {
		constants['gamma'] = parseFloat($('#gamma-input').val());
	}
	var spring = new Spring(constants, type);
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
	$("#spring-graph").append($("<div>").addClass("axisLabel").addClass("yaxisLabel").text("y-displacement (m)"));
	$("#spring-graph").append($("<div>").addClass("axisLabel").addClass("xaxisLabel").text("Time (s)"));
	var t = start;
	var i = (isNaN(end)) ? 0.016 : (end - start)/(seconds * 60);

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