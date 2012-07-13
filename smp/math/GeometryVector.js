/**
 * namespace pattern
 * @class GeometryVector
 * @namespace smp.math
 */

(function(){
	
	smp.namespace("smp.math.GeometryVector");
	
	//constructor (instance creation)
	smp.math.GeometryVector = (function()
	{
		var Constructor;
		
		Constructor = function(angle, magnitude)
		{
			this.angle = angle || 0;
			this.magnitude = magnitude || 0;
		
		}
		
		Constructor.prototype = {
			
			//public methods
			
		};
		
		return Constructor;
		
	}());
	
}());