/**
 * 
 */

(function(){
	
	ClientsView = (function(){
		
		
		var constructor;
		
		constructor = function(){
			
			var ctl;
			var model;
			//handy to access properties or functions within callbacks and listeners
			var _this = this;
			
			var eventDispatcher = new EventDispatcher();
			eventDispatcher.clone(this);
			
			//public
			this.init = function(ctlobj, modelobj){
				ctl = ctlobj;
				model = modelobj;
				
				model.addEventListener(ClientsModel.events.GETCLIENTS_COMPLETE, onClientsReady);
				model.addEventListener(ClientsModel.events.GETCLIENTS_ERROR, onClientsError);

			};
			
			/**
			 * private
			 */
			
			
			//model event handlers
			function onClientsReady(evt){
			
				
			}
			
			function onClientsError(){
				
			}
			
			//others...
			function _privateMethod()
			{
				
			}
			
			
			//accessible methods (made public)
			this.privilegedMethod = _privateMethod;
			
		}
		
		return constructor;
	}());
	
}())
