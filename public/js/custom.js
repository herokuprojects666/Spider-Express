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