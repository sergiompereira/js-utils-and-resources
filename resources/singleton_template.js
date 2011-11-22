
/**
 * Singleton
 */

var AppModel = (function(){
	
	var instance;
	
	var Constructor = function(){
		
		if(instance){
			return instance;
		}
		
		instance = this;
		
		var events = {};
		events.PLAYER_JOINED = "PlayerJoined";
		events.PIECE_MOVED = "PieceMoved";
	
	}

	
	return Constructor;
	
}());

var appModel = new AppModel();
var appModel2 = new AppModel();
console.log(appModel === appModel2);

