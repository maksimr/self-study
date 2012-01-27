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
		var cache = factorial.cache[number],
		factorialScope;
		if (cache) {
			callback(cache);
			return 0;
		}
		/*
     * create own scope for each call
     */
		factorialScope = function () {
			number = number || 1;

			factorialScope.id = setTimeout(hitch(factorialScope, function _f(count, number) {
				var self = this,
				result = self.tick(count, number);

				if (result !== count) {
					self.id = setTimeout(hitch(self, _f, result, number - 1));
				} else {
					self.callback(result);
				}
			},
			number, number), 10);
		};

		factorialScope.tick = factorial.tick;
		factorialScope.callback = function (result) {
			/*
       * memoization
       */
			factorial.cache[number] = result;
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
 * reusable function
 */
	factorial.tick = function (count, number) {
		var n = number && number - 1;
		return n ? count * n: count;
	};
	factorial.cache = {};

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
