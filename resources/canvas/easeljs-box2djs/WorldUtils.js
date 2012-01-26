/**
 * 
 */
(function(){
	WorldUtils = (function(){

		 var   b2Vec2 = Box2D.Common.Math.b2Vec2
         	,  b2AABB = Box2D.Collision.b2AABB
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
         	;
		var Constructor;
		
		
		Constructor = function(world, includeStatic){

			var _scale = 30;
			var _world = world;
			var _includeStatic = includeStatic;
			var _foundBody;
			var _posPVec;
			
			function _getBodyAtPoint(x,y) {
				x = x/_scale;
				y = y/_scale;
				_posPVec = new b2Vec2(x, y);
	            var aabb = new b2AABB();
	            aabb.lowerBound.Set(x - 0.001, y - 0.001);
	            aabb.upperBound.Set(x + 0.001, y + 0.001);
	            
	            // Query the world for overlapping shapes.

	            _foundBody = null;
	            _world.QueryAABB(getBodyCB, aabb);
	            return _foundBody;
	         }

	         function getBodyCB(fixture) {
	            if(!_includeStatic && fixture.GetBody().GetType() != b2Body.b2_staticBody) {
	               if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), _posPVec)) {
	            	   _foundBody = fixture.GetBody();
	                  return false;
	               }
	            }else {
	            	if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), _posPVec)) {
	            	   _foundBody = fixture.GetBody();
	                  return false;
	               }
	            }
	            return true;
	         }
		        
	         this.getBodyAtPoint = _getBodyAtPoint;
		}
		
		
		Constructor.prototype = {};
	
		return Constructor;
	
	
	
	}());
}());
