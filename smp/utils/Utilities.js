/**
 * namespace pattern
 * @class Utilities
 * @namespace smp.utils
 */

(function(){
	
	smp.namespace("smp.utils.Utilities");
	
	//constructor (instance creation)
	smp.utils.Utilities = (function()
	{
		var _value;
		var Constructor;
		
		
		Constructor = function()
		{
		
		}
		
		Constructor.prototype = {
			//public properties
			value:_value,
			version:"1.1"
			
			//public methods
			
		};
		
		return Constructor;
		
	}());
	
	//static methods
 
	smp.utils.Utilities.serialize = function(_obj)
	{
	   // Let Gecko browsers do this the easy way
	   if (typeof _obj.toSource !== 'undefined' && typeof _obj.callee === 'undefined')
	   {
		  return _obj.toSource();
	   }

	   // Other browsers must do it the hard way
	   switch (typeof _obj)
	   {
		  // numbers, booleans, and functions are trivial:
		  // just return the object itself since its default .toString()
		  // gives us exactly what we want
		  case 'number':
		  case 'boolean':
		  case 'function':
			 return _obj;
			 break;

		  // for JSON format, strings need to be wrapped in quotes
		  case 'string':
			 return '\'' + _obj + '\'';
			 break;

		  case 'object':
			 var str;
			 if (_obj.constructor === Array || typeof _obj.callee !== 'undefined')
			 {
				str = '[';
				var i, len = _obj.length;
				for (i = 0; i < len-1; i++) { str += serialize(_obj[i]) + ','; }
				str += serialize(_obj[i]) + ']';
			 }
			 else
			 {
				str = '{';
				var key;
				for (key in _obj) { str += key + ':' + serialize(_obj[key]) + ','; }
				str = str.replace(/\,$/, '') + '}';
			 }
			 return str;
			 break;

		  default:
			 return 'UNKNOWN';
			 break;
	   }

	}
	
	smp.utils.Utilities.getDateString = function(dateObj) {
		
		function pad2(number) { return (number < 10 ? '0' : '') + number };
		
		var dt = new Date();
		if(dateObj){
			dt = dateObj;
		}
		
		var dtstring = dt.getFullYear()
			+ '-' + pad2(dt.getMonth()+1)
			+ '-' + pad2(dt.getDate())
			+ ' ' + pad2(dt.getHours())
			+ ':' + pad2(dt.getMinutes())
			+ ':' + pad2(dt.getSeconds());
			
			return dtstring;
	}
	
	
	smp.utils.Utilities.getDateObject = function(miliseconds, leftzero)
	{
		var c,s,m,h,d,r;
		var roundfnc;
		if(miliseconds >= 0){
			roundfnc = Math.floor;
		}else{
			roundfnc = Math.ceil;
		}
			d = roundfnc(miliseconds / 86400000);
			r = miliseconds % 86400000;
			h = roundfnc(r / 3600000);
			r = r % 3600000;
			m = roundfnc(r / 60000);
			r = r % 60000;
			s = roundfnc(r / 1000);
			r = r % 1000;
			c = roundfnc(r / 10);
			
			d = d.toString();
			h = h.toString();
			m = m.toString();
			s = s.toString();
			c = c.toString().substr(0,2);
			
			if(leftzero){
				if (c.length == 1) {
					c = "0" + c;
				}
				if (s.length == 1) {
					s = "0" + s;
				}
				if (m.length == 1) {
					m = "0" + m;
				}
				if (h.length == 1) {
					h = "0" + h;
				}
				if (d.length == 1) {
					d = "0" + d;
				}
			}
			
			return {
					day:d,
					hour:h,
					min:m,
					sec:s,
					csec:c
					};

	}
}());
