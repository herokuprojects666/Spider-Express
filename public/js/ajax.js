	var server = (function() {
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

		updateGame = function() {
			var that = this
			var id = $('.gameboard').attr('id');
			var val = _.isEmpty($('#game').val()) ? 1 : $('#game').val();
			return $.ajax({
				contentType : 'application/json' ,
				type : 'post',
				url : '/update/' + id,
				data : JSON.stringify({game : that.game, slot : +val}),
				success : function(data) {
				}
			}).then(function() {
				console.log('done updating')
			})
		};

		return {
			fetchScores : fetchScores,
			loadGame : loadGame,
			submitScore : submitScore,
			updateGame : updateGame

		}
	})()
