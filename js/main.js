$(document).ready(function(){
	$('#simulate-button').click(function(){
		var m = $('#m-input').value();
		var k = $('#k-input').value();
		var y0 = $('#y0-input').value();
		var v0 = $('#v0-input').value();
		var ufv = new UndampedFreeVibration(m, k, y0, v0);

	});
});

function graph(start, end, f) {
	setInterval(function(){
		series[0].data = f(t);
		plot.setData(series);
		plot.draw(); 
	}, 16);
}