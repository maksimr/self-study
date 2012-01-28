/*
* @module factorial
* @description create asynchronous function which calculates the factorial
* @author maksimr
*/
(function (global) {
	/*
   * hitch with currying
   */
	var hitch = function (scope, func) {
		var fn = (typeof func === 'function') ? func: (scope || global)[func],
		ap = Array.prototype,
		args = ap.slice.call(arguments, 2);
		return function () {
			args = args.concat(ap.slice.call(arguments, 0));
			fn.apply(scope, args);
		};
	};

	/*
 * Asynchronous factorial
 */
	var factorial = function (number, callback) {
		var cache = factorial.cache,
		cacheKey = cache._prefix + number,
		factorialScope;
		if (cache[cacheKey]) {
			callback(cache[cacheKey]);
			return 0;
		}

		number = number || 1;
		/*
     * create own scope for each call
     */
		factorialScope = function () {
			factorialScope.id = setTimeout(hitch(factorialScope, function _f(count, number) {
				var self = this,
				result = count * number;

				if (result) {
					self.id = setTimeout(hitch(self, _f, result, number - 1));
				} else {
					self.callback(count);
				}
			},
			number, number - 1), 10);
		};

		factorialScope.callback = function (result) {
			/*
       * memoization
       */
			cache[cacheKey] = result;
			callback.apply(global, arguments);
		};
		/*
     * function that stop executions
     */
		factorialScope.stop = function () {
			var id = factorialScope.id;
			return id && clearTimeout(id);
		};

		factorialScope();
		/*
     * return factorial scope object
     */
		return factorialScope;
	};

	/*
   * factorial cache
   */
	factorial.cache = {
		_prefix: '!'
	};

	/*
 * TESTS
 */
	var shouldBeEqual = function (expected, is) {
		var pass = (expected === is);
		if (pass) {
			console.log('Test pass!!!');
		} else {
			throw ('expected: ' + expected + ', but get: ' + is + '!!!');
		}
	};

	factorial(4, hitch(global, shouldBeEqual, 24));
	factorial(3, hitch(global, shouldBeEqual, 6));
	factorial(1, hitch(global, shouldBeEqual, 1));
	factorial(0, hitch(global, shouldBeEqual, 1));

	/*
   * import factorial
   */
	global.factorial = factorial;
} (this));

/*
 * Examples
 */
var longExecutions = factorial(10000, console.log);

factorial(3, console.log); // 6
factorial(0, console.log); // 1
factorial(10000, console.log); // ??? Infinity
longExecutions.stop(); // stop long executions
factorial(100000000000000, console.log); // very long but not blocked script
