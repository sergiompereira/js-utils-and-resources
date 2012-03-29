
/**
 * @example: 
 * var evtD = new smp.utils.EventDispatcher();
 * evtD.dispatchEvent("DATA_LOADED", {prop1:"prop1", prop2:"prop2"});
 *
*	var _this = this;
* 	evtD.addEventListener("DATA_LOADED", mycallback);
*	function mycallback(evt){
*		//'this' would point to the array element where the listeners are stored
*		_this.followUp(evt.data);
*	}
 *
 *	//inheritance
 *	function myOwnDispatcher(){
 *		smp.utils.EventDispatcher.clone(this);
 *	}
 *
 *
 */

(function(){

	smp.namespace("smp.utils.EventDispatcher");
	
	//constructor (instance creation)
	smp.utils.EventDispatcher = (function(){

		var Constructor;
	
		Constructor = function(arg1, arg2)
		{
			var listeners = [];
			
			
			//private
			//event object
			function CustomEvent(){
				this.name = "";
				this.data = {};
			}
			
			function _dispatchEvent(evt, data)
			{
				var j, eventObj;
				for(j=0; j<listeners.length; j++){
					if(listeners[j][0] == evt){
						if(typeof listeners[j][1] === "function"){
							eventObj = new CustomEvent();
							eventObj.name = evt;
							eventObj.data = data;
							listeners[j][1](eventObj);
						}
					}
				}
			}
			
			//protected
			function _addEventListener(evt,callback){
				listeners.push([evt,callback]);
			}
			function _removeEventListener(evt, callback){
				var j;
				for(j=0; j<listeners.length; j++){
					if(listeners[j][0] == evt && listeners[j][1] == callback){
						listeners.splice(j,1);
						//no break is used because there might have been redundancy of listeners
					}
				}
			}
			
			function _clone(inheritedObj){
				var inheritedObj = inheritedObj || {};
				var i, 
					toString = Object.prototype.toString, 
					astr = "[object Array]";
				
				
				function extend(superObj, inheritedObj){
					
					for(i in superObj){
						if(superObj.hasOwnProperty(i)){
							if(typeof superObj[i] === "object"){
								inheritedObj[i] = (toString.call(superObj[i])===astr) ? [] : {};
								extend(superObj[i], inheritedObj[i]);
							}else{
								inheritedObj[i] = superObj[i];
							}
						}
					}
					return inheritedObj;
				}
				
				extend(this,inheritedObj);
				
				return inheritedObj;
			
			}
			
			//public
			this.addEventListener = _addEventListener;
			this.removeEventListener = _removeEventListener;
			this.dispatchEvent = _dispatchEvent;
			this.clone = _clone;
				
				
		};
		
		return Constructor;
		
	}());
	
	smp.utils.EventDispatcher.clone = function(targetObj){
		var eventDispatcher = new smp.utils.EventDispatcher();
 		eventDispatcher.clone(targetObj);
		return targetObj;
	}
		
	//static properties (actually constants)
	smp.utils.EventDispatcher.events = {};
	smp.utils.EventDispatcher.events.ENTER_FRAME = "ENTER_FRAME";
	
}());
