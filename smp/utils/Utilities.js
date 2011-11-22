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
}());
