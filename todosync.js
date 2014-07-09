//online,offline이벤트를 할당을 하고
//offline일 때 header엘리먼트에 offline클래스를 추가하고
//online일 때 header엘리먼트에 offline클래스를 삭제하기.

var TODOSync = {
	url : "http://ui.nhnnext.org:3333/",
	id : "mixed",
	init : function(){
		window.addEventListener("online",this.onofflineListener);
		window.addEventListener("offline",this.onofflineListener);
	},
	onofflineListener : function(){
		document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");

		if(navigator.onLine){
			//서버로 Sync 맞추기.
		}
	},
	add : function(todo,callback){

		if(navigator.onLine){
			var xhr = new XMLHttpRequest();
			xhr.open('PUT', this.url+this.id, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
			xhr.addEventListener("load",function(e) {
				if (this.status == 200) {
					callback(JSON.parse(this.responseText));
				}
			});
			xhr.send("todo="+todo);			
		}else{
			//data를 클라이언트에 저장. -> localStorage, indexedDB, websql
		}

	},
	completed : function(param,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', this.url+this.id+"/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			if (this.status == 200) {
				callback(JSON.parse(this.responseText));
			}
		});
		xhr.send("completed="+param.completed);
	},
	remove : function(key,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', this.url+this.id+"/"+key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			if (this.status == 200) {
				callback(JSON.parse(this.responseText));
			}
		});

		xhr.send();
	},
	get : function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.url+this.id, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			if (this.status == 200) {
				callback(JSON.parse(this.responseText));
			}
		});
		xhr.send();
	}
};

TODOSync.init();