
/**
 * namespace pattern
 * @class URL
 * @namespace smp.utils
 */

(function(){
	
	smp.namespace("smp.utils.URL");
	
	//constructor (instance creation)
	smp.utils.URL = (function()
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
	smp.utils.URL.params = function()
	{
		var qsParm = new Array();
        var query = '';
        var fullURL = window.document.URL;
        if (fullURL.indexOf('?') > 0) {
            query = fullURL.substring(fullURL.indexOf('?')+1, fullURL.length);
            query = unescape(query);
        }
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0,pos);
				var val = parms[i].substring(pos+1);
				qsParm[key] = val;
			}
		}
        return (qsParm);
	}
	
}());
