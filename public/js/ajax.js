var server = (function() {

	buildTable = function(data) {
		var data = data.length > 4 ? _.first(data, 4) : data;
		var table = '' ;
		_.each(data, function (ele, index, array) {
			if ( array.length == 1) {				
				table += '<table border="5">'
				table += '<tr><th>User<th>Score'
				table += '<tr>'
				table += '<td>' + ele.username
				table += '<td>' + ele.score
				table += '</table>'				
			} else if (index == 0) {
				table += '<table border="5">'
				table += '<tr><th>User<th>Score'
				table += '<tr>'
				table += '<td>' + ele.username
				table += '<td>' + ele.score
			} else if (index == array.length-1) {
				table += '<tr>'
				table += '<td>' + ele.username
				table += '<td>' + ele.score
				table += '</table>'
			} else {
				table += '<tr>'
				table += '<td>' + ele.username
				table += '<td>' + ele.score
			}
		})
		$('#data').html(table)
	};

	extractScores = function(data) {
		var user = $('.gameboard').attr('id').toLowerCase();
		var difficulty = _.reduce($('#sub_selector li'), function (memo, elem) {
			return $(elem).hasClass('active') ? [].concat.call([], memo, $(elem).attr('id') ) : memo
		}, []).join('').toLowerCase();
		var main = _.reduce($('#main_selector li'), function (memo, elem) {
			return $(elem).hasClass('active') ? [].concat.call([], memo, $(elem).attr('id')) : memo
		}, []).join('');
		var Personal = _.reduce(data, function (mem, elem) {
			return elem.difficulty == difficulty && elem.username == user ? [].concat.call([], mem, elem) : mem
		}, []).sort(function (a, b) {
			return b.score - a.score
		});
		var Global = _.reduce(data, function (mem, elem) {
			return elem.difficulty == difficulty ? [].concat.call([], mem, elem) : mem
		}, []).sort(function (a, b) {
			return b.score - a.score
		});
		return main == 'Global' ? Global : Personal
	};

	fetchScores = function(callback) {
		return $.ajax({
			url : '/api/scores',
			dataType : 'json',
			success : function (data) {
				return callback(data)
			}
		})
	};

	loadGame = function(successcb, failcb) {
		var id = $('.gameboard').attr('id');
		var slot = _.isEmpty($('#game').val()) ? 1 : $('#game').val()
		return $.ajax({
			contentType : 'application/json',
			dataType : 'json',
			type : 'post',
			url : '/loadgame/' + id,
			data : JSON.stringify({slot : +slot}),
			success : function(data) {
				return _.has(data, 'error') ? failcb(data) : successcb(data)
			},
			error: function(error) {
			}
		})
	};

	submitScore = function() {
		var user = $('.gameboard').attr('id').toLowerCase();
		var score = +$('.score').html();
		var difficulty = sessionStorage.getItem('difficulty');
		return $.ajax({
			contentType : 'application/json',
			data : JSON.stringify({username : user, score : score, difficulty : difficulty}),
			url : '/highScore/' + user,
			type : 'post'
		})
	};

	updateGame = function(callback) {
		var that = this
		var id = $('.gameboard').attr('id');
		var val = _.isEmpty($('#game').val()) ? 1 : $('#game').val();
		return $.ajax({
			contentType : 'application/json' ,
			type : 'post',
			url : '/update/' + id,
			data : JSON.stringify({game : that.game, slot : +val}),
			success : function(data) {
				return callback(data)
			}
		}).then(function() {
			console.log('done updating')
		})
	};

	return {
		buildTable : buildTable,
		extractScores : extractScores,
		fetchScores : fetchScores,
		loadGame : loadGame,
		submitScore : submitScore,
		updateGame : updateGame

	}
})()
