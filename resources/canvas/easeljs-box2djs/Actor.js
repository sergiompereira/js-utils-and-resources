
(function(){
	Actor = (function(){
	
		
		/**
		 * Constants
		 */

		
		/**
		 * private static variables
		 */
		var Constructor;
		var b2BodyDef = Box2D.Dynamics.b2BodyDef
     	,	b2Body = Box2D.Dynamics.b2Body
     	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
		,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
     	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
     	//,	b2Fixture = Box2D.Dynamics.b2Fixture
     	;
		
		Constructor = function(world, stage){
			
			/**
			 * private variables (instance dependent)
			 */
			
			//
			var _scale = 30;
			var _alive = true;
			
			//Easel objects
			var _graphics;
			var _grShape;
			var _stage;
			
			//Box2D objects
			var _fixDef;
			var _bodyDef;
			var _body;
			var _world;
			
			//Physics params default value
			var _density = 0.8; //1.0 //0.7
			var _friction = 0.8; //0.3 //0.8
			var _restitution = 0.3; //0.5 //0.3
			 
			//display object params
			var x,y,width,height;
			
			init();
			
			/**
			 * initial work
			 */
			function init(){
				
				_world = world;
				_stage = stage;
				
			}	
			
			/**
			 * 
			 * @param density
			 * @param restitution
			 * @param friction
			 */
			function defineFixture(density, friction, restitution)
			{
				_fixDef = new b2FixtureDef;
				(density) ? _fixDef.density = density : _fixDef.density = _density;
				(friction) ? _fixDef.friction = friction : _fixDef.friction = _friction;
				(restitution) ? _fixDef.restitution = restitution : _fixDef.restitution = _restitution;
		            	
				
			};
			
			/**
			 * 
			 * @param type	String : "circle" or "rect"
			 * @param w		Number : width or radius
			 * @param h		Number or null : height or null
			 * @param c		String : ex. "#FF0000" or rgba(255,0,0,0.5)
			 * @param a
			 * @param s
			 * @param sc	String : ex. "#FF0000" or rgba(255,0,0,0.5)
			 * @returns
			 */
			function defineShape(type,w,h,c,a,s,sc)
			{
				if(!_fixDef){
					return;
				}
				
			
				switch(type){
					case "circle":
						_fixDef.shape = new b2CircleShape(w/_scale);
						//the registration point is at the center in circles
						_graphics = GraphicsFactory.createCircle(w,c,a,s,sc)
						_grShape = new Shape(_graphics);
						
				 		//_grShape.type = "bar";
				    	_stage.addChild(_grShape);
						_grShape.width = w*2;
						_grShape.height = w*2;
				    	break;
					case "rect":
						_fixDef.shape = new b2PolygonShape();
						/**
						The SetAsBox function takes the half-width and half-height (extents).
			    		The box is centered on the origin of the parent.
			    		*/
						_fixDef.shape.SetAsBox(w/_scale/2, h/_scale/2);
						//the registration point is at the upper left corner in rects
						_graphics = GraphicsFactory.createRect(w,h,c,a,s,sc)
						_grShape = new Shape(_graphics);
						
				 		//_grShape.type = "bar";
				    	_stage.addChild(_grShape);
						_grShape.width = w;
						_grShape.height = h;
				    	break;
				}
				
				width = w;
				(h)? height = h : height = w;
				
				
		 		
		 		
			};
			
			/**
			 * 
			 * @param x
			 * @param y
			 * @param angle
			 * @param type
			 */
			function defineBody(x,y,angle,type,mouseEnabled,damping)
			{
				
				if(!_fixDef || !_grShape){
					return;
				}
		        
				_bodyDef = new b2BodyDef;
				_bodyDef.position.Set((x+width/2)/_scale, (y+height/2)/_scale);			 
				(angle)?_bodyDef.angle = angle * (Math.PI / 180):_bodyDef.angle = 0;
				(damping) ? _bodyDef.angularDamping = damping : _bodyDef.angularDamping = 0;
				
				switch(type)
				{
					case "dynamic":
						_bodyDef.type = b2Body.b2_dynamicBody;
						break;
					case "kinematic":
						_bodyDef.type = b2Body.b2_kinematicBody;
						break;
					default:
					//case "static":
						_bodyDef.type = b2Body.b2_staticBody;
						break;
				}
				
			 
				_body = _world.CreateBody(_bodyDef);
				_body.CreateFixture(_fixDef);
				_body.userData = {actor:this};
				
				_grShape.x = x+width/2;
				_grShape.y = y+height/2;
				_grShape.mouseEnabled = mouseEnabled;
				_grShape.rotation = angle;
				
				
			};
			
			
			
			
			/**
			 * private methods
			 */
			function update()
			{
				_grShape.x = (_body.GetPosition().x * _scale);
				_grShape.y = (_body.GetPosition().y * _scale);
				_grShape.rotation = _body.GetAngle() * (180 / Math.PI);
				
				
			
	           
			}
			
			function kill()
			{
				
				_world.DestroyBody(_body);
				_stage.removeChild(_grShape);
				_grShape = null;
				_alive = false;
				
			}
			 
			
			
			/**
			 * public properties: getters and setters !
			 */
			
			this.getDisplay = function(){return _grShape;};
			this.getBody = function(){return _body};
			this.getBodyDef = function(){return _bodyDef};
			//this.getFixtureDef = function(){return _fixDef}
			this.scale = _scale;
			this.alive = _alive;
			//this.type = type;
			/*
			this.width = _grShape.width();
			this.height = _grShape.height();
			this.x = _grShape.x;
			this.y = _grShape.y;
			*/
			/**
			 * public methods
			 * If these access private properties (declared within this constructor,not static)
			 * they must be defined inside this constructor
			 */
		
			this.defineFixture = defineFixture;
			this.defineShape = defineShape;
			this.defineBody = defineBody;
			this.update = update;
			this.kill = kill;
			
			
			
		};
		

		Constructor.prototype = {
			/**
			 * public properties common across instances
			 */
			
			/**
			 * public methods  common across instances
			 * These can access only static properties and must be defined outside the constructor function
			 */
				
		};
		
		
		return Constructor;
			
		
		
	}());
}());