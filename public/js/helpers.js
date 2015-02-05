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

	var chainer = function(obj) {
		var arg = _.toArray(arguments);
		var funcs = _.reduce(arg, function (memo, ele) {
			return _.isFunction(ele) ? [].concat.call([], memo, ele) : memo
		}, []);
		var params = _.reduce(arg, function (memo, ele, index) {
			return (!_.isFunction(ele) && index > 0) ? [].concat.call([], memo, ele) : memo
		}, []);
		return _.reduce(funcs, function (memo, ele) {
			return ele.call(null, memo, params)
		}, obj)
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
		return _.contains(truthy, true) ? callback(true) : callback(input, compareAgainst)
	};

	var createObject = function(property, value) { // returns an object with the property and value given
		var object = new Object;
		var prop = property;
		object[prop] = value
		return object
	};

	var defaultValues = function(obj, value) { // use to reset obj property values to value ; useful for defaulting properties to empty objects, arrays, and strings
		var args = _.rest(arguments, 2);
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

	var qualifiers = function(list) {
		var funcs = _.rest(arguments);
		return _.map(list, function (ele, index) {
			return _.reduce(funcs, function (memo, elem) {
				return chainer.call(null, memo, elem, index)
			}, ele)
		})
	};

	var randomizer = function(array) {
		return _.map(array, function (ele, ind, arr) {
			return arr[Math.floor(Math.random() * arr.length)]
		})
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
		truthy : truthy,
		updateDataSet : updateDataSet,
		whichKey : whichKey,
		whichValue : whichValue
	}
})()


console.log(helper)
