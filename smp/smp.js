if (typeof smp == "undefined" || !smp) {
  
    var smp = {};
}

if (typeof window.console == 'undefined') {
	window.console = {};
	window.console.log = function(msg) {
		return;
	};
}

smp.namespace = function(sNamespace){
	var parts = sNamespace.split("."),
		parent = smp,
		i;
	
	if(parts[0] === "smp"){
		parts = parts.slice(1);
	}
	
	for(i=0; i<parts.length; i+=1){
		if(typeof parent[parts[i]] === "undefined"){
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};


//some utils
smp.debugMode = true;
smp.log = function(value){
	if(this.debugMode){
		window.console.log("smp log : "+value);
	}
}
smp.clone = function(parent, child){
	
	var child = child || {};
	var i, 
		toString = Object.prototype.toString, 
		astr = "[object Array]";
	
	
	function _copy(parent, child){
		
		for(i in parent){
			if(parent.hasOwnProperty(i)){
				if(typeof parent[i] === "object"){
					child[i] = (toString.call(parent[i])===astr) ? [] : {};
					_copy(parent[i], child[i]);
				}else{
					child[i] = parent[i];
				}
			}
		}
		return child;
	}
	
	_copy(this,child);

	
	return child;

}

smp.extend = function(parent, child){

	if(typeof parent === "function"){
		var child = child || function(){};
		
		//copy own properties (added to this.)
		child = smp.clone(parent, child);
		
		//copy prototype
		var proxyF = function(){};
		proxyF.prototype = parent.prototype;
		child.prototype = new proxyF();
		child.superPrototype = parent.prototype;
		child.prototype.constructor = child;
		
	}else{
		return null;
	}
	
	return child;
	
}
