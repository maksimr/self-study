/*
 * Main javascript file
 */

(function (global) {
	/*
   * define jquery and dojo CDN
   */
	global.requirejs.config({
		paths: {
			'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
			'dojo': 'http://ajax.googleapis.com/ajax/libs/dojo/1.6/dojo/dojo.xd'
		}
	});
	require(['./Circle', './Polygon', 'dojo','./Box2dWeb-2.1.a.3.min'], function (Circle, Polygon) {
		var d = dojo;
		/*
     * Define canvas object and constants
     */
		var canvas = document.getElementById('box'),
		CANVAS_WIDTH = canvas.width,
		CANVAS_HEIGHT = canvas.height,
		SCALE = 30,
		dndBody = null;
		/*
   * check features for animation
   */
		var requestAnimFrame = global.requestAnimFrame = (function () {
			return global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame ||
			function (
			/* function */
			callback,
			/* DOMElement */
			element) {
				global.setTimeout(callback, 1000 / 60);
			};
		} ());

		/*
   * Import Box2D classes
   */
		var Box2D = global.Box2D,

		B2Vec2 = Box2D.Common.Math.b2Vec2,
		B2World = Box2D.Dynamics.b2World,
		B2MassData = Box2D.Collision.Shapes.b2MassData,
		B2AABB = Box2D.Collision.b2AABB,
		B2DebugDraw = Box2D.Dynamics.b2DebugDraw,
		B2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
		B2ContactListener = Box2D.Dynamics.b2ContactListener,
		B2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
		B2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
		/*
   * end importing
   */

		/*
    * CREATE WORLD
    */
		var world = new B2World(new B2Vec2(0, 10), true);

		/*
    * THE GROUND, CEILING AND WALLS
    */
		var ground, ceiling, leftWall, rightWall;

		ground = new Polygon(world, {
			isStatic: 1,
			width: 500,
			height: 10,
			position: {
				x: CANVAS_WIDTH / 2,
				y: CANVAS_HEIGHT
			}
		});
		ceiling = new Polygon(world, {
			isStatic: 1,
			width: 500,
			height: 10,
			position: {
				x: CANVAS_WIDTH / 2,
				y: 0
			}
		});
		leftWall = new Polygon(world, {
			isStatic: 1,
			width: 10,
			height: CANVAS_HEIGHT,
			position: {
				x: 0,
				y: CANVAS_HEIGHT / 2
			}
		});
		rightWall = new Polygon(world, {
			isStatic: 1,
			width: 10,
			height: CANVAS_HEIGHT,
			position: {
				x: CANVAS_WIDTH,
				y: CANVAS_HEIGHT / 2
			}
		});

    /*
     * CONNECT ON MOUSE EVENTS
     */
		d.connect(canvas, 'onmousedown', function (e) {
			var pos = d.position(canvas),
			x = (e.clientX - pos.x) / SCALE,
			y = (e.clientY - pos.y) / SCALE;

			var aabbTmp = new B2AABB();
			aabbTmp.lowerBound.Set(x - 0.001, y - 0.001);
			aabbTmp.upperBound.Set(x + 0.001, y + 0.001);

      /*
       * Get fixture under cursor
       */
			var isOverlap = world.QueryAABB(function (fixture) {
        var fb = fixture.GetBody();
        /*
         * fb.GetType() for statyc body return 0
         */
				if (fb.GetType() && fixture.GetAABB().TestOverlap(aabbTmp)) {
            var mouseJoint = new B2MouseJointDef();
            mouseJoint.bodyA = world.GetGroundBody();
            mouseJoint.bodyB = fb;

            mouseJoint.target = new B2Vec2(x,y);
            mouseJoint.maxForce = 100.0 * fb.GetMass();
            mouseJoint.collideConnected = true;
            mouseJoint.dampingRatio = 0;
            mouseJoint.frequencyHz = 100;

            mouseJoint = world.CreateJoint(mouseJoint);

						dndBody = fb;
				}
			}, aabbTmp);
		});

		d.connect(canvas, 'onmousemove', function (e) {
			var pos = d.position(canvas),
			x = (e.clientX - pos.x) / SCALE,
			y = (e.clientY - pos.y) / SCALE;
			if (dndBody) {
        dndBody.m_jointList.joint.SetTarget(new B2Vec2(x,y));
			}
		});

		/*
     * nullify drag and drom body
     */
		d.connect(canvas, 'onmouseup', function (e) {
      if(dndBody) {
        world.DestroyJoint(dndBody.m_jointList.joint);
        dndBody = null;
      }
		});

		/*
     * falling circles
     */
		var i = 0;
		for (i = 5; i > 0; i--) {
			var p = new Polygon(world, {
				width: Math.random() * 20 + 10,
				height: Math.random() * 20 + 10,
				position: {
					x: Math.random() * CANVAS_WIDTH,
					y: Math.random() * CANVAS_HEIGHT
				}
			});

			var c = new Circle(world, {
				radius: Math.random() * 10 + 10,
				position: {
					x: Math.random() * CANVAS_WIDTH,
					y: Math.random() * CANVAS_HEIGHT
				}
			});
		}

		//SETUP DEBUG DRAW
		var debugDraw = new B2DebugDraw();
		debugDraw.SetSprite(canvas.getContext("2d"));
		debugDraw.SetDrawScale(SCALE);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(B2DebugDraw.e_shapeBit | B2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);

		requestAnimFrame(function update() {
			world.Step(
			1 / 60 //frame-rate
			, 10 //velocity iterations
			, 10 //position iterations
			);
			world.DrawDebugData();
			world.ClearForces();
			requestAnimFrame(update);
		});

	});
} (this));
