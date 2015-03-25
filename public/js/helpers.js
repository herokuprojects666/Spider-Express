var helper = (function() {
	if (require) {
		_ = require('underscore')
	}
	var allKeys = function(ele, index, array) {
		return _.keys(ele)
	};

	var allValues = function(ele, index, array) { 
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
		var args = _.rest(arguments, 3);
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

	var chainer = function(context, obj, params) {
		var funcs = _.rest(arguments, 3);
		return _.reduce(funcs, function (memo, ele) {
			var memo = _.isArray(memo) ? [memo] : memo;
			var arg = [].concat.call([], memo, params);
			return ele.apply(context, arg)
		}, obj)
	}

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

	var createObject = function(property, value) {
		var object = new Object;
		var prop = property;
		object[prop] = value
		return object
	};

	var defaultValues = function(obj, value) { 
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

	var getFirstKey = function(ele, index, array) { 
		return _.first(_.keys(ele))
	};

	var getFirstValue = function(ele, index, array) { 
		return _.first(_.values(ele))
	};

	var lastIndex = function(array, index) {
		var length = array.length;
		return index == (array.length - 1) ? true : false
	};

	var nestedProperties = function (initial, properties) {
		var string = returnSubString(initial, '.', true);
		if (string == initial) {
			return [].concat.call([], properties, initial)
		} else {
			var properties = properties || []
			var property = returnSubString(initial, '.', true);
			var remainder = returnSubString(initial, '.');
			var props = [].concat.call([], properties, property);
			return nestedProperties (remainder, props)
		}
	};

	var nestedValue = function(obj, propList, value) {
		if (propList.length == 1) {
			obj[_.first(propList)] = value
			return obj
		} else {
			var o;
			if (obj.hasOwnProperty(_.first(propList))) {
				o = obj[_.first(propList)]
			}
			return nestedValue(o, _.rest(propList), value)
		}
	};

	var partial = function(func) {
		var args = _.rest(arguments);
		return function() {
			var arg = _.toArray(arguments);
			return func.apply(null, [].concat.call([], arg, args))
		}		
	}

	var qualifiers = function(context, args, list) {
		var funcs = _.rest(arguments, 3);
		return _.map(list, function (ele, index, array) {
			return _.reduce(funcs, function (memo, elem, ind, arr) {
				if (_.isArray(memo)) 
					memo = [memo]
				var params = [].concat.call([], ele, args, index)
				var arg = [].concat.call([], context, memo, [params], elem)
				return chainer.apply(context, arg)
			}, ele)
		})
	};

	var randomizer = function(array) {
		var arr = []
		for (var i = 0; i < array.length + i; i ++) {
			var random = Math.abs(Math.floor(Math.random() * array.length))
			var item = array.splice(random, 1)
			arr.push(_.first(item))
		}
		return arr
	};

	var randomNumber = function(length, min) {
		var value = Math.floor(Math.random() * length);
		if (min && value <= min) 
			return randomNumber(length, min)
		return value
	};

	var returnSubString = function(string, splitter, determiner) {
		var position = _.reduce(string.split(''), function (memo, ele, index) {
			return ele == splitter && _.isEmpty(memo) ? [].concat.call([], memo, index) : memo
		}, []).join('')

		if (position == '')
			return string

		return _.reduce(string.split(''), function (memo, ele, index) {
			return existy(determiner) && (index < +position) ? memo += ele : !existy(determiner) && (index > +position) ? memo += ele : memo
		},'')
	}

	var stringLength = function(string) {
		var str = string
		if(_.isArray(string)) {
			str = string.join(' ')
		}
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

	var whichKey = function(list, obj) {
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
		nestedProperties: nestedProperties,
		nestedValue : nestedValue,
		partial : partial,
		qualifiers : qualifiers,
		randomizer : randomizer,
		randomNumber : randomNumber,
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
	}

	return {
		atts : atts,
		styles : styles,
		htmlGen : htmlGen,
		generateBoard : generateBoard,
		buildHTML : buildHTML
	}
})()


if (typeof exports !== 'undefined') {
	exports.helper = helper
	exports.html = html
}

