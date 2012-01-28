/*
 * @module Circle.js
 * @description define box2d circle objcet
 */

(function (global) {
	define(['dojo','./Box2dWeb-2.1.a.3.min'],function () {
		/*
     * GLOBAL CONSTANTS
     */
		var SCALE = 30,
    d = dojo;
		/*
     * Import Box2D classes
     */
		var Box2D = global.Box2D,
		B2BodyDef = Box2D.Dynamics.b2BodyDef,
		B2Body = Box2D.Dynamics.b2Body,
		B2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		B2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		/*
     * shortcut
     */
		var staticBody = B2Body.b2_staticBody,
		dynamicBody = B2Body.b2_dynamicBody;
		/*
     * define helper object B2BodyDef and B2FixtureDef
     * and default propertyes
     */
		var fixDef = new B2FixtureDef();
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;

		var bodyDef = new B2BodyDef();

    /*
     * default circle configuration object
     */
		var circleDefaultConf = {
      radius: 0,
      SCALE: SCALE,
			position: {
				x: 0,
				y: 0,
			}
		};

		/*
     * class Circle
     * @param {Object B2World} world object of Box2D
     * @param {Object} configuration object
     * @return B2World body object
     */
		var Circle = function (world, circleConf) {
      circleConf = d.mixin({},circleDefaultConf,circleConf);

			bodyDef.type = circleConf.isStatic ? staticBody: dynamicBody;
			fixDef.shape = new B2CircleShape(circleConf.radius / SCALE);

			bodyDef.position.x = circleConf.position.x / SCALE;
			bodyDef.position.y = circleConf.position.y / SCALE;

      if (d.isObject(circleConf.fixDef)) {
        d.mixin(fixDef,circleConf.fixDef);
      }
      if (d.isObject(circleConf.bodyDef)){
        d.mixin(bodyDef,circleConf.bodyDef);
      }

			return world.CreateBody(bodyDef).CreateFixture(fixDef);
		};

		return Circle;
	});
} (this));
