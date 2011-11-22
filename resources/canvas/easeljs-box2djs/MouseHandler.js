
(function(){
	MouseHandler = (function(){

		 var   b2Vec2 = Box2D.Common.Math.b2Vec2
         	,  b2AABB = Box2D.Collision.b2AABB
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
         	;
		var Constructor;
		
		
		Constructor = function(canvas,world){
			
			//mouse handlers
	         var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
	         var forceFactor = 3000.0;
	         var canvasPosition = getElementPosition(canvas);
	                
	         canvas.addEventListener("mousedown", onMouseDown, true);
	         document.addEventListener("mouseup", onMouseUp, true);
	         function onMouseDown(e)
	         {
	            isMouseDown = true;
	            handleMouseMove(e);
	            
	            canvas.addEventListener("mousemove", handleMouseMove, true);
	         };
	         

	         function onMouseUp() 
	         {
	        	canvas.removeEventListener("mousemove", handleMouseMove, true);
	            isMouseDown = false;
	            mouseX = undefined;
	            mouseY = undefined;
	         };
	         
	         function handleMouseMove(e) {
	            mouseX = (e.clientX - canvasPosition.x) / 30;
	            mouseY = (e.clientY - canvasPosition.y) / 30;
	         };
	         
	         function getBodyAtMouse() {
	            mousePVec = new b2Vec2(mouseX, mouseY);
	            var aabb = new b2AABB();
	            aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
	            aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
	            
	            // Query the world for overlapping shapes.

	            selectedBody = null;
	            world.QueryAABB(getBodyCB, aabb);
	            return selectedBody;
	         }

	         function getBodyCB(fixture) {
	            if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
	               if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
	                  selectedBody = fixture.GetBody();
	                  return false;
	               }
	            }
	            return true;
	         }
	         
	         function handleDrag()
	         {
	        	  if(isMouseDown && (!mouseJoint)) {
	        	
	            	 var  bodyAtMouse = getBodyAtMouse();
	        		
	               if(bodyAtMouse) {
	                  var md = new b2MouseJointDef();
	                  md.bodyA = world.GetGroundBody();
	                  md.bodyB = bodyAtMouse;
	                  md.target.Set(mouseX, mouseY);
	                  md.collideConnected = true;
	                  md.maxForce = forceFactor * bodyAtMouse.GetMass();
	                  mouseJoint = world.CreateJoint(md);
	                  bodyAtMouse.SetAwake(true);
	               }
		
	            }
	        	 
	            
	            if(mouseJoint) {
	               if(isMouseDown) {
	                  mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
	               } else {
	                  world.DestroyJoint(mouseJoint);
	                  mouseJoint = null;
	               }
	            }
	         }
	         
	         function update(){
	        	
	        	 handleDrag();
	            
	         }
	         
	         /**
	          * helpers
	          */
	         //http://js-tut.aardon.de/js-tut/tutorial/position.html
	         function getElementPosition(element) {
	            var elem=element, tagname="", x=0, y=0;
	           
	            while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
	               y += elem.offsetTop;
	               x += elem.offsetLeft;
	               tagname = elem.tagName.toUpperCase();

	               if(tagname == "BODY")
	                  elem=0;

	               if(typeof(elem) == "object") {
	                  if(typeof(elem.offsetParent) == "object")
	                     elem = elem.offsetParent;
	               }
	            }

	            return {x: x, y: y};
	         }
	         
	         
	         /**
	          * public methods
	          */
	         this.update = update;
		
		}
		
		
		Constructor.prototype = {};
	
		return Constructor;
	
	
	
	}());
}());
