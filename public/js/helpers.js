define(['underscore'], function (_) {
	var addToProto = function(baseObj, obj) {
		_.each(baseObj, function (value, key) {
			return _.has(baseObj, key) ? obj.prototype[key] = baseObj[key] : null
		})
		return obj
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

	var appendElements = function(element, list) {
		_.each(list, function (ele) {
			return element instanceof jQuery ? $(element).append(ele) : element.appendChild(ele)
		})
		return element
	}

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

	var clearIntervals = function(object, key) {
		var list = _.each(object, function (ele, keyz) {
			return keyz == key ? _.each(keyz, function (elem) {
				return clearInterval(elem)
			}) : null
		});
		return _.extend(object, {key : []})
	}

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

	var createMultiPropObject = function(props, values) {
		var object = new Object
		_.each(props, function (ele, index) {
			object[ele] = values[index]
		})
		return object
	}

	var createObject = function(property, value) {
		var object = new Object;
		var prop = property;
		object[prop] = value
		return object
	};

	var createNSElement = function (type, object) {
		var element = document.createElementNS('http://www.w3.org/2000/svg', type);
		return setProperties.call(element, object)
	};

	var createElement = function(type, object) {
		var element = document.createElement(type);
		// var setProperties = _.each(object, function (value, key) {
		// 	return element.style.hasOwnProperty(key) ? element.style[key] = value : element.setAttribute(key, value)

		// });
		// return element
		return setProperties.call(element, object)
	}


	var defaultValues = function(obj, value) {
		var args = flatten(_.rest(arguments, 2));
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

	var hideElements = function(selectors) {
		return _.each(selectors, function (ele) {
			$(ele).css('display', 'none')
		})
	}

	var intervals = function(object, key, func, speed, cb) {
		return _.extend(object, {key : setInterval(func, speed, object, cb)})
	};

	var lastIndex = function(array, index) {
		var length = array.length;
		return index == (array.length - 1) ? true : false
	};

	var mapSelectors = function(array, determiner) {
		return _.map(array, function (ele) {
			return determiner ? $('.' + ele) : $('#' + ele)
		})
	};

	var mergeObjects = function(objects, obj) {
		var obj = obj || {};
		_.each(objects, function (ele, index) {
			var value = getFirstValue(ele)
			for (prop in ele) {
				var temp = obj[prop]
				if (obj[prop] != void 0) {
					obj[prop] = temp + ',' + value
				} else {
					obj[prop] = value
				}

			}
		})
		return obj
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
		var that = this
		return function() {
			var arg = _.toArray(arguments);
			return func.apply(that, [].concat.call([], arg, args))
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

	var randomNumber = function(length, min, max) {
		var value = Math.floor(Math.random() * length);
		if (min && max && (value > max || value < min))
			return randomNumber(length, min, max)
		else if (min && value < min)
			return randomNumber(length, min)
		else if (max && value > max)
			return randomNumber(length, null, max)
		else
			return value
	};

	var removeElements = function(selector) {
		return _.each(selector, function (ele) {
			$(ele).remove()
		})
	}

	var resetFields = function(selectors) {
		return _.each(selectors, function (ele) {
			var node = $(ele)[0].nodeName
			return node == 'INPUT' || node == 'TEXTAREA' ? $(ele).val('') : $(ele).html('')

		})
	}

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

	var second = function(array) {
		return _.reduce(array, function (memo, ele, index) {
			return index == 1 ? [].concat.call([], memo, ele) : memo
		},[]).join('')
	}

	var setIdenticalProperties = function(selectors, value) {
		return _.each(selectors, function (ele) {
			return setProperties.call(ele, value)
		})
	}

	var setProperties = function(list) {
		var that = this
		_.each(list, function (value, key) {
			return key == 'height' || key == 'width' || key == 'x' || key == 'y' ? that.setAttribute(key, value) : that.style.hasOwnProperty(key) ? that.style[key] = value : that.setAttribute(key, value)
		})
		return this
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
		addToProto : addToProto,
		allKeys : allKeys,
		allValues : allValues,
		anyKey : anyKey,
		anyValue : anyValue,
		appendElements : appendElements,
		arrayCheck : arrayCheck,
		booleanArray : booleanArray,
		chainer : chainer,
		checkForKeys : checkForKeys,
		clearIntervals : clearIntervals,
		compareOffsets : compareOffsets,
		containsSubString : containsSubString,
		createMultiPropObject : createMultiPropObject,
		createObject : createObject,
		createNSElement : createNSElement,
		createElement : createElement,
		defaultValues : defaultValues,
		existy : existy,
		extractNumber : extractNumber,
		extractString : extractString,
		flatten : flatten,
		getFirstKey : getFirstKey,
		getFirstValue : getFirstValue,
		hideElements : hideElements,
		intervals : intervals,
		lastIndex : lastIndex,
		mapSelectors : mapSelectors,
		mergeObjects : mergeObjects,
		nestedProperties: nestedProperties,
		nestedValue : nestedValue,
		partial : partial,
		qualifiers : qualifiers,
		randomizer : randomizer,
		randomNumber : randomNumber,
		removeElements : removeElements,
		resetFields : resetFields,
		returnSubString : returnSubString,
		setProperties : setProperties,
		setIdenticalProperties : setIdenticalProperties,
		second : second,
		stringLength : stringLength,
		truthy : truthy,
		updateDataSet : updateDataSet,
		whichKey : whichKey,
		whichValue : whichValue
	}
})