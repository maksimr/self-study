/*
 * @module Polygon.js
 * @description define polygon object of Box2d
 */

(function (global) {
	define(['dojo','./Box2dWeb-2.1.a.3.min'],function () {
    var d = dojo,
		SCALE = 30;

		/*
     * Import Box2D classes
     */
		var Box2D = global.Box2D,
		B2BodyDef = Box2D.Dynamics.b2BodyDef,
		B2Body = Box2D.Dynamics.b2Body,
		B2FixtureDef = Box2D.Dynamics.b2FixtureDef,

		B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

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
		var polygonDefaultConf = {
      width: 0,
      height: 0,
      SCALE: SCALE,
			position: {
				x: 0,
				y: 0,
			}
		};

		/*
     * class Polygon
     * @param {Object B2World} world object of Box2D
     * @param {Object} configuration object
     * @return B2World polygon body object
     */
		var Polygon = function (world, polygonConf) {
      polygonConf = d.mixin({},polygonDefaultConf,polygonConf);

			bodyDef.type = polygonConf.isStatic ? staticBody: dynamicBody;

			fixDef.shape = new B2PolygonShape();
      fixDef.shape.SetAsBox((polygonConf.width / SCALE) / 2, (polygonConf.height / SCALE) / 2);

			bodyDef.position.x = polygonConf.position.x / SCALE;
			bodyDef.position.y = polygonConf.position.y / SCALE;

      if (d.isObject(polygonConf.fixDef)) {
        d.mixin(fixDef,polygonConf.fixDef);
      }
      if (d.isObject(polygonConf.bodyDef)){
        d.mixin(bodyDef,polygonConf.bodyDef);
      }

			return world.CreateBody(bodyDef).CreateFixture(fixDef);
		};

		return Polygon;

  });
}(this));
