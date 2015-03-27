define(function (require) {
	beforeEach(function() {
		jasmine.addMatchers({
			objectsAreEqual : function(object, o, a) {
				return {
					compare : function (actual, expected) {
						return {
							pass : _.isEqual(actual, expected)
						}
					}
				}
			},
			itContains: function() {
				return {
					compare : function(actual, expected) {
						return {
							pass : _.contains(actual, expected)
						}
					}
				}
			},
			toBeEmpty: function() {
				return {
					compare : function(actual, expected) {
						return {
							pass : _.isEmpty(actual)
						}
					}
				}
			},
			itContainsInstance : function() {
				return {
					compare : function(actual, expected) {
						var temp = _.map(actual, function (ele) {
							return ele instanceof expected? true : false
						})
						return {
							pass: _.every(temp)
						}
					}
				}
			},
			isInstanceOf : function() {
				return {
					compare : function(actual, expected) {
						return {
							pass : actual instanceof expected
						}
					}
				}
			}
		})
	})
	var helper = require('helpers')
	var game = require('main')
	describe("helpers test suite", function () {

		it("should return an array", function() {						
			expect(helper.allKeys({'deckCard5' : '5s'})).isInstanceOf(Array)					
		})
		it("should not be empty", function() {
			expect(helper.allKeys({'deckCard5' : '5s'})).not.toBeEmpty()
		})
		it("should be equal to the expected value", function() {
			expect(helper.allKeys({'deckcard5' : '5s', 'deckcard6' : '6s', 'deckcard7' : '7s'})).toEqual(['deckcard5', 'deckcard6', 'deckcard7'])
		})
		it("should equal expected value when used as a predicate function", function() {
			expect(_.map([{'deckcard5' : '5s'}, {'deckcard6' : '6s'}, {'deckcard7' : '7s'}], helper.allKeys)).toEqual([['deckcard5'], ['deckcard6'], ['deckcard7']])
		})				
	})	
	describe('allValues function', function() {
		it("should return an array", function() {
			expect(helper.allValues({'deckcard5' : '5s'})).isInstanceOf(Array)
		})
		it("should not be empty", function() {
			expect(helper.allValues({'deckcard5' : '5s'})).not.toBeEmpty()
		})
		it("should be equal to expected value", function() {
			expect(helper.allValues({'deckcard5' : '5s', 'deckcard6' : '6s', 'deckcard7' : '7s'})).toEqual(['5s', '6s', '7s'])
		})
		it("should return expected value when used as a predicate function", function() {
			expect(_.map([{'deckcard5' : '5s'}, {'deckcard6' : '6s'}, {'deckcard7' : '7s'}], helper.allValues)).toEqual([['5s'], ['6s'], ['7s']])
		})
	})
	describe("anyKey function", function() {
		var list = ['deckCard5', 'card2', 'card9']
		var obj1 = {'deckCard5' : '5s'}
		var obj2 = {'deckCard8' : '6s'}
		it("should return false", function() {
			expect(helper.anyKey(list, obj2)).toBeFalsy()
		})
		it("should return true", function() {
			expect(helper.anyKey(list, obj1)).toBeTruthy()
		})
	})


	describe("anyValue function", function() {
		it("should contain value", function() {
			expect(helper.anyValue([90], [90])).itContains(true)
		})
		it("should not contain value", function() {
			expect(helper.anyValue([90, 17], [80])).not.itContains(true)
		})
		it("special case for undefined", function() {
			expect(helper.anyValue([undefined], [1, 2, undefined])).itContains(true)
		})
	})
	describe("arrayCheck function", function() {
		var successcb = function(arg) {
			return arg
		}
		var failcb = function(arg) {
			return arg
		}
		it("should call the fail callback", function() {
			expect(helper.arrayCheck([1], successcb, failcb, 'fail')).toEqual('fail')
		})
		it("should call the successcb", function() {
			expect(helper.arrayCheck([], successcb, failcb, 'success')).toEqual('success')
		})
	})
	
	describe("booleanArray function", function() {
		it("test case for passing in string for first parameter", function() {
			expect(helper.booleanArray('adam', 'david')).toEqual('adam')
		})
		it("test case for array that contains value", function() {
			expect(helper.booleanArray([{'left' : 500}], {'left' : 500})).toEqual(true)
		})
		it("test case for array that does not contain value", function() {
			expect(helper.booleanArray([{'left' : 500}], {'top' : 500})).not.toEqual(true)
		})
	})


	describe("chainer function", function() {
		it("should return the final argument", function() {
			expect(helper.chainer(game, 'bleh', null,  function(arg) { return arg + ' yeah'}, function(arg) { return arg + ' noooo'}, function(arg) { return arg + ' final'})).toEqual('bleh yeah noooo final')
		})
	})

	describe("checkForKeys function", function() {
		it("checks for a single key", function() {
			expect(helper.checkForKeys([80, 90, 50],[90])).toEqual(true)
		})
		it("checks for multiple keys", function() {
			expect(helper.checkForKeys([90, 90, 70, 80, 17], [90, 17])).toEqual(true)
		})
		it("makes sure the function can return false", function() {
			expect(helper.checkForKeys([90, 90, 80, 40], [90, 17])).toEqual(false)
		})
	})
	
	describe("compareOffsets function", function() {
		var offsetscb = function() {
			var args = _.toArray(arguments)
			return args.length
		}
		it("should call a function with one argument given a default determiner value", function() {
			expect(helper.compareOffsets({'top' : 100}, [{'top' : 100}, {'top' : 200}], null, offsetscb)).toEqual(1)
		})
		it("should call a function with one argument given a determiner value", function() {
			expect(helper.compareOffsets({'top': 100}, [{'top' : 200}, {'top' : 100}], helper.lastIndex, offsetscb)).toEqual(1)
		})
		it("should call a function with two arguments given a determiner value", function() {
			expect(helper.compareOffsets({'top': 100}, [{'top' : 100}, {'top' : 200}], helper.lastIndex, offsetscb)).toEqual(2)
		})
	})
	describe('createObject function', function() {
		it("should be an instance of", function() {
			expect(helper.createObject('adam', 'stuff')).isInstanceOf(Object)
		})
		it("should be equal to an object", function() {
			expect(helper.createObject('adam', 'stuff')).toEqual({'adam' : 'stuff'})
		})
	})
	describe("defaultValues function", function() {
		it("should create a default value of empty array", function() {
			var object = {'adam' : 'stuff', 'david' : 'more stuff', 'winnie' : 'even more stuff'}
			expect(helper.defaultValues(object, [], 'adam', 'david', 'winnie')).toEqual({'adam' : [], 'david' : [], 'winnie' : []})
		})
		it("should create a default value of empty strings", function() {
			var object = {'adam' : 'stuff', 'david' : 'more stuff', 'winnie' : 'even more stuff'}
			expect(helper.defaultValues(object, '', 'adam', 'david', 'winnie')).toEqual({'adam' : '', 'david' : '', 'winnie' : ''})
		})
		it("should be an instance of and contain instance of", function() {
			var object = {'adam' : 'stuff', 'david' : 'more stuff', 'winnie' : 'even more stuff'}
			expect(helper.defaultValues(object, {}, 'adam', 'david', 'winnie')).isInstanceOf(Object)
			expect(helper.defaultValues(object, {}, 'adam', 'david', 'winnie')).itContainsInstance(Object)
		})
	})
	
	describe("existy function", function() {
		it("returns false", function() {
			expect(helper.existy(null)).toEqual(false)
			expect(helper.existy(undefined)).toEqual(false)
		})
		it("returns true", function() {
			expect(helper.existy(false)).toEqual(true)
			expect(helper.existy({})).toEqual(true)
			expect(helper.existy(true)).toEqual(true)
		})
	})

	describe("extractNumber function", function() {
		it("extracts a number from a string", function() {
			expect(helper.extractNumber('abcd123')).toEqual('123')
		})
	})

	describe("extractString function", function() {
		it("extracts a string from a string", function() {
			expect(helper.extractString('deckcard5')).toEqual('deckcard')
			expect(helper.extractString('card6')).toEqual('card')
		})
	})
	describe("flatten function", function() {
		it("should reduce an array of arrays to an array of values", function() {
			expect(helper.flatten([1,2,3,[4,5,6,[[[[[7,[[8]]]]]]]]])).toEqual([1,2,3,4,5,6,7,8])
		})
		it("should return an instance of array", function() {
			expect(helper.flatten([1,2,3,[4,5,6,[[[[[7,[[8]]]]]]]]])).isInstanceOf(Array)
		})
	})
	describe("getFirstKey function", function() {
		it("should return expected value when used as a predicate function", function() {
			expect(_.map([{'deckcard5' : '5s'}, {'deckcard6' : '6s'}, {'deckcard7' : '7s'}], helper.getFirstKey)).toEqual(['deckcard5', 'deckcard6', 'deckcard7'])
		})
	})

	describe("getFirstValue function", function() {
		it("should return expected value when used as a predicate function", function() {
			expect(_.map([{'deckcard5' : '5s'}, {'deckcard6' : '6s'}, {'deckcard7' : '7s'}], helper.getFirstValue)).toEqual(['5s', '6s', '7s'])
		})
	})

	describe("lastIndex function", function() {
		it("should return false", function() {
			expect(helper.lastIndex([1,2,3], 1)).toEqual(false)
		})
		it("should return true", function() {
			expect(helper.lastIndex([1,2,3], 2)).toEqual(true)
		})
	})
	describe("partial function", function() {
			var len = function() {
				var arg = _.toArray(arguments);
				return arg.length
			}

			var func = function() {
				var arg = _.toArray(arguments);
				return arg
			}

		describe("should return a function of varying argument lengths", function() {

			it("should return a function with one argument", function() {
				expect(helper.partial(len, 'stuff')()).toEqual(1)
			})
			it("should return a function with two arguments", function() {
				expect(helper.partial(len, 'stuff', 'morestuff')()).toEqual(2)
			})
		})

		describe("should return a function with the correct arguments", function() {
			it("should return an array of arguments", function() {
				expect(helper.partial(func, 'stuff')('more stuff')).toEqual(['more stuff', 'stuff'])
			})
			it("should return an instance of array", function() {
				expect(helper.partial(func, 'stuff')()).isInstanceOf(Array)
			})
		})
	})
	describe("qualifiers function", function() {
		it("should perform a list of actions on each value in an array", function() {
			expect(helper.qualifiers(game, [], [1, 2, 3], function(num) { return num + 2}, function(num) { return num * 5}, function(num) { return num - 6})).toEqual([9, 14, 19])
		})
	})	

	describe("truthy function", function() {
		it("returns false", function() {
			expect(helper.truthy(false)).toEqual(false)
			expect(helper.truthy(null)).toEqual(false)
		})
		it("returns true", function() {
			expect(helper.truthy(true)).toEqual(true)
			expect(helper.truthy({})).toEqual(true)
		})
	})

	describe("updateDataSet function", function() {
		var identity = [{'deckcard5' : '5s'}, {'deckcard6' : '6s'}, {'deckcard7' : '7s'}]
		var data = [{'deckcard5' : '7s 6s 5s'}, {'deckcard6' : '7s 6s 5s'}, {'deckcard7' : '7s 6s 5s'}]		
		it("should return an updated data set", function() {
			expect(helper.updateDataSet(identity, data)).toEqual([{'deckcard5' : '7s 6s 5s'}, {'deckcard6' : '7s 6s 5s'}, {'deckcard7' : '7s 6s 5s'}])
		})
	})

	describe("whichKey function", function() {
		it("should return the first key", function() {
			expect(helper.whichKey(['deckcard5', 'deckcard6', 'deckcard7'], {'deckcard5' : '5s'})).toEqual('deckcard5')
		})
		it("should return the second key", function() {
			expect(helper.whichKey(['deckcard5', 'deckcard6', 'deckcard7'], {'deckcard6' : '6s'})).toEqual('deckcard6')
		})
		it("should return an empty string", function() {
			expect(helper.whichKey(['deckcard5', 'deckcard6', 'deckcard7'], {'deckcard9' : '9s'})).toBeEmpty()
		})
	})

	describe("whichValue function", function() {
		it("returns an empty array", function() {
			expect(helper.whichValue(['7s', '8s', '9s'], ['deckCard1', 'deckCard2', 'deckCard3'], {'deckCard4' : '4s'})).toBeEmpty()
		})
		it("returns a non-empty array", function() {
			expect(helper.whichValue(['7s', '8s', '9s'], ['deckCard1', 'deckCard2', 'deckCard3'], {'deckCard3' : '4s'})).toEqual('9s')		
		})
	})
})
