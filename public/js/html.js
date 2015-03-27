define(['underscore'], function (_) {
	var styles = function(att1, att2, att3, att4) {
		var args = _.toArray(arguments);
		switch (args.length) {
			case 1 : 
			return 'style="' + _.keys(att1) + ': ' + _.values(att1) + ';"'
			break
			case 2 : 
			return 'style="' + _.keys(att1) + ': ' + _.values(att1) + 'px; ' + _.keys(att2) + ': ' + _.values(att2) + 'px;"'
			break
			case 3 :
			return 'style="' + _.keys(att1) + ': ' + _.values(att1) + '; ' + _.keys(att2) + ': ' + _.values(att2) + 'px; ' +  _.keys(att3) + ': ' + _.values(att3) + 'px;"'
			case 4: 
			return 'style="' + _.keys(att1) + ': ' + _.values(att1) + '; ' + _.keys(att2) + ': ' + _.values(att2) + 'px; ' +  _.keys(att3) + ': ' + _.values(att3) + 'px; ' + _.keys(att4) + ': ' + _.values(att4) + ';"'
		}
	};

	var buildHTML = function(tag, stylez, attributes) {
		return !stylez ? '<' + tag + ' ' + htmlGen(atts, attributes) + '>' + '</' + tag + '>' 
							   : '<' + tag + ' ' + htmlGen(styles, stylez) + htmlGen(atts, attributes) + '>' +' </' + tag + '>' 
	}


	var atts = function(att1, att2, att3) {
		var args = _.toArray(arguments);
		switch (args.length) {
			case 1 : 
			return ' ' + _.keys(att1) + '="' + _.values(att1) + '"'
			break
			case 2 : 
			return ' ' + _.keys(att1) + '="' + _.values(att1) + '" ' + _.keys(att2) + '="' + _.values(att2) + '"'
			break
			case 3 :
			return ' ' + _.keys(att1) + '="' + _.values(att1) + '" ' + _.keys(att2) + '="' + _.values(att2) + '" ' + _.keys(att3) + '="' + _.values(att3) + '"' 
			case 4 :
			return ' ' + _.keys(att1) + '="' + _.values(att1) + '" ' + _.keys(att2) + '="' + _.values(att2) + '" ' + _.keys(att3) + '="' + _.values(att3) + '"' 

		}
	};

	var htmlGen = function(fun, attributes) { 
		return fun.apply(null, attributes)
	};

	var generateBoard = function(deck, rows, columns) {
		var board = '';
		var beginningRow = '<div class="row">';
		var	beginningCards = '';
		var	deckCard = '';
		var	bottomDeck = '';
		var	hidden = '';
		var	game = this;		
		var	deck = deck.game.shuffledDeck;
		var	initialDeck = deck.length;

		_.each(rows, function (ele, ind) {
			_.each(columns, function (elem, index) {
				deckCard += game.buildHTML('img', [{'z-index' : 2}], [{'src' : '/img/Spider/dealer.gif'}, {'id' : 'deckCard' + (ind * columns.length + index + 1)}])
				ind == 0 ? hidden += buildHTML('img', [{'visibility' : 'hidden'}, {'left' : -300 + (index * 71)}, {'top' : 300}], [{'src' : '/img/Spider/hidden.gif'}, {'id' : 'any' + index}]) : false
				ind == 0 ? beginningCards += game.buildHTML('img', [{'z-index' : 3}], [{'class' : deck[( (rows.length + 1) * columns.length) + index]}, {'src' : '/img/Spider/' + deck[( (rows.length + 1) * columns.length) + index] + '.gif'}, {'id' : 'card' + (index+1)}]) : false
			})
		})
		_.each(_.range(initialDeck), function (ele, ind) {
			(ind >= ( (rows.length )* columns.length + 1)) && (ind <= (initialDeck - (columns.length * 2) )) ? (bottomDeck += buildHTML('img', [{'z-index' : 3}], [{'src' : '/img/Spider/dealer.gif'}, {'id' : 'deckCard' + ind}])) : false
		})

		$('#bottomDeck').html(bottomDeck)
		$('#hiding').html(board + beginningRow)
		$('#deck').html(hidden + deckCard + beginningCards)	
	};

	return {
		atts : atts,
		styles : styles,
		htmlGen : htmlGen,
		generateBoard : generateBoard,
		buildHTML : buildHTML
	}
})	