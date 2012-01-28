/*
 * @module canvas
 * @description animate scene
 */

(function (global) {
	define(function (require, exports) {
		"use strict";

		var jcotton = global.jcotton,
		group = jcotton.group(),
		/*
   * carma define count of spheres that create by click of user
   */
		carma = 1,

		scene = jcotton.canvas("scene"),
		circle,
		rect,
		Sphere;
		/*
     * create circle
     */
		circle = jcotton.circle(0, 0, 50);
		circle.position(100, 100);
		circle.fillColor(120, 186, 255);
		circle.opacity(0.5);

		circle.beginLoop().animate({
			scale: 1
		},
		500).animate({
			scale: 0.5
		},
		800).animate({
			scale: 0.2,
			opacity: 0.5
		},
		900).endLoop();
		/*
   * create rectangular
   */
		rect = jcotton.rect(0, 0, 50, 50);

		rect.origin(25, 25);
		rect.position(100, 100);
		rect.fillColor(253, 245, 217);
		rect.opacity(0.5);
		/*
   * rectangular events
   */
		rect.beginLoop().animate({
			scale: 1,
			'+rotation': 180
		},
		500).animate({
			scale: 1.4,
			'+rotation': 180
		},
		800).animate({
			scale: 2,
			opacity: 0.5,
			'+rotation': 180
		},
		900).endLoop();

		/*
     * function that creat spheres
     */
		Sphere = function (x, y) {
			var M = Math,
			sphere, sign = (M.random().toFixed()) * 2 - 1;
			x = x || 0;
			y = y || 0;

			sphere = jcotton.circle(0, 0, 5).position(x, y).fillColor(M.ceil(M.random() * 256), M.ceil(M.random() * 256), M.ceil(M.random() * 256));

			/*
       * sphere animation
       */
			sphere.beginLoop().animate({
				scale: 1,
				xposition: M.random() * 150,
				yposition: M.random() * 150
			},
			700).animate({
				scale: M.random()*2.5,
				xposition: M.random() * 150,
				yposition: M.random() * 150
			},
			700).endLoop();

			return sphere;
		};

		group.onMouseDown(function (x, y) {
			/*
       * crete sphere
       */
			var sphere;

			sphere = new Sphere(x, y);
			carma++;
			scene.add(sphere);
		});
		/*
   * end rectangular
   */

		/*
   * add shapes on canvas
   */
		scene.add(group.add(rect).add(circle).add(new Sphere()).add(new Sphere()).add(new Sphere()));
	});
} (this));
