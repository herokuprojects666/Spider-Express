// current max of 22 console.log statements


define(['helpers', 'html'], function (helper, html) {
	return function Spider() {
		var initial = {'allowEvent' : '', 'animation' : '', 'cardStackHTML' : '', 'cards' : ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], 'clicked' : [], 'clickedMatches' : [], 'completedStack' : '', 'currentRow' : [],
					   'data' : [], 'deckHTML' : '','deferreds' : [], 'difficulty' : '', 'draggedData' : [], 'draggedEleOffsets' : [], 'draggedEleString' : [], 'draggedElements' : [], 'draglist' : [], 'droppables' : [], 'elementlist' : [], 'endGame' : false,
					   'fullBaseValue' : [], 'fullOffsetList' : [], 'hiddenElements' : [], 'hoverElements' : [], 'hoverMatches' : [], 'hoverString' : [], 'hovered' : [], 'hoveredData' : [], 'imageDimensions' : {'height' : 96, 'width' : 71}, 
					   'identity' : [], 'initialOffset' : [],'intervals' : [], 'keys' : [], 'list' : [], 'movelist' : [], 'movecount' : 0, 'mousedown' : [], 'offsets' : [], 'oldHoverCard' : [], 'previousRow' : [],
					   'score' : 2000, 'shuffledDeck' : [], 'suits' : [],'stackSelectors' : ['#stack1>img', '#stack2>img', '#stack3>img', '#stack4>img', '#stack5>img', '#stack6>img', '#stack7>img', '#stack8>img'], 'tempOffsets' : []};

		var o = {'game' : initial};
		
		var that = this;

		o.addMove = function(row) {
			var object = _.isEmpty(this.game.oldHoverCard) ? {'hiddenElement' : this.game.hiddenElement, 'hoverString' : this.game.hoverString, 'hoverElements' : this.game.hoverElements, 'draggedElements' : this.game.draggedElements, 'draggedEleString' : this.game.draggedEleString,
															  'draggedEleOffsets' : this.game.draggedEleOffsets} : 
															  {'oldHoverCard' : this.game.oldHoverCard, 'hiddenElement' : this.game.hiddenElement, 'hoverString' : this.game.hoverString, 'hoverElements' : this.game.hoverElements,
														 	  'draggedElements' : this.game.draggedElements, 'draggedEleString' : this.game.draggedEleString, 'draggedEleOffsets' : this.game.draggedEleOffsets};

			var movelist = helper.existy(row) ? [].concat.call(this.game.movelist, {'row' : true, 'rowCards' : row, 'matchedDragged' : this.game.clickedMatches, 'matchedHovered' : this.game.hoverMatches,
														 'hoveredData' : this.game.hoveredData, 'draggedData' : this.game.draggedEleString}) : [].concat.call(this.game.movelist, object);	
			return _.extend(this.game, {'movelist' : movelist})
		};

		o.adjustedOffset = function(parent, element) {
			var parentOffset = $(parent).offset();
			if (_.isEmpty(element)) 
				return parentOffset	
			var element = _.has(element, 'left') ? element :  $(element).position();
			return {'left' : (element['left'] + parentOffset['left']), 'top' : (element['top'] + parentOffset['top'])}
		};

		o.addCompletedStack = function(array, offsets) {
			var idList = this.buildList(array);
			var offsetObj = helper.createObject('offsets', offsets);
			var idObj = helper.createObject('elements', idList);
			var hoverObj = _.isEmpty(this.game.oldHoverCard) ? [] : helper.createObject('oldHoverCard', this.game.oldHoverCard);
			var location = helper.createObject('location', this.lastStack());
			var finalObj = this.mergeObjects([offsetObj, idObj, hoverObj, location]);
			return _.extend(_.last(this.game.movelist), {'completedStack' : finalObj})
		};

		o.bottomDeckFadeOut = function(list, args, deferred, cb) {
			var arg = [].concat.call([], [list], deferred, 50, null, null, [args], cb);
			var interval = function () {
				return that.fadeOut.apply(that, arg)
			};
			var intervalArg = [].concat.call([], interval, 50, deferred, [args], cb);
			return this.intervals.apply(this, intervalArg)
		}

		o.buildDragList = function(list, offset) {
			var offset = helper.existy(offset) ? offset : this.game.initialOffset;
			var items = _.reduce(list, function (memo, element) {
				return (element['top'] >= offset['top']) ? [].concat.call([], memo, element) : memo
			}, []);
			return items.sort(function (a, b){
				return a.top - b.top
			}) 
		};

		o.buildList = function(list) {
			return _.map(list, function (ele) {
				return _.has(ele, 'id') || ele instanceof jQuery ? $(ele).attr('id') : (ele instanceof HTMLElement || (ele.nodeType && ele.nodeType == 1) ) ? ele.getAttribute('id') : helper.getFirstKey(ele)
			})
		};

		o.buildValueList = function(value, ele) {
			var suits = _.uniq(this.game.suits);
			var val =  _.map(suits, function (ele) {
				return value == null ? value : [value, ele].join('')
			});
			return helper.existy(_.first(val)) ? _.extend(this.game, {'droppables' : [].concat.call([], val, 'any'), 'initialOffset' : $(ele).position()}) : [null]
		};

		o.buildValues = function(hoverData, specialCase) {
			var list = (_.isEmpty(this.game.draglist) ? [this.game.clicked] : this.game.draglist);
			var baseValue = _.first(_.values(_.first(hoverData)));
			if (baseValue == 'any') {
				baseValue = undefined
			}
			var hoverElements = this.sortIds(this.buildList(hoverData));
			var otherElements = this.sortIds(this.buildList(list));
			var hovElements = _.reduce(hoverElements, function (memo, ele) {
				return helper.containsSubString(ele, 'any') ? memo : [].concat.call([], memo, ele)
			}, []);
			var hiddenElement = _.reduce(hoverElements, function (memo, ele) {
				return helper.containsSubString(ele, 'any') ? [].concat.call([], memo, ele) : memo
			}, []);
			var otherElements = (_.some(otherElements, _.isArray) ? helper.flatten(otherElements) : otherElements);
			var fullList = [].concat.apply([], [hovElements, otherElements]);
			var draggedOffsets = _.map(otherElements, function (ele, index) {
				return _.isEmpty(that.game.initialOffset) ? {} : {'left' : that.game.initialOffset['left'], 'top' : (+that.game.initialOffset['top'] + (index * 20))}
			});
			var otherBaseValue = _.reduce(this.game.data, function (memo, ele) {
				return $(_.first(list)).attr('id') == helper.getFirstKey(ele) ? [].concat.call([], memo, ele) : memo
			}, []);

			var baseString = _.first(_.values(_.first(otherBaseValue))).split('');
			var baseSuit = _.map(baseString, function (ele, index, array) {
				return index == array.length - 1 ? ele : ''
			}).join('');
			var hoverSuit = _.map(baseValue, function (ele, index, array) {
				return index == array.length - 1 ? ele : ''
			}).join('');
			var altDragValue = _.map( _.range(otherElements.length), function (ele) {
				return _.first(_.values(_.first(otherBaseValue)))
			});
			var altBaseValue = _.map(_.range(hovElements.length), function (ele) {
				return _.first(_.values(_.first(hoverData)))
			});
			var altUniqueValue = [].concat.call([], altBaseValue, altDragValue);
			var uniqueString = hoverSuit != baseSuit ? altUniqueValue : helper.existy(baseValue) ? _.uniq((baseValue + ' ' + _.values(_.first(otherBaseValue))).split(' ')).join(' ') :  _.values(_.first(otherBaseValue)).join(' ');
			var draggedEleString = helper.existy(specialCase) ? _.values(_.first(otherBaseValue)) : [].concat.call([], this.game.draggedEleString, _.values(_.first(otherBaseValue)));
			return _.extend(this.game, {'elementlist' : fullList, 'draggedEleString' : draggedEleString, 'fullBaseValue' : uniqueString,
			'hoverElements' : hovElements, 'hiddenElement' : hiddenElement, 'draggedElements' : otherElements, 'hoverString' : baseValue, 'draggedEleOffsets' : draggedOffsets})
		};

		o.calculateLeft = function(element) {
			var offset = (element ? element : this.game.initialOffset);
			var reduced = _.reduce(this.game.fullOffsetList, function (memo, elem, index) {
				return elem['left'] == offset['left'] && elem['top'] >= 300  ? [].concat.call([], memo, elem) : memo
			}, []);
			return reduced.sort(function (a,b) {
				return a['top'] - b['top']
			})
		};

		o.calculateOffset = function() {
			var list = _.map($('#deck>img'), function(ele) {
				return $(ele).position()
			});
			var left = _.map(list, function(ele) {
				return ele['left']
			});
			var duplicateFree = _.uniq(left);
			var ArrayofArray = _.map(duplicateFree, function (ele) {
				return _.reduce(list, function (memo, element) {
					return element['left'] == ele ? [].concat.call([], memo, element) : memo
				}, [])
			});
			var sorted = _.map(ArrayofArray, function (ele) {
				return _.first(ele.sort(function (a, b) {
					return b['top'] - a['top']
				}))
			});
			return (_.extend(this.game, {'offsets' : sorted}), sorted)
		}

		o.captureInnerHTML = function(selector) {
			return _.map($(selector), function (ele) {
				return $(ele).prop('outerHTML')
			}).join(' ');
		};

		o.catchError = function() {
			var list = this.totalDeck();
			return _.reduce(list, function (memo, ele) {
				var z = $(ele).zIndex()
				return z > 50 ? [].concat.call([], memo, ele) : memo
			}, [])
		};

		o.cheat = function(speed) {
			this.defaulted(false, 'animation')
			var list = _.reduce($('#deck>img'), function (memo, ele) {
				return helper.containsSubString($(ele).attr('id'), 'deck') ? [].concat.call([], memo, ele) : memo
			}, []);
			var index = helper.randomNumber(list.length, 7);
			var offset = $("#deck>img[id*='deck']").eq(index).position();	
			var oldEle = _.reduce($('#deck>img'), function (memo, ele) {
				return helper.containsSubString($(ele).attr('id'), ('deckCard' + (index + 1))) ? [].concat.call([], memo, ele) : memo
			}, []);
			var offset = $(_.first(oldEle)).position();
			$(_.first(oldEle)).fadeOut({duration : speed, complete : function() {
				var z = $("#deck>img[id*='deck']").eq(index).zIndex() + 1; 
				var number = index + 1;
				var src = '/img/Spider/';
				var card = that.game.shuffledDeck[index];
				$(_.first(oldEle)).after(html.buildHTML('img', [{'z-index' : z}, {'left' : offset['left']}, {'top' : offset['top']}, {'display' : 'none'}], 
					[{'class' : card}, {'src' : src + card + '.gif'}, {'id' : 'card' + number}]))
				var ele = _.reduce($('#deck>img'), function (memo, ele) {
					return helper.containsSubString($(ele).attr('id'), ('card' + number )) ? [].concat.call([], memo, ele) : memo
				}, []);			
				$(_.first(ele)).fadeIn({duration : speed, complete : function() {
					$(this).fadeOut({duration : speed, complete : function() {
						$(_.first(oldEle)).fadeIn({duration : speed, complete : function() {
							that.defaulted(true, 'animation')
							$(_.first(ele)).remove()
						}})
					}})
				}})
			}})
		};

		var checkForKeys = function(requiredKeys, keylist) {
			var array = helper.anyValue(requiredKeys, keylist);
			return _.every(array)
		};

		o.checkForKeys = function(requiredKeys) {
			return checkForKeys(requiredKeys, this.game.keys)
		};

		o.clearIntervals = function(deferred, successcb, failcb) {
			var args = _.rest(arguments, 3);
			_.map(this.game.intervals, function(ele) {
						window.clearInterval(ele)})	
			_.extend(this.game, {'intervals' : []})
		};

		o.clearStacks = function() {
			var stacks = _.each(this.game.stackSelectors, function (ele) {
				return $(ele).length > 1 ? $(ele).eq(0).remove() : null
			});
		};

		o.completedSuit = function() {
			var finalLocation = this.stackLocation();
			var parent = helper.returnSubString(finalLocation, '>', true);
			var child = $(finalLocation).eq(0);
			var data = _.reduce(this.game.data, function (memo, ele, index) {
				var selector = _.first(that.mapSelectors([helper.getFirstKey(ele)]));
				var offset = that.adjustedOffset('#deck', that.switchARoo(selector));
				var element = that.adjustedOffset(parent, child);
				return helper.stringLength(helper.getFirstValue(ele)) == 13 && offset['top'] > element['top'] ? [].concat.call([], memo, helper.getFirstKey(ele)) : memo
			}, []);
			var selectors = this.mapSelectors(data);
			var offsets = _.map(selectors, this.switchARoo);
			var sorted = this.sortOffsets(offsets);
			var height = $(window).height();
			var itemHeight = this.adjustedOffset('#deck', _.last(sorted))
			if (itemHeight['top'] > height) {
				$('html body').scrollTop(itemHeight['top'] - height + 20)
			}
			var elements = _.map(sorted, this.switchARoo);
			return elements
		};

		o.createDeck = function(suits) {
			_.extend(this.game, {'suits' : suits})
			var cardList = this.game.cards;;		
			var list = _.map(this.game.suits, function (ele, ind, arr) {
				return _.map(cardList, function (elem) {
					return [elem, ele].join('')
				})
			});
			var deck = helper.flatten(list);
			_.extend(this.game, {'shuffledDeck' : deck})
		};

		o.curry = function(func, arg) {
			var args = _.rest(arguments, 2);
			if (_.isArray(arg))
				arg = [arg]
			var finalArgs = [].concat.call([], arg, args);
			return func.apply(this, finalArgs)
		};

		o.dealCard = function(speed, list, offsets, progressFunc, deferred, callback) {
			if (_.isEmpty(this.game.list)) 
				_.extend(this.game, {'list' : list, 'tempOffsets' : offsets})
			var left = _.first(that.game.tempOffsets)['left'];
			var top = _.first(that.game.tempOffsets)['top'];
			var item = _.first(that.game.list);
			var args = _.rest(arguments, 6);
			var index = _.first(this.game.list);
			$(item).animate({
				left : left,
				top : top
			}, { complete : function() { 
				if (index == _.last(list)) {
					return deferred.resolve().done(callback.apply(that, args))
				}
			} , duration : speed})
			
			_.extend(this.game, {'list' : _.rest(this.game.list),'tempOffsets' : _.rest(this.game.tempOffsets)})
			if (_.isEmpty(this.game.list)) { 
				return that.clearIntervals()
			}
		};

		o.dealCards = function(determiner, list, offsets, card, speed, progressFunc, deferred, args, callback) {
			var cards = _.map(list, function (ele) {
				return card + ele
			});

			var list = helper.existy(determiner) ? list : this.mapSelectors(cards);

			var args = [].concat.call([], speed, [list], [offsets], progressFunc, deferred, callback, args);

			var interval = function() {
				return that.dealCard.apply(that, args)
			};

			return this.intervals(interval, speed, deferred, callback)
		};

		o.deckCard = function(position, altOffset, deferred, args, alwayscb) {
			var scrollTop = $('html body').scrollTop();
			var passedOffset = {'left' : this.game.initialOffset['left'], 'top' : this.game.initialOffset['top'] - 20};
			var offset = helper.existy(altOffset) ? altOffset : this.adjustedOffset('#deck', passedOffset);
			var card = document.elementFromPoint(offset['left'], offset['top'] - scrollTop);
			var altPosition = $(card).position();
			var length = $("#deck>img[id*='card']");
			var alwayscb = alwayscb || function() {};
			var z = $(card).zIndex();
			return helper.extractString($(card).attr('id')) != 'deckCard' ? deferred.reject().fail(alwayscb.apply(this, args)) : $(card).fadeOut({ duration : 250, complete: function() {
				var deck = _.reduce(that.game.shuffledDeck, function (memo, ele, ind) {
					return ind == position ? [].concat.call([], memo, ele) : memo
				}, []).join('');
				var offset = helper.existy(altOffset) ? altPosition : {'left' : +that.game.initialOffset['left'], 'top' : (+that.game.initialOffset['top'] - 20)};
				var src = '/img/Spider/dealer.gif';
				var id = 'deckCard' + (+position + 1 - 8);

				_.extend(that.game, { 'oldHoverCard' : {'index' : position, 'zindex' : z, 'offset' : offset, 'deckcard' : true, 'src' : src, 'id' : id, 'data' : deck}})
				$('#deck>img').eq(position).before(html.buildHTML('img', [{'z-index' : z}, {'left' : offset['left']}, {'top' : offset['top']}], [{'class' : deck}, {'src' : '/img/Spider/' + deck + '.gif'}, {'id' : ('card' + (length.length + 1))}]))
				$(this).remove()
				return deferred.resolve().done(alwayscb.apply(that, args))
			}})
		};

		o.decreaseScore = function() {
			return this.game.score+= -5
		};

		o.dealDeck = function(columns, card, parent, list, speed, deferred, callback) {
			var dimensions = this.game.imageDimensions;
			var position = $(parent).position();
			var left = _.map(list, function (ele) {
				var offset = (ele - 1) % columns * dimensions['width'] - position['left'];
				return {'left' : offset}
			});
			var top = _.map(list, function (ele) {
				var offset = Math.floor((ele - 1) / columns) * 20 + 320;
				return {'top' : offset}
			});
			var offsets = _.map(list, function (ele, index) {
				return that.mergeObjects([left[index], top[index]])
			});
			var list = _.map(list, function (ele) {
				return card + ele
			});
			var mapped = this.mapSelectors(list);
			
			var interval = function() {
				return that.dealCard(speed, mapped, offsets, null, deferred, callback)
			};

			return this.intervals(interval, speed, deferred, callback)
		};

		o.defaulted = function(value) {
			var props = _.rest(arguments, 1);
			if (_.isEmpty(props)) 
				for (prop in that.game) 
					if (that.game.hasOwnProperty(prop))
						props.push(prop)
			return helper.defaultValues.call(this, this.game, value, props)
		};

		o.determination = function(special, index) {
			return $(special).eq(index).offset()
		};

		o.determineHoverElement = function(ele) {
			var ele = this.switchARoo(ele),
				left = ele['left'],
				top = ele['top'],
				d = this.game.imageDimensions,
				list = _.reduce(this.game.offsets, function (memo, e) {
				return (e['left'] + d['width'] - 41 > left) && (e['left'] - 26 < left) && 
				(Math.abs(top - e['top']) >= 0) && (Math.abs(top - e['top'] <= 70)) && !_.isEqual(that.game.initialOffset, e) ?
				[].concat.call([], memo, e) : memo
			}, [])
			return _.isEmpty(list) ? [] : _.first(list)
		};

		o.determineMove = function(prop, move, altMove, args, failcb, successcb) {
			var callbacks = _.rest(arguments, 6);
			var failcb = helper.existy(failcb) ? failcb : (function() {});
			var successcb = helper.existy(successcb) ? successcb : (function() {});
			var args = helper.existy(altMove) ? [].concat.call([], move, altMove, args, callbacks) : [].concat.call([], move, args, callbacks);
			var prop = helper.containsSubString(prop, '.') ? helper.returnSubString(prop, '.') : prop;
			if (helper.existy(altMove)) {
				return _.has(altMove, prop) ? successcb.apply(this, args) : failcb.apply(this, args)
			}
			return _.has(move, prop) ? successcb.apply(this, args) : failcb.apply(this, args) 
		};

		o.determinePosition = function() {
			var item = this.switchARoo(this.game.initialOffset),
				id = $(item).attr('id');
			return _.reduce(this.game.identity, function (memo, ele, index) {
				return _.has(ele, id) ? [].concat.call([], memo, index) : memo
			}, []).join('')
		};

		o.determineStackMove = function(offset, deferred, args, deckcb) {
			var scrollTop = $('html body').scrollTop();
			var item = document.elementFromPoint(offset['left'], offset['top'] - scrollTop)	;	
			var position = $(item).index();
			var id = $(item).attr('id');
			var identity = helper.extractString(id);
			return identity == 'deckCard' ? this.deckCard(position, offset, deferred, args, helper.partial(deckcb)) : deferred.reject().fail(deckcb.apply(this, args))
		};

		o.difficulty = function(level) {
			switch (level) {
				case 'easy' :
				return _.map(_.range(1, 9), function (ele) {
					return 's'
				})
				break
				case 'medium' :
				return _.map(_.range(1, 9), function (ele) {
					return ele % 2 == 0 ? 's' : 'h'
				})
				break
				case 'hard' : 
				var arr = _.map(_.range(2), function (ele) {
					return _.map(['s', 'c', 'h', 'd'], function (elem) {
						return elem
					})
				});
				return helper.flatten(arr)
				break
			}
		};

		o.disableDragging = function(selector) {
			var array = $(selector);
			return _.each(array, function (ele) {
				$(ele).draggable()
				var id = $(ele).attr('id');
				var position = $(ele).position();
				return helper.containsSubString(id, 'any') || position['top'] <= 300 ? $(ele).draggable('disable') : $(ele)
			})
		};

		o.dragging = function(args, failcb, successcb) {
			var ele = this.game.clicked,
				list = this.game.draglist;
			$(ele).draggable({
				drag : function(e, ui) {
					_.each(list, function (ele, ind) {
						$(ele).zIndex(100 + ind)
						$(ele).css({
							left : ui.position.left,
							top : (ui.position.top + (ind * 20))
						})
					})
				}, 

				revert: function() {
					var hoverElement = that.game.hovered;
					var list = _.map(that.game.droppables, function (ele) {
						return ele == that.extractIdentity(hoverElement) ? 'true' : 'false'
					});
					var truthy = _.some(list, function (ele) {
						return ele == 'true'
					});
					if (helper.truthy(truthy)) {
						successcb.call(that, args)
						return false
					} else {
						failcb.call(that, args)
						return true
					}
					// }) ? (successcb.call(that, args), false) : (failcb.call(that, args), true)			
				}
			})	
		};

		o.edgeCase = function(value) {
			switch (value) {
				case 'A' :
				return '2'
				break
				case '10' :
				return 'J'
				break
				case 'J' :
				return 'Q'
				break
				case 'Q' :
				return 'K' 
				break
				case 'K' :
				return 'none'
			}
		}

		o.endGame = function(callback) {
			var value = 'Ks Qs Js 10s 9s 8s 7s 6s 5s 4s 3s 2s As';
			var list = _.reduce(this.game.data, function (memo, ele) {
				return helper.getFirstValue(ele) == value ? [].concat.call([], memo, ele) : memo
			}, []);
			if (list.length == 104) {
				return callback
			}
		};

		o.extractIdentity = function(ele) {
			var id = $(ele).attr('id');
			return _.reduce(this.game.identity, function (memo, ele) {
				return _.has(ele, id) ? helper.getFirstValue(ele) : memo
			}, [])
		};

		o.extractCard = function(identity) {
			var card = identity.split('');
			return helper.containsSubString(identity, 'any') ? 'any' : identity.length > 2 ? _.first(card, 2).join('') : _.first(card)
		};

		o.fadeOut = function(list, deferred, duration, selector, secondSelector, args, callback) {
			if (_.isEmpty(this.game.list))
				_.extend(this.game, {'list' : list})
			var selector = helper.existy(selector) ? $(selector).eq(_.first(this.game.list)) : $(_.first(this.game.list));
			var index = _.first(this.game.list);
			$(selector).fadeOut({duration : duration, complete : function() {
				var z = $(that.switchARoo(that.game.offsets[index])).zIndex();
				var length = $('#deck>img').length;
				var id = $("#deck>img[id*='card']").length;
				if (helper.existy(secondSelector)) {
					// html.buildHTML('img', [{'z-index' : (+z+1)}, {'left' : that.game.offsets[index]['left']}, {'top' : +that.game.offsets[index]['top'] + 20}], [{'class' : that.game.shuffledDeck[length]}, {'src' : '/Img/spider/' + obj.shuffledDeck[length] + '.gif'}, {'id' : ('card' + (id + 1) )}])
					$(secondSelector).append(html.buildHTML('img', [{'z-index' : (+z+1)}, {'left' : that.game.offsets[index]['left']}, {'top' : +that.game.offsets[index]['top'] + 20}], [{'class' : that.game.shuffledDeck[length]}, {'src' : '/img/Spider/' + that.game.shuffledDeck[length] + '.gif'}, {'id' : ('card' + (id + 1) )}]))
				}
				return index == _.last(list) ? deferred.resolve().done(callback.apply(that, args)) : null
			}})
			_.extend(this.game, {'list' : _.rest(this.game.list)})
			if (_.isEmpty(this.game.list)) 
				that.clearIntervals()
		};



		o.fixBaseString = function() {
			var list = this.game.draglist;
			var baseLength = _.first(this.game.draggedEleString).split(' ').length;
			var tempValue = _.last(_.first(this.game.draggedEleString).split(' '), this.game.draglist.length);
			var baseValue = (_.isArray(tempValue) ? tempValue.join(' ') : tempValue);
			var keys = this.buildList(list);
			_.extend(this.game.oldHoverCard, {'oldHoverString' : this.game.draggedEleString})
			return _.each(this.game.data, function (ele, index) {
				return helper.anyKey(keys, ele) ? that.game.data[index] = helper.createObject(helper.whichKey(keys, ele), baseValue) : ele
			})
		};

		o.fixCss = function(list, altHovered) {
			var deferred = new $.Deferred();
			var draglist = list || this.game.draglist;
			var acceptedDraggable = altHovered || $(this.game.hovered).position();
			var base = $(this.game.hovered).zIndex();
			_.each(draglist, function (ele, ind) {
				$(ele).css({
					left : acceptedDraggable['left'],
					top : +acceptedDraggable['top'] + (20 * (ind + 1) )
				})
			})
			_.each(draglist, function (ele, ind) {
				$(ele).zIndex(base + ind + 1)
			})
		};

		o.fixOldData = function(list) {
			var baseLength = helper.stringLength(this.game.draggedEleString);
			var tempValue = _.first(_.first(this.game.draggedEleString).split(' '), (baseLength - this.game.draglist.length));
			var baseValue = (_.isArray(tempValue) ? tempValue.join(' ') : tempValue);
			var keyList = _.map(list, helper.getFirstKey);
			var keys = this.sortIds(keyList);
			var selectors = _.map(this.mapSelectors(keys), this.switchARoo);
			var elements = helper.createObject('oldHoverElements', keys);
			_.extend(this.game, {'oldHoverCard' : elements})
			return _.each(this.game.data, function (ele, index) {
				return helper.anyKey(keys, ele) ? that.game.data[index] = helper.createObject(helper.whichKey(keys, ele), baseValue) : ele
			})
		}

		o.fixError = function(list) {
			if (list.length == this.game.draglist.length) {
				return
			}
			var list = this.idList(list)
			var dragIds = this.idList(this.game.draglist)
			var filteredList = _.reduce(list, function (memo, ele) {
				return _.contains(dragIds, ele) ? memo : [].concat.call([], memo, ele)
			}, [])
			var elements = this.mapSelectors(filteredList)
			var recursiveFix = function(elems, domEles) {
				if (_.isEmpty(elems)) {
					return
				}
				else {
					var moves = that.game.movelist
					var list = [_.first(elems)]
					var domEle = _.first(domEles)
					var matches = _.reduce(moves, function (memo, ele, index) {
						var hovered;
						var eles = ele['draggedElements']
						var els = ele['hoverElements']					
						// var hover = ele['hoverElements']
						var dragged = _.reduce(eles, function (mem, elem, ind) {
							// return _.contains(list, elem) ? [].concat.call([], mem, elem) : _.contains(list, hover[ind]) ? [].concat.call([], mem, hover[ind]) : mem
							return _.contains(list, elem) ? [].concat.call([], mem, elem)  : mem
						}, [])
						if (!_.isEmpty(els)) {
							hovered = _.reduce(els, function (mem, elem, ind) {
								return _.contains(list, elem) ? [].concat.call([], mem, elem) : mem
							}, [])
						}
						return _.isEmpty(dragged) && _.isEmpty(hovered) ? memo : [].concat.call([], memo, ele)
					}, [])
					// var matches = _.reduce(moves, function (memo, ele, index) {
					// 	var eles = ele['draggedElements']
					// 	// var hover = ele['hoverElements']
					// 	var potential = _.reduce(eles, function (mem, elem, ind) {
					// 		// return _.contains(list, elem) ? [].concat.call([], mem, elem) : _.contains(list, hover[ind]) ? [].concat.call([], mem, hover[ind]) : mem
					// 		return _.contains(list, elem) ? [].concat.call([], mem, elem)  : mem
					// 	}, [])
					// 	return _.isEmpty(potential) ? memo : [].concat.call([], memo, ele)
					// }, [])

					console.log(matches)
					if (_.has(_.last(matches), 'completedStack')) {
						// var location = that.lastStack(that.game.stackSelectors)
						var location = _.last(matches).completedStack.location
						
						var position = that.parentOffsets(helper.returnSubString(location, '<', true), '#deck', 1)
						var index = _.map(_.last(matches)['completedStack']['elements'], function (ele, index) {
							return ele == _.first(elems) ? index : ''
						}).join('')
						var index = +index
						var hoverCard = _.first(_.last(matches)['completedStack']['elements'])
						var z = $('#' + hoverCard).zIndex()
						var z = +z
						console.log(location)
						console.log(z)
						console.log(index)
						console.log(domEle)
						console.log(z + index + 1)
						$(domEle).zIndex(z + index + 1)
						$(domEle).css({
							left : _.first(position)['left'],
							top : _.first(position)['top']
						})
						return recursiveFix(_.rest(elems), _.rest(domEles))
					} else if (_.isEmpty(matches)) {
						var ind = _.reduce($('#deck>img'), function (memo, ele, index) {
							return $(ele).attr('id') == _.first(elems) ? [].concat.call([], memo, index) : memo
						}, []).join('')
						console.log(ind)
						var offset = _.reduce(that.game.fullOffsetList, function (memo, ele, index) {
							return index == ind ? [].concat.call([], memo, ele) : memo
						}, [])
						console.log(offset)
						var adjustedOffset = that.adjustedOffset('#deck', _.first(offset))
						console.log(adjustedOffset)
						var hoverElement = document.elementFromPoint(adjustedOffset['left'], +adjustedOffset['top'] - 20)
						console.log(hoverElement)
						var z = +$(hoverElement).zIndex()
						console.log(z)
						$(domEle).css({
							left : _.first(offset)['left'],
							top : _.first(offset)['top']
						})
						$(domEle).zIndex(z + 1)
					}
					else {
						console.log(domEle)
						console.log(_.last(_.last(matches)))
						// var hoverElement = !_isEmpty(matches) && _.isEmpty(_.last(_.last(matches)['hoverElements'])) ? _.last(_.last(matches)['hiddenElement']) : _.last(_.last(matches)['hoverElements'])
						var hoverElement = _.isEmpty(_.last(_.last(matches)['hoverElements'])) ? _.last(_.last(matches)['hiddenElement']) : _.last(_.last(matches)['hoverElements'])
						console.log(hoverElement)
						var z = $('#' + hoverElement).zIndex()
						var z = +z
						var hoverPosition = $('#' + hoverElement).position()
						var index = _.map(_.last(matches)['draggedElements'], function (ele, index) {
							return ele == _.first(elems) ? index : ''
						}).join('')
						if (_.isEmpty(index)) {
						index = _.map(_.last(matches)['hoverElements'], function (ele, index) {
							return ele == _.first(elems) ? index : ''
						}).join('')
						}
						var index = +index
						$(domEle).zIndex(z + index + 1)
						$(domEle).css({
							left : hoverPosition['left'],
							top : +hoverPosition['top'] + (20 * (index+1)) 
						})
						return recursiveFix(_.rest(elems), _.rest(domEles))
					}
				}

			}
			return recursiveFix(filteredList, elements)
		}

		o.fullOffsetList = function() {
			var keys = _.map(this.game.identity, helper.getFirstKey);
			var list = _.map(keys, function (ele) {
				return $('#' + ele).position()
			});
			return _.extend(this.game, {'fullOffsetList' : list})
		};

		o.generateBoard = function(rows, columns) {
			return html.generateBoard(this, rows, columns)
		};

		o.hiddenElements = function() {
			var elements = this.totalDeck();
			var list = _.map(_.range(8), function (ele, index) {
				return elements[index]
			});
			return this.defaulted(list, 'hiddenElements')

		};
		o.idList = function(array) {
			return _.map(array, function (ele) {
				return $(ele).attr('id')
			})
		};

		o.increaseScore = function() {
			return this.game.score += 20
		}

		o.initialCondition = function(element, newgame, loadgame, alwayscb) {
			return $(element).attr('id') == 'new-game' ? ($('#initial>button').css('display', 'none'), $('#difficulty>button').css('display', 'inline'), $('#cheating>button').css('display', 'none')) : 
			$(element).attr('id') == 'load-game' ? ($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), loadgame(), alwayscb()) : 
			($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), newgame($(element).attr('id')), alwayscb())
		}

		o.insertDeckCard = function(determiner, selector, range, defaultOffset, parent, args, callback) {
			if (_.isEmpty(this.game.list)) 
				_.extend(this.game, {'list' : range})
			var baseSelector = $(selector).eq(0);
			var zIndex = baseSelector.length == 0 ? 2 : baseSelector.zIndex();
			var offset = baseSelector.length == 0 ? defaultOffset : baseSelector.position();
			var src = '/img/Spider/dealer.gif';
			var id = baseSelector.length == 0 ? 'deckCard96' : ('deckCard' + (+helper.extractNumber(baseSelector.attr('id')) - 1));
			var htmlString = html.buildHTML('img', [{'z-index' : zIndex}, {'left' : offset['left']}, {'top' : offset['top']}], [{'src' : src}, {'id' : id}]);
			var alternateString = html.buildHTML('img', null , [{'src' : src}, {'id' : id}]);
			baseSelector.length == 0 ? parent.append(htmlString) : helper.existy(determiner) ? baseSelector.before(alternateString) : baseSelector.before(htmlString)
			_.extend(this.game, {'list' : _.rest(this.game.list)})
			
			if (_.isEmpty(this.game.list)) {
				this.clearIntervals()
				return callback.apply(this, args)
			} 
		};

		o.intervals = function(func, speed, deferred, args, callback) {
			var intervals = this.game.intervals;
			return _.extend(this.game, {'intervals' : intervals.concat.apply([],[intervals, window.setInterval(func, speed, deferred, callback, args)] )})
		};

		o.isResolved = function() {
			var array = this.game.deferreds;
			return _.map(array, function (ele) {
				return ele[1] + ' is ' + ele[0].state()
			})
		};

		o.keyDownAdd = function(key) {
			var newKey = [].concat.call([], this.game.keys, key);
			return _.extend(this.game, {'keys' : newKey})
		};

		o.keyDownEvent = function(prop, deferred, successcb, failcb) {
			var move = _.last(this.game.movelist);
			var options = _.rest(arguments, 4);
			// var deckCard = _.pick(move.oldHoverCard, 'deckcard')
			// var row = _.pick(move, 'row')
			var row = _.pick(move, prop);
			var args = [].concat.call([], move, options);
			// return _.isEmpty(deckCard) && _.isEmpty(row) ? deferred.resolve(move).done(successcb) : deferred.reject(move).fail(failcb)
			return _.isEmpty(row) ? deferred.resolve().done(successcb.apply(this, args)) : deferred.reject().fail(failcb.apply(this, args))
			return _.isEmpty(row) ? deferred.resolve(move).done(successcb.apply(this, args)) : deferred.reject(move).fail(failcb.apply(this, args))
		};

		o.lastStack = function(list) {
			var stack = _.reduce(this.game.stackSelectors, function (memo, ele) {
				return $(ele).length == 2 ? [].concat.call([], memo, ele) : memo
			}, []);
			return _.last(stack)
		};

		o.mapSelectors = function(array) {
			return _.map(array, function (ele) {
				return $('#' + ele)
			})
		};

		o.mergeObjects = function(objects, obj) {
			var obj = obj || {};
			_.each(objects, function (ele, index) {
				var value = helper.getFirstValue(ele)
				for (prop in ele) {
					if (ele.hasOwnProperty(prop))
						obj[prop] = value
				}
			})
			return obj
		};

		o.moveCard = function(selector, list, deferred, callback, args) {
			if (_.isEmpty(this.game.list)) 
				this.defaulted(list, 'list')
			var offset = $(selector).offset();
			$(_.first(list)).animate({
				left : offset['left'],
				top : offset['top']
			}, {duration : 100})
			this.defaulted(_.rest(this.game.list), 'list')
			return _.isEmpty(this.game.list) ? that.clearIntervals(deferred, callback, null, args) : list
		};

		o.objectList = function(list, determiner) { // expects a list of offsets
			if (!_.isArray(list)) 
				list = _.toArray(arguments)
			if (determiner) {
				list = (_.first(list, list.length - this.game.draglist.length))
			}
			var idList = _.map(list, function (ele) {
				return $(that.switchARoo(ele)).attr('id')
			});
			var dataList = _.map(idList, function (ele) {
				return _.reduce(that.game.data, function (memo, elem) {
					return helper.getFirstKey(elem) == ele? [].concat.call([], memo, elem) : memo
				}, [])
			});
			var objectList = helper.flatten(dataList);
			var hoverElements = _.reduce(objectList, function (memo, ele, ind, arr) {
				return _.isEqual(_.values(ele), _.values(_.last(arr))) ? [].concat.call([], memo, ele) : memo
			}, []);
			return _.last( hoverElements, _.values(_.last(hoverElements)).join('').split(' ').length) // returns the last n elements based on the length of the length of the data value
		}

		o.offsetCheck = function(args, successcb, failcb) {
			var args = [].concat.call([], [this.game.fullOffsetList], successcb, failcb, args);
			return helper.arrayCheck.apply(this, args)
			return helper.arrayCheck(this.game.fullOffsetList, successcb, failcb)
		};

		o.parentOffsets = function(parent1, parent2, range) {
			var par1Offset = $(parent1).offset();
			var par2Offset = $(parent2).offset();
			return _.map(_.range(range), function (ele) {
				var left = par1Offset['left'] - par2Offset['left'];
				var top = par1Offset['top'] - par2Offset['top'];
				return {'left' : left, 'top' : top}
			})
		};

		o.populateBoard = function(obj) {
			$('#deck').html(obj.game.deckHTML)
			$('#bottomDeck').html(obj.game.cardStackHTML)
			$('#finishedStacks').html(obj.game.completedStack)
			$('.count').html(obj.game.movecount)
			$('.score').html(obj.game.score)
			sessionStorage.setItem('difficulty', obj.game.difficulty)
			for (prop in obj.game) {
				if (obj.game.hasOwnProperty(prop)) 
					that.game[prop] = obj.game[prop]
			}
			return that.game
		};

		o.pseudoValues = function(list, ele, prevRow, index) {
			var previousRowKeys = this.buildList(this.game.previousRow);
			var currentRowKeys = this.buildList(this.game.currentRow);
			var list = (helper.existy(list) ? list.droppables : list);
			var previousRowArray = _.map(previousRowKeys, function (elem) {
				return _.reduce(that.game.data, function (memo, ele) {
					return helper.getFirstKey(ele) == elem ? [].concat.call([], memo, ele) : memo
				}, [])
			});
			var currentRowArray = _.map(currentRowKeys, function (elem) {
				return _.reduce(that.game.data, function (memo, ele) {
					return helper.getFirstKey(ele) == elem ? [].concat.call([], memo, ele) : memo
				}, [])
			});
			var previousRowData = helper.flatten(previousRowArray);
			var currentRowData = helper.flatten(currentRowArray);
			var previousRowMatches = this.valueByIndex(list, previousRowData, index);
			
			if (!_.isEmpty(previousRowMatches)) {
				// console.log(previousRowMatches)
			}
			if (_.isEmpty(previousRowMatches)) {
				return _.extend(this.game, {'pseudoDragged' : [], 'pseudoHovered' : [], 'fullBaseValue' : []})
			}
			return _.reduce(previousRowMatches, function (memo, ele, index) {
				var currentRowObject = currentRowData[ele];
				if (_.isObject(ele) && helper.stringLength(helper.getFirstValue(ele)) > 1) {
					var offsets = that.calculateLeft(that.switchARoo('#' + helper.getFirstKey(ele)));
					var list = that.recursiveGrouping(offsets, []);	
					var eles = _.map(_.last(list), that.switchARoo);	
					var ids = that.idList(eles);
					var data = _.map(ids, function (elem) {
						return _.reduce(that.game.data, function (memo, ele) {
							return helper.getFirstKey(ele) == elem ? [].concat.call([], memo, ele) : memo
						}, [])				
					});
					var array = helper.flatten(data);
					return _.extend(memo, {'pseudoHovered' : array})
				} else if (_.isObject(ele)) {
					return _.extend(memo, {'pseudoHovered' : ele})
				} else {
					return _.extend(memo, {'pseudoDragged' : currentRowObject})
				}
			}, this.game)
		};

		o.ranger = function(selector, determiner, range) {
			var div = $(selector).length;
			return determiner == 'last' ? _.range( (div - range), div ) : _.range(range)
		};

		o.rebuildDeckCard = function(callback, args) {
			var move = _.last(this.game.movelist);
			var card = !_.isEmpty(this.game.oldHoverCard) ? this.game.oldHoverCard : move.completedStack && !_.isEmpty(move.completedStack.oldHoverCard) ? move.completedStack.oldHoverCard : move.oldHoverCard;
			var htmlString = html.buildHTML('img', [{'z-index' : card.zindex}, {'left' : card.offset.left}, {'top' : card.offset.top}], [{'src' : card.src}, {'id' : card.id}]);
			var adjustedCard = this.adjustedOffset('#deck', card.offset);
			var scrollTop = $('html body').scrollTop();
			var removedCard = document.elementFromPoint(adjustedCard['left'], adjustedCard['top'] - scrollTop);
			return $(removedCard).fadeOut({ duration: 250, complete: function() {
				$('#deck>img').eq(card.index).before(htmlString)
				if (helper.existy(move.completedStack) && !_.isEmpty(move.completedStack.oldHoverCard)) {
					var arr = helper.nestedProperties('move.completedStack.oldHoverCard');
					var props = _.rest(arr);
					var value = helper.nestedValue(move, props, undefined);
				}
				$(this).remove()	
				return callback.apply(this, args)
			}})

		}

		o.recursiveGrouping = function(offsets, list) {
			if (_.isEmpty(offsets))
				return list
			else {
				var off = _.first(offsets);
				var last = _.last(offsets);
				var modified = {'left' : last['left'], 'top' : +last['top'] + 96};
				var modded = this.adjustedOffset('#deck', modified);
				if (+modded['top'] - $('html body').scrollTop() > $(window).height()) {
					var scrolled = $('html body').scrollTop();
					var adjusted = +modded['top'] - $('html body').scrollTop() - $(window).height();
					$('html body').scrollTop(scrolled + adjusted)

				}
				var item = $(this.switchARoo(off)).attr('id');
				var data = _.reduce(this.game.data, function (memo, ele) {
					return helper.getFirstKey(ele) == item ? [].concat.call([], memo, ele) : memo
				}, []);
				if (_.isEmpty(data)) {
					return false
				}
				var datalength = helper.stringLength(_.first(_.values(_.first(data))));
				var elements = _.first(offsets, datalength);
				var remainingElements = (offsets.length - datalength == 0 ? [] : _.last(offsets, (offsets.length - datalength)));
				return this.recursiveGrouping(remainingElements, [].concat.call([], list, [elements]))
			}
		}

		o.removeElements = function(list, selector) { // give a range of elements for list and a jquery element for selector
			return _.map(list.reverse(), function (ele) {
				return $(selector).eq(ele).remove()
			})
		};

		o.removeMove = function() {
			var length = this.game.movelist.length;
			var moves = _.first(this.game.movelist, (length - 1));
			return _.extend(this.game, {'movelist' : moves} )
		};

		o.revertEvent = function(list, ele, deferred, cb, args) {
			var base = $(ele).position();
			var offset = (_.isEmpty(this.game.initialOffset) ? _.first(_.last(this.game.movelist).draggedEleOffsets) : this.game.initialOffset);
			_.map(list, function (element, ind) {
				$(element).css({
					left : base['left'],
					top : +base['top'] + (ind * 20)
				})
			})
			return _.isEqual(base, offset) && helper.existy(deferred) ? deferred.resolve().done(cb.apply(that, args)) : this
		};

		o.revertZIndex = function(prop, list, altOffset) {
			var list = list || this.game[prop];
			var offset = altOffset ? this.adjustedOffset('#deck', altOffset) : this.adjustedOffset('#deck', this.game.initialOffset);
			var scrollTop = $('html body').scrollTop();
			var base = $(document.elementFromPoint(offset['left'], offset['top'] - scrollTop - 20)).zIndex();
			return _.map(list, function (ele, ind){
				return $(ele).zIndex(base + ind + 1)
			})
		};

		o.saveHTML = function() {
			var deck = this.captureInnerHTML($('#deck>img'));
			var cardStack = this.captureInnerHTML($('#bottomDeck>img'));
			var completedStack = this.captureInnerHTML($('#finishedStacks>div'));
			return _.extend(this.game, {'deckHTML' : deck, 'cardStackHTML' : cardStack, 'completedStack' : completedStack})
		};

		o.selectElements = function(selector, range, determiner) {
			var range = this.ranger(selector, determiner, range);
			return _.map(range, function (ele) {
				return $(selector).eq(ele)
			})
		};

		o.separatedList = function(compareTo) {
			var args = _.toArray(arguments);
			if (args.length == 1) 
				return true
			return that.recursiveGrouping(compareTo, [])
		};

		o.setData = function(identity, args, cb ) {
			_.extend(this.game, {'identity' : []})
			var deck = this.totalDeck();
			var arr = _.map(deck, function(ele, ind) {
				var object = helper.createObject($(ele).attr('id'), that.game.shuffledDeck[ind]);
				return identity ? that.updateIdentity(object) : 
				_.extend(that.game, {'data' : [].concat.call([], that.game.data, object)}) 
			});
			return cb ? cb.apply(that, args) : arr
		};

		o.setElements = function(hovered, clicked) {
			var element,
				scrollTop = $('html body').scrollTop(),
				clickedOffset = this.adjustedOffset('#deck', clicked),
				hoveredOffset = this.adjustedOffset('#deck', hovered),
				clicked = document.elementFromPoint(clickedOffset['left'], clickedOffset['top'] - scrollTop),
				dealer = $('#deck').offset()
			_.isEmpty(hovered) ? element = document.elementFromPoint(dealer['left'], dealer['top'] - scrollTop) : 
								 element = document.elementFromPoint(hoveredOffset['left'], hoveredOffset['top'] - scrollTop)
			if (element.nodeName == 'DIV') {
				element = this.switchARoo(hovered)
			}
			return _.extend(this.game, {'clicked' : clicked, 'hovered' : element})
		};

		o.shuffleDeck = function() {
			var array = helper.randomizer(this.game.shuffledDeck);
			var extra = ['any', 'any', 'any', 'any', 'any', 'any', 'any', 'any'];
			return _.extend(this.game, {'shuffledDeck' : [].concat.call([], extra, array)})
		};

		o.sortIds = function(array) {
			return array.sort(function (a, b) {
				var firstOffset = $('#' + a).offset();
				var secondOffset = $('#' + b).offset();
				return firstOffset['top'] - secondOffset['top']
			})
		};

		o.sortOffsets = function(array) {
			return array.sort(function (a, b) {
				return a['top'] - b['top']
			})
		}

		o.stackLocation = function() {
			var locations = ['#stack1>img', '#stack2>img', '#stack3>img', '#stack4>img', '#stack5>img', '#stack6>img', '#stack7>img', '#stack8>img']
			var stack = _.reduce(locations, function (memo, ele) {
				return $(ele).length == 1 ? [].concat.call([], memo, ele) : memo
			}, [])
			return _.first(stack)
		}



		o.switchARoo = function(item) { // returns offset if given a jquery element else it returns a DOM element
			var offset;
			var element;
			var ele;
			var scrollTop = $('html body').scrollTop();
			if (_.has(item, 'left')) {
				offset = that.adjustedOffset('#deck', item)
				ele = document.elementFromPoint(offset['left'], offset['top'] - scrollTop)
					if (ele && ele.nodeName == 'DIV') {
					var element = _.reduce(that.game.hiddenElements, function (memo, ele) {
						return _.isEqual(that.adjustedOffset('#deck', ele), offset) ? [].concat.call([], memo, ele) : memo
					}, []);
					ele = _.first(element)
				}				
			}
		
			
			return _.has(item, 'left') ? ele : $(item).position()
		};

		o.totalDeck = function() {
			var deck = _.map($('#deck>img'), function (ele) {
				return $(ele)
			});
			var hiddenDeck = _.map($('#bottomDeck>img'), function (ele) {
				return $(ele)
			});
			return [].concat.call([], deck, hiddenDeck)
		};

		o.unacceptableDraggable = function(ele, deferred, cb, args) {
			return this.revertEvent(this.game.draglist, ele, deferred, cb, args)
		};

		o.updateIdentity = function(value) { // use to update the identities in object when a deckcard is revealed
			return _.extend(this.game, {'identity' : [].concat.call([], this.game.identity, value)})
		};

		o.updateData = function(deferred, move, args, failcb, successcb) {
			var draglist = (_.has(this.game, 'draglist') ? this.game.draglist : [this.game.clicked]);
			if (_.toArray(arguments).length == 1) {
				return this.updateElementData(this.game.elementlist, this.game.fullBaseValue, this.game)
			}
			else if (helper.existy(move)) {
				var move = _.last(this.game.movelist);
				var hover = move.oldHoverCard && move.oldHoverCard.oldHoverElements ? move.oldHoverCard : null;
				return _.has(move, 'row') ? (this.updateElementData(move.matchedDragged, move.draggedData, this.game),
											this.updateElementData(move.matchedHovered, move.hoveredData, this.game)) :
					   move.oldHoverCard && move.oldHoverCard.oldHoverElements ? 
					   						(this.updateElementData([].concat.call([], hover.oldHoverElements, move.draggedElements), hover.oldHoverString, this.game),
					   						this.updateElementData(move.hoverElements, move.hoverString, this.game)) :
											(this.updateElementData(move.draggedElements, move.draggedEleString, this.game),
											this.updateElementData(move.hoverElements, move.hoverString, this.game))
			}
			else if (_.first(this.game.draggedEleString).split(' ').length > draglist.length) {
				return deferred.reject().fail(failcb.apply(this, args)).then(successcb.apply(this, args))
			} else {
				return (this.updateElementData(this.game.elementlist, this.game.fullBaseValue, this.game), deferred.resolve().done(successcb.apply(this, args)))
			}
		};

		o.updateElementData = function(list, value, obj) {
			if ( value == undefined) {
				value = []
			}
			if (_.isObject(_.first(value))) {
				value = _.map(value, helper.getFirstValue)
			} else if (typeof value == 'string' || value.length < list.length) {
				var array = _.isArray(value) ? value.join(' ').split(' ') : value.split(' ');
				value = _.map(_.range(array.length), function (ele) {
					return value
				})
			} else {
				value = value
			}
			value = helper.flatten(value)
			return _.map(obj.data, function (ele, index) {
				return helper.anyKey(list, ele) ? obj.data[index] = helper.createObject(helper.whichKey(list, ele), helper.whichValue(value, list, ele)) : ele
			})
		};

		o.updateDataKeys = function() {
			var data = helper.updateDataSet(this.game.identity, this.game.data);
			return _.extend(this.game, {'data' : data})
		};

		o.updateMoveCount = function() {
			return this.game.movecount+=1
		};

		o.updateSingleOffset = function(object) {
			var id = $(object).attr('id');
			var offset = this.switchARoo(object);
			return _.map(this.game.identity, function (ele, index) {
				return helper.getFirstKey(ele) == id ? that.game.fullOffsetList[index] = offset : ele
			})
		};

		o.validDroppable = function(value) {
			return (!isNaN(value) && +value != 10) ? (+value + 1).toString() : this.edgeCase(value)
		};

		o.valueByIndex = function(value, array, ind) {
			return _.reduce(array, function (memo, ele, index) {
				var val = helper.stringLength(helper.getFirstValue(ele)) > 1 ? _.last(helper.getFirstValue(ele).split(' ')) : helper.getFirstValue(ele);
				return ((index == ind) && (_.contains(value,val))) ? [].concat.call([], memo, ele, index) : memo
			}, [])
		};

		var addToProto = function(obj, baseObj) {
			for (prop in baseObj)
				obj.prototype[prop] = baseObj[prop]
		};

		addToProto(Spider,o);
	}
})
