
(function(){
	
	smp.namespace("smp.utils.JSON");
	
	//constructor (instance creation)
	smp.utils.JSON = (function()
	{
		
		var Constructor;

		Constructor = function()
		{
		
		};

		//private methods
		
		var get = function(source, data, callback){
				
				var params = urlencode(data, callback);
				
				var newScript = document.createElement('script');
				newScript.setAttribute("type","text/javascript");
				newScript.setAttribute("src", source+"?"+params);
				
				document.getElementsByTagName("head")[0].appendChild(newScript);
				//newScript.onload=callback;
				
				
			};
			
		var urlencode = function(data, callback){
			
				var params="";
				var i;
				for (i in data) {
					if (params.length > 0) {
						params += "&";
					}
					params = params + encodeURIComponent(i) + "=" + encodeURIComponent(data[i]);
				}
				if (callback != null) {
					if (params.length > 0) {
						params += "&";
					}
					params = params + "callback="+callback+"&format=json";
				}
				
				return params;
			}

			//END private methods

		
			//return public interface (reveal only the desired private methods)
			Constructor.prototype = {
					//public properties
					version:"1.0",
					
					//public methods
					get:get,
					post:post
				};
			
			
			return Constructor;
		
	//immediate function pattern (auto-execute)	
	}());
}());

