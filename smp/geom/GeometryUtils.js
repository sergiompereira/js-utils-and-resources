/**
 * namespace pattern
 * @class GeometryUtils
 * @namespace smp.geom
 */

(function(){
	
	smp.namespace("smp.geom.GeometryUtils");
	
	//constructor (instance creation)
	smp.geom.GeometryUtils = (function()
	{
		var _value;
		var Constructor;
		
		
		Constructor = function()
		{
		
		}
		
		Constructor.prototype = {
			//public properties
			value:_value,
			version:"1.0"
			
			//public methods
			
		};
		
		return Constructor;
		
	}());
	
	//static methods
	
    /**
     *  Round a number. By default the number is rounded to the nearest
     *  integer. Specifying a roundToInterval parameter allows you to round
     *  to the nearest of a specified interval.
     *  @param  number             The number you want to round.
     *  @param  nRoundToInterval   (optional) The interval to which you want to
     *                             round the number. The default is 1.
     *  @return                    The number rounded to the nearest interval.
     */
    smp.geom.GeometryUtils.distance = function(x1, y1, x2, y2) 
    {
    	var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx*dx+dy*dy);
    }
    
    smp.geom.GeometryUtils.distance3 = function(x1, y1, z1, x2, y2, z2) 
    {
		var dxz = smp.geom.GeometryUtils.distance(x1, z1, x2, z2);
		var dy = y1 - y2;
		return Math.sqrt(dxz*dxz+dy*dy);
    }
    


}());
    