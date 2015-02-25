var helper = (function() {

	var allKeys = function(ele, index, array) { // predicate function
		return _.keys(ele)
	};

	var allValues = function(ele, index, array) { // predicate function
		return _.values(ele)
	};

	var anyKey = function(list, obj) {
		var array = _.map(list, function (ele) {
			return _.has(obj, ele)
		});
		return _.some(array, function (ele) {
			return ele == true
		})
	};
	
	var anyValue = function(values, list) {
		return _.map(values, function (ele) {
			return _.contains(list, ele)
		})
	};

	var arrayCheck = function(array, successcb, failcb) {
		var args = _.rest(arguments, 4);
		return _.isEmpty(array) ? successcb.apply(null, args) : failcb.apply(null, args)
	};

	var booleanArray = function(array, value) {
		if (!_.isArray(array)) 
			return array
		var booleans = _.map(array, function (ele) {
			return _.isEqual(ele, value) ? true : false
		});
		return _.contains(booleans, true) ? true : false
	};

	var chainer = function(context, obj) {
		var arg = _.toArray(arguments);
		var funcs = _.reduce(arg, function (memo, ele) {
			return _.isFunction(ele) ? [].concat.call([], memo, ele) : memo
		}, []);
		var params = _.reduce(arg, function (memo, ele, index) {
			var ele = _.isArray(ele) ? [ele]: ele
			return (!_.isFunction(ele) && index > 1 ) ? [].concat.call([], memo, ele) : memo
		}, []);
		return _.reduce(funcs, function (memo, ele) {
			var memo = _.isArray(memo) ? [memo] : memo
			var arg = [].concat.call([], memo, params)
			return ele.apply(context, arg)
		}, obj)
		// return _.reduce(funcs, function (memo, ele) {
		// 	return ele.call(context, memo, params)
		// }, obj)
	};

	var checkForKeys = function(keyList, requiredKeys) { 
		var array = anyValue(requiredKeys, keyList);
		return _.every(array) 
	};

	var compareOffsets = function(input, compareAgainst, determiner, callback) {
		var truthy = _.reduce(compareAgainst, function (memo, ele, index, arr) {
			if (existy(determiner))
				return _.isEqual(ele, input) && determiner(arr, index) ? memo.concat.call(memo, true) : memo
			else 
				return _.isEqual(ele, input) ? memo.concat.call(memo, true) : memo
		}, []);
		return _.contains(truthy, true) ? callback(true) : callback(compareAgainst, input)
	};

	var containsSubString = function(str, substr) {
		var str = str.split('');
		var substring = substr.split('');
		var findings = _.reduce(str, function (memo, ele, index, array) {
			var temp = _.reduce(substring, function (memom, elem, ind) {
				return array[index + ind] == elem ? [].concat.call([], memom, elem) : memom
			}, []).join('');
			return temp == substr ? 'true' : memo
		}, []);
		return _.isEmpty(findings) ? false : true
	}

	var createObject = function(property, value) { // returns an object with the property and value given
		var object = new Object;
		var prop = property;
		object[prop] = value
		return object
	};

	var defaultValues = function(obj, value) { // use to reset obj property values to value ; useful for defaulting properties to empty objects, arrays, and strings
		var args = helper.flatten(_.rest(arguments, 2));
		_.each(args, function (ele) {
			return obj.hasOwnProperty(ele) ? obj[ele] = value : obj
		})
		return obj
	};

	var existy = function(x) {
  		return x != null
	};

	var extractNumber = function(string) {
		return _.reduce(string.split(''), function (memo, ele) {
			return !isNaN(+ele) ? [].concat.call([], memo, ele) : memo
		}, []).join('')
	};

	var extractString = function(string) {
		return _.reduce(string.split(''), function (memo, ele) {
			return isNaN(ele) ? [].concat.call([], memo, ele) : memo
		}, []).join('')
	};

	var flatten = function(array) {
		if(_.some(array, _.isArray)) {
			var reducing = _.reduce(array, function (memo, ele) {
				return [].concat.call([], memo, ele)
			}, []);
			return flatten(reducing)
		} else 
			return array
	}

	var getFirstKey = function(ele, index, array) { // predicate function
		return _.first(_.keys(ele))
	};

	var getFirstValue = function(ele, index, array) { // predicate function
		return _.first(_.values(ele))
	};

	var lastIndex = function(array, index) {
		var length = array.length;
		return index == (array.length - 1) ? true : false
	};

	var partial = function(func, arg) {
		var args = _.rest(arguments, 2);
		var arg = (existy(arg) ? arg : []);
		var finalArgs = [].concat.apply([], [args, arg]);
		return func.apply(null, finalArgs)
	};

	var qualifiers = function(context, list) {
		var funcs = _.rest(arguments, 2);
		return _.map(list, function (ele, index) {
			return _.reduce(funcs, function (memo, elem) {
				if (_.isArray(memo)) 
					memo = [memo]
				var arg = [].concat.call([], context, memo, elem, ele, index)
				return chainer.apply(context, arg)
			}, ele)
		})
	};

	var randomizer = function(array) {
		return _.map(array, function (ele, ind, arr) {
			return arr[Math.floor(Math.random() * arr.length)]
		})
	};

	var returnSubString = function(string, splitter) {
		var position = _.reduce(string.split(''), function (memo, ele, index) {
			return ele == splitter ? [].concat.call([], memo, index) : memo
		}, []).join('')

		return _.reduce(string.split(''), function (memo, ele, index) {
			return index > +position ? memo += ele : memo
		},'')
	}

	var stringLength = function(string) {
		var str = string
		if(_.isArray(string))
			str = string.join(' ')
		return str.split(' ').length
	};

	var truthy = function(x) {
		return x!== false && existy(x)
	};

	var updateDataSet = function(identity, data) {
		var keys = _.map(identity, getFirstKey);
		var values = _.map(data, getFirstValue);
		return _.map(_.range(keys.length), function (ele) {
			return createObject(keys[ele], values[ele])
		})
	}

	var whichKey = function(list, obj) { // returns the keys in list that are present in obj
		var initial = _.map(list, function (ele) {
			return _.has(obj, ele)
		});
		return _.reduce(initial, function (memo, ele, index) {
			return ele == true ? [].concat.call([], memo, list[index]) : memo
		}, []).join('')
	};

	var whichValue = function(values, list, obj) {
		var key = whichKey(list, obj)
		return _.reduce(list, function (memo, ele, index) {
			return ele == key ? [].concat.call([], memo, values[index]): memo
		},[]).join('')
	}

	return {
		allKeys : allKeys,
		allValues : allValues,
		anyKey : anyKey,
		anyValue : anyValue,
		arrayCheck : arrayCheck,
		booleanArray : booleanArray,
		chainer : chainer,
		checkForKeys : checkForKeys,
		compareOffsets : compareOffsets,
		containsSubString : containsSubString,
		createObject : createObject,
		defaultValues : defaultValues,
		existy : existy,
		extractNumber : extractNumber,
		extractString : extractString,		
		flatten : flatten,
		getFirstKey : getFirstKey,		
		getFirstValue : getFirstValue,
		lastIndex : lastIndex,		
		partial : partial,
		qualifiers : qualifiers,
		randomizer : randomizer,
		returnSubString : returnSubString,
		stringLength : stringLength,
		truthy : truthy,
		updateDataSet : updateDataSet,
		whichKey : whichKey,
		whichValue : whichValue
	}
})()

var html = (function() {
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
		return !helper.existy(stylez) ? '<' + tag + ' ' + htmlGen(atts, attributes) + '>' + '</' + tag + '>' 
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
	}

	var generateBoard = function(deck, rows, columns) {
		console.log(arguments)
		var board = '', 
			beginningRow = '<div class="row">',
			beginningCards = '',
			deckCard = '',
			bottomDeck = '',
			hidden = '', 
			game = this		
			deck = deck.game.shuffledDeck,
			initialDeck = deck.length

		_.each(rows, function (ele, ind) {
			_.each(columns, function (elem, index) {
				deckCard += game.buildHTML('img', [{'z-index' : 3}], [{'src' : '/img/Spider/dealer.gif'}, {'id' : 'deckCard' + (ind * columns.length + index + 1)}])
				ind == 0 ? hidden += buildHTML('img', [{'z-index' : 2}, {'top' : 300}, {'left' : -300 + (index * 71)}], [{'src' : '/img/Spider/hidden.gif'}, {'id' : 'any' + index}]) : false
				ind == 0 ? beginningCards += game.buildHTML('img', [{'z-index' : 3}], [{'class' : deck[( (rows.length + 1) * columns.length) + index]}, {'src' : '/img/Spider/' + deck[( (rows.length + 1) * columns.length) + index] + '.gif'}, {'id' : 'card' + (index+1)}]) : false
			})
		})
		console.log(initialDeck)
		_.each(_.range(initialDeck), function (ele, ind) {
			(ind >= ( (rows.length + 1)* columns.length + 1)) && (ind <= (initialDeck - (columns.length * 2))) ? bottomDeck += buildHTML('img', [{'z-index' : 3}], [{'src' : '/img/Spider/dealer.gif'}, {'id' : 'deckCard' + ind}]) : false
		})

		$('#bottomDeck').html(bottomDeck)
		$('#hiding').html(board + beginningRow)
		$('#deck').html(hidden + deckCard + beginningCards)	
	}

	return {
		atts : atts,
		styles : styles,
		htmlGen : htmlGen,
		generateBoard : generateBoard,
		buildHTML : buildHTML
	}

})()

