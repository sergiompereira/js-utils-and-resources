
/**
 * namespace pattern
 * @class Matrix
 * @namespace smp.geom
 */

(function(){
	
	smp.namespace("smp.geom.Matrix");
	smp.geom.Matrix = (function()
	{
		/*
		 * [a c tx
		 *  b d ty
		 *  u v w]
		 */
		
		//private properties
		var _a = 1;
		var _b = 0;
		var _c = 0;
		var _d = 1;
		var _tx = 0;
		var _ty = 0;
		var _u = 0;
		var _v = 0;
		var _w = 1;
		
		var Constructor;
		
		//private methods
		var _translate = function (tx, ty)
		{	
			this.tx = tx;
			this.ty = ty;
			
		}
		var _rotate = function(angle)
		{
			this.a = Math.cos(angle);
			this.b = Math.sin(angle);
			this.c = -Math.sin(angle);
			this.d = Math.cos(angle);
		}
		
		var _scale = function(scale){
			this.a = this.d = scale;
		}
		
		var _getValue = function(){
			return  [a,c,tx,b,d,ty,u,v,w];
		}
		
		Constructor = function(a, b, c, d, tx, ty)
		{
			if(a !== null){
				_a = a;
			}
			if(b !== null){
				_b = b;
			}
			if(c !== null){
				_c = c;
			}
			if(d !== null){
				_d = d;
			}
			if(tx !== null){
				_tx = tx;
			}
			if(ty !== null){
				_ty = ty;
			}
		}
		
		Constructor.prototype = {
			//public properties
			a:_a,
			b:_b,
			c:_c,
			d:_d,
			tx:_tx,
			ty:_ty,
			
			//public methods
			translate: _translate,
			rotate: _rotate,
			scale: _scale,
			getValue:_getValue
		};
		
		return Constructor;
		
	}());

}());
