/*
 * @module BinaryLookup
 * Двоичный поиск (indexOf)
 */

(function (global) {
	"use strict";
	var binaryLookup, foundIndex;

	/*
   * Функция которая осуществляет поиск
   */
	binaryLookup = function (param) {
		var middle, first = 0,
		/*
     * Отсортированный по алфавиту(например) вектор строковых значений
     */
		lookupArray = ["cat", "dog", "dog", "blob", "coc"].sort(),
		n = lookupArray.length,
		last = n - 1;

		if (!n) {
			/*
       * массив пуст
       */
			return;
		} else if (lookupArray[0] > param) {
			/*
       * не найдено.
       * если надо добавить то в позицию 0
       */
			return;
		} else if (lookupArray[n - 1] < param) {
			/*
       * не найдено.
       * если надо добавить то в позицию n
       */
			return;
		}

		while (first < last) {
			middle = Math.floor((first + last) / 2);

			if (param <= lookupArray[middle]) {
				last = middle;
			} else {
				first = middle + 1;
			}
		}

		if (lookupArray[last] === param) {
			/*
       * искомый элемент найден
       * last - искомый индекс
       */
			return last;
		} else {
			/*
       * искомый элемент не найден
       */
			return;
		}
	};

	foundIndex = binaryLookup("dog");

} (this));
