
/* Based on work from John Resig http://ejohn.org/ */


(function(){
	
	var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	
	this.Class = function(){};
	var proxy = function(){};
	
	/* 
		 The following method enables extending this Class and whichever subclasses afterwards (this method is also inherited, see bellow)
				var myclass = smp.class.extend({
					log:function(value){console.log(value);}
				});
				var myclass2 = myclass.extend({
					log:function(value){ this._super("myclass2: "+value)}
				});
				var inst = new myclass2();
				inst.log("I am the first instance");	
				
		 'prop' should be an object literal with the properties and methods that will be copied onto the new prototype.
		 Pass an 'init' function as initializer. It is a convention. If you call it other name, than invoke it explicitly after extending:
				var mySubclass = Class.extend({myInitializer:function(){...}});
				var inst = new mySubclass();
				inst.myInitializer();
				
		 Any instance specific properties or methods added to 'this.' should happen within those methods:
			var mysubclass = Class.extend(
				{
				 init:function(){
						var privateInstanceValue = "";
						this.publicInstanceValue = "";
						function privateInstanceMethod(){};
						this.publicInstanceMethod = function(){};
					},
				  publicPrototypeValue: "",
				  publicPrototypeMethod:function(){}
				}	
			);
		
		If you provide a new method with the same name as one in the superclass (overwriting it),
		you can invoke the super method within your new implementation with this._super();
		This includes obviously the init method: 
				var myclass = smp.class.extend({
					init:function(){
						//invokes the init method in the superclass
						this._super();
					}
				}
		
		Internal/private, common across instances, variables or methods are not possible here.
		Remember that they are achieved in anonymous closure functions. 
		You have to implement them yourself after extending:
		
		var subclass = (function(){
				
			//internal, instance independent, variables and methods
			var privateCommonVar = "";
			var privateCommonMethod = function(){};
			function privateCommonMethod(){
			};
			
			var _subclass = smp.class.extend({
				//create public getters if needed
				getMyPrivateVar : function(){
					return privateCommonVar;
				},
				privilegedMethod: privateCommonMethod
			});
			
			//create static properties and methods
			_subclass.staticProp = "";
			_sublcass.staticMethod = function(){};
			
			return _subclass;
		}());
			
		Any object or function can be passed as argument, but its properties and methods are passed by reference, they are not deep-copied. 
		So if you change them within the new sublclass, it will afect the original object, which might be a problem if it is in use elsewhere.
		Instead create a temporary deep-copy:
				var subClass = Class.extend(smp.clone(myComplexObjectInUse));
		
	*/
	Class.extend = function(prop) {
	
		var _super = this.prototype;
	
		proxy.prototype = _super;
		var prototype = new proxy();
		
		for (var name in prop) {
			if(typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name])){
				prototype[name] = (function(name, fn){
						return function() {
								var tmp = this._super;
								this._super = _super[name];
								var success = fn.apply(this, arguments);
								this._super = tmp;
								return success;
							};
					})(name, prop[name])
			}else{
				prototype[name] = prop[name];
			}
		}
		
		_class.prototype = prototype;
		_class.parent = _super;
		_class.prototype.constructor = _class;
		_class.extend = arguments.callee;
		
		function _class() {
			if (this.init ) this.init.apply(this, arguments);
		}
		
		return _class;
	};
})();