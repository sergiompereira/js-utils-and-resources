/**
* @example	
		var canvas  = document.getElementById('canvas');
		var curve = new smp.canvas.BezierCurve(canvas);
		curve.lineStyle(5, '#990000');
		curve.drawCubic(curve.createPoint(20,20),curve.createPoint(200,200),curve.createPoint(100,20),curve.createPoint(100,200));
*/
(function(){
	
	smp.namespace("smp.canvas.BezierCurve");
	
	smp.canvas.BezierCurve = (function(){		
		
		if(!smp.math.Geometry2D){
			throw new Error('BezierCurve : Geometry2D needed.');
			return;
			
		}
		
		var Constructor;
		var Geometry2D = smp.math.Geometry2D;
		var graphics;
		var options;
		
		
		Constructor = function(canvasel){
			if(canvasel) {
				graphics = canvasel.getContext('2d');
			}else{
				throw new Error('BezierCurve(constructor): Provide a canvas element reference as argument.');
			}
		};
		
		
		Constructor.prototype.lineStyle = function(thickness, color, dashlen,spacelen){
			options = {};
			options.thickness = thickness || 1;
			options.color = color || '#000000';
			options.dashlen = dashlen || 5;
			options.spacelen = spacelen || 5;
		}
		
		Constructor.prototype.drawQuadratic = function(){
			//TODO
		}
		
		/**
		*	@param	startpoint	: object with properties x and y (use createPoint) 
		*	@param	destpoint	: object with properties x and y (use createPoint)
		*	@param	control1	: object with properties x and y (use createPoint)
		*	@param	control2	: object with properties x and y (use createPoint)
		*/
		Constructor.prototype.drawCubic = function(startpoint, destpoint, control1, control2) {
			if (!options) {
				this.lineStyle();
			}
			
			graphics.lineWidth = 1;
			graphics.strokeStyle = options.color;
			
			var inc = 0.001,i = 0,point,length = 0,stroke = true,lastPoint,nextPoint;
			
			for (i = 0; i <= 1; i += inc) {
				if (nextPoint) {
					point = nextPoint;
				}else {
					point = interpolatePoint(startpoint,destpoint, control1, control2,i);
				}
				
				if(lastPoint){
					length += Geometry2D.distance(lastPoint.x, lastPoint.y, point.x, point.y);
				}
				
				nextPoint = interpolatePoint(startpoint,destpoint, control1, control2, i + inc);
				if (stroke) {
					var angle = 0;
					if (nextPoint) {
						angle = Geometry2D.getLineAngle(point, nextPoint);
					}
					drawRect(point, angle);
				}
				
				if ((stroke && length > options.dashlen) || (!stroke && length > options.spacelen)) {
					stroke = !stroke;
					length = 0;
				}
				
				lastPoint = point;
			}
			graphics.stroke();
			
		}
		
		Constructor.prototype.createPoint = createPoint;
		
		//helpers
		//this one made public above
		function createPoint(x,y){
			return {x:x,y:y};
		}
		
		function interpolatePoint(s,d,c1,c2,t) {
		
			var point = createPoint();
			point.x = interpolateCubic(s.x, c1.x, c2.x, d.x, t);
			point.y = interpolateCubic(s.y, c1.y, c2.y, d.y, t);
			return point;
		}
		function interpolateCubic(a, b, c, d, r) {
			return a * Math.pow(1 - r, 3) + b * 3 * Math.pow(1 - r, 2) * r +c * 3 * (1 - r) * Math.pow(r,2) + d * Math.pow(r, 3);
		}
		
		/**
		*	@param	point	: object with x and y properties
		*/
		function drawRect(point, rotation) {
			var side = options.thickness / 2;
			var point1 = createPoint(point.x, point.y + side);
			var point2 = createPoint(point.x, point.y - side);
			
			
			if (rotation > 0) {
				point1 = Geometry2D.rotatePoint(point,point1, rotation);
				point2 = Geometry2D.rotatePoint(point,point2, rotation);
				
			}
			graphics.moveTo(point1.x, point1.y);
			graphics.lineTo(point2.x, point2.y);
			

		}
	
		
		return Constructor;

	}());	

	
}());

	
	
