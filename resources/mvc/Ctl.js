/**
 * 
 */

(function(){
	
	ClientsCtl = (function(){
		
		
		var constructor;
		
		constructor = function(){
			
			var view;
			var model;
			//handy to access properties or functions within callbacks and listeners
			var _this = this;
			
			var eventDispatcher = new EventDispatcher();
			eventDispatcher.clone(this);
			
			//public
			this.init = function(viewobj, modelobj){
				view = viewobj;
				model = modelobj;
				
				view.addEventListener("DELETE", onDelete);
				view.addEventListener("PUT", onPut);

			};
			
			//private
			function onDelete(evt){
			}
			
			function onPut(evt){
			}
			
			
			//others...
			function _privateMethod(){
				//call model methods for instance
			}
				
			//public 
			this.privilegedMethod = _privateMethod;
	
			
		}
		
		return constructor;
	}());
	
}())
