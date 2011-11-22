package 
{
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.external.ExternalInterface;
	import srg.display.loaders.LoadBitmap;
	import srg.display.loaders.LoadDisplayObject;
	import srg.display.utils.MovieClipId;
	
	import srg.components.sliders.ListSliderHorizontal;
	import srg.components.sliders.ListSliderVertical;
	import nl.demonsters.debugger.MonsterDebugger;
	
	
	public class  Main extends MovieClip
	{
	
		private var friendsGallery:ListSliderVertical = new ListSliderVertical();
		private var photosGallery:ListSliderHorizontal = new ListSliderHorizontal();
		private var friendsPhotosColl:Array = new Array();
		private var photosColl:Array = new Array();
		private var loading:Boolean = false;
		
		
		public function Main() {
			
			preloader.visible = false;
			loginbtn.enabled = false;

			
			ExternalInterface.addCallback("libraryLoadedHnd", libraryLoadedHnd);
			ExternalInterface.call("fcbkFlInt.init", "57723b31579b3180b720ab606e6571f2", "pt_PT", "libraryLoadedHnd");
			
		}
		
		
		
		private function libraryLoadedHnd():void 
		{
			MonsterDebugger.trace(this, "call");
			ExternalInterface.addCallback("loginStatusHnd", loginStatusHnd);
			ExternalInterface.call("fcbkFlInt.getLoginStatus", "", "loginStatusHnd");			
		}
		
		private function loginStatusHnd(data:Object):void {
			if (data == null) {
				loginbtn.enabled = true;
				loginbtn.addEventListener(MouseEvent.CLICK, onLoginClick);
			}else {
				
				onUserReady(data);
			}
		}
		
		private function onLoginClick(evt:MouseEvent):void {
			ExternalInterface.addCallback("onLoginResponse", onLoginResponse);
			ExternalInterface.call("fcbkFlInt.login", "", "onLoginResponse");
		}
		
		private function onLoginResponse(data:Object):void {
			
			onUserReady(data);
			
		}
		
		private function onUserReady(data:Object):void
		{
			loginbtn.visible = false;
			
			username_txt.text = data.response.name;
			
			ExternalInterface.addCallback("onFriendsResponse", onFriendsResponse);
			ExternalInterface.call("fcbkFlInt.getFriends", "onFriendsResponse");
		}
		
		private function onFriendsResponse(data:Object):void {
			MonsterDebugger.trace(this, data.length);
			
			var counter:Number = 0;
			friendsGallery.setup(200, 400, 5);
			gallery_cont.addChild(friendsGallery);
			
			for (var i:uint = 0; i < data.length; i++) {
				var item:MovieClipId = new MovieClipId();
				//ExternalInterface.call("fcbkFlInt.getProfilePhoto", "large", data[i].id);
				item.addChild(new LoadDisplayObject( data[i].photo, false, false, false, onPhotoLoaded));
				item.y = i * 70;
				item.id = data[i].id;
				item.description = data[i].name;
				item.addEventListener(MouseEvent.CLICK, onPhotoClicked);
				friendsPhotosColl.push(item);
			}
			
			
			function onPhotoLoaded(obj:*):void {
				counter++;
				friendsGallery.addItem(obj.parent);
				if (counter == data.length) {
					friendsGallery.start();
				}
			}
			
			ExternalInterface.addCallback("onAlbunsLoaded", onAlbunsLoaded);
			ExternalInterface.addCallback("onPhotosLoaded", onPhotosLoaded);
			
			photosGallery.setup(600, 520, 5);
			photos_cont.addChild(photosGallery);
			
			
		}
		
		private function onPhotoClicked(evt:MouseEvent):void {
			
			if (loading == false) {
				
				photosGallery.clear();
				photosColl.splice(0, photosColl.length);
			
				loading = true;
				preloader.visible = true;
				status_txt.text = "Profile pictures de "+(evt.currentTarget as MovieClipId).description;
				ExternalInterface.call("fcbkFlInt.getAlbums", (evt.currentTarget as MovieClipId).id, "onAlbunsLoaded");
			}
		}
		
		private function onAlbunsLoaded(data:Object):void {
			
			if (data.length > 0) {
				var profile:Boolean = false;
				for (var i:uint = 0; i < data.length; i++) {
					if (data[i].name == "Profile Pictures") {
						ExternalInterface.call("fcbkFlInt.getPhotos", data[i].id, "onPhotosLoaded");
						profile = true;
						break;
					}
				}
				if (!profile) {
					loading = false;
					preloader.visible = false;
					status_txt.text = "Não foram encontrados álbuns";
				}
			}else {
				loading = false;
				preloader.visible = false;
				status_txt.text = "Não foram encontrados álbuns";
			}
			
		}
		
		private function onPhotosLoaded(data:Object):void {
			
			
			
			if(data.length>0){
				var counter:Number = 0;
				for (var i:uint = 0; i < data.length; i++) {
					var item:MovieClipId = new MovieClipId();
					//ExternalInterface.call("fcbkFlInt.getProfilePhoto", "large", data[i].id);
					item.addChild(new LoadDisplayObject( data[i].source, false, false, false, onPhotoLoaded));
				
					item.id = data[i].id;
					//item.addEventListener(MouseEvent.CLICK, onPhotoClicked);
					photosColl.push(item.getChildAt(0));
				}
			}else {
				loading = false;
				preloader.visible = false;
				status_txt.text = "Não foram encontrados álbuns";
			}
			
			
			function onPhotoLoaded(obj:*):void 
			{
				counter++;
				
				
				if (counter == data.length) {
					photosGallery.addItem(photosColl[0].parent);
					for (i = 1; i < photosColl.length; i++) 
					{
						photosColl[i].parent.x = photosColl[i - 1].parent.x + photosColl[i - 1].width + 20;
						
						photosGallery.addItem(photosColl[i].parent);
					}
					
					photosGallery.start();
					
					loading = false;
					preloader.visible = false;
					
				}
			}
		}
		
		
	}
}