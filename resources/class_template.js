
(function(){
	MyClass = (function(){
			
		/**
		 * internal constants (common accross instances)
		 */
		var MYCONST1 = 10;
		var MYCONST2 = "CONST_VALUE";
		

		/**
		 * internal variables (common accross instances)
		 */
		var Constructor;
		var myInternalVar1;
		
		Constructor = function(arg1, arg2){
			
			/**
			 * private variables (instance dependent)
			 */
			var _myPrivateVar1 = "myvalue";
			var _myPrivateVar2 = {};
			var _myPrivateVar3 = false;
			
			init(this);
			
			/**
			 * initial work
			 */
			function init(wraper){
				
				//use private variables
				//use internal variables and internal constants
				//use "wraper" as a pointer to the prototype
				//do not use arguments passed to the constructor
			}	
			
			
			/**
			 * private methods 
			 * Constructor context. 
			 * Declare them here if they use private non static properties, also declared inside the constructor (see above).
			 */
			function _myPrivateMethod1(){
				//use private variables here
				//use other private methods here
				
			}
			
			function _myPrivateMethod2(){
				
			}
			
			
			/**
			 * public properties
			 * Set initial values
			 */
			//use arguments passed to the constructor
			this.myPublicVar1 = arg1;
			//set initial values
			this.myPublicVar2 = 20;
			//if you use a private var, the value will be copied, no reference between them will be kept!
			//changes in any of them will not be reflected on the other! Use getters and setters instead.
			this.myPublicVar3 = _myPrivateVar1;
			
			//getter
			this.getMyPublicVar1 = function(){
				return _myPrivateVar2;
			};
			//setter
			this.setMyPublicVar1 = function(arg1, arg2){
				if(arg1 && arg1 !== undefined)_myPrivateVar2.x = arg1;
				if(arg2 && arg2 !== undefined)_myPrivateVar2.y = arg2;
			};
			//a getter and setter in one
			this.myPublicVar3 = function(value){ if(value !== undefined){ _myPrivateVar3 = value; }else{ return _myPrivateVar3;}};
			
			/**
			 * public methods (instance specific. If changed for one instance, no change occurs in the others)
			 * If these access private properties (declared within this constructor,not static)
			 * they must be defined inside this constructor
			 */
			this.myPublicMethod = _myPrivateMethod1;
			
			
		};
		

		Constructor.prototype = {
			/**
			 * public properties common across instances
			 */
			myCommonPublicVar1:"myCommonValue",
			
			/**
			 * public methods  common across instances
			 * These can access only internal properties (common accross instances) and must be defined outside the constructor function (see bellow)
			 */
			myCommonPublicMethod1 : myCommonPublicMethod1	,
			myCommonPublicMethod12 : function(){ //...}
		};
		
		
		var myCommonPublicMethod1 = function(){
		
		}
		
		return Constructor;
			
		
		
	}());
	
	
	//static constants, vars and methods
	
	MyClass.MY_STATIC_CONST = "myStaticValue1";
	MyClass.myStaticVar1 = "myStaticValue2";
	MyClass.myStaticMethod = function(){//...}
	
}());