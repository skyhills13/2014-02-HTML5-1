/*
# 세번째
1. 코드 개선하기.
	- 오브젝트 형식으로.
2. 서버와 연동하기.
	- 추가할 때 API랑 연동하기.
	- 완료할 때 API랑 연동하기.
	- 삭제할 때 API랑 연동하기.
	- 가져올 때 API랑 연동하기.
#기타 응답값
{
	"fieldCount":0,
	"affectedRows":1,
	"insertId":0,
	"serverStatus":2,
	"warningCount":0,
	"message":"(Rows matched: 1 Changed: 1 Warnings: 0",
	"protocol41":true,
	"changedRows":1
}
#GET 응답값
[
{"id":2,"todo":"hi","nickname":"mixed","completed":0,"date":"2014-06-25T05:38:12.000Z"},
{"id":3,"todo":"안녕","nickname":"mixed","completed":0,"date":"2014-06-25T05:38:55.000Z"}
] 
*/

var oAjax = {
	add : function(TODO, callback){
		var request = new XMLHttpRequest();
		var addNgetUrl = "http://ui.nhnnext.org:3333/skyhills13";
		request.open("PUT", addNgetUrl, true );
		request.onload = function () {
			//2. 요청에 대한 응답값을 인자로 받아서 callback에서 사용
			callback(JSON.parse(request.responseText));
		}
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		//request.setRequestHeader("Access-Control-Allow-Origin", "*");
		//1.여기서 요청을 보내고
		request.send("todo="+TODO);
		
	},
	complete : function (oParam, callback ){
		var request = new XMLHttpRequest();
		var compNremoveUrl = "http://ui.nhnnext.org:3333/skyhills13/"+oParam.key;
		request.open("POST", compNremoveUrl, true );
		request.onload = function () {
			callback(JSON.parse(request.responseText));
		}
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		//request.setRequestHeader("Access-Control-Allow-Origin", "*");
		request.send("completed="+oParam.completed);
			
	},
	remove : function (oParam, callback) {
		var request = new XMLHttpRequest();
		var compNremoveUrl = "http://ui.nhnnext.org:3333/skyhills13/"+oParam.key;
		request.open("DELETE", compNremoveUrl, true );
		request.onload = function () {
			callback();
		}
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		//request.setRequestHeader("Access-Control-Allow-Origin", "*");
		request.send();
	},
	get : function (callback) {
		var addNgetUrl = "http://ui.nhnnext.org:3333/skyhills13";
		var request = new XMLHttpRequest();
		request.open("GET", addNgetUrl, true);
		request.onload = function() {
			var oResult = JSON.parse(request.responseText); 
			callback(oResult);
		}
		request.setRequestHeader("Content-Type", "application/xml; charset=utf-8");
		//request.setRequestHeader("Access-Control-Allow-Origin", "*");
		request.send();
	}
}

var oTodoList = {
	ENTER_KEYCODE : 13,
	eNewTodo : document.getElementById("new-todo"),
	eTodoList : document.getElementById("todo-list"),

	init : function () {
		document.addEventListener("DOMContentLoaded", this.addEvents.bind(this));
		document.addEventListener("DOMContentLoaded", this.loadTodo.bind(this));
	},

	addEvents: function(){
		/*script tag를 html file 상단에 넣었을 경우 
		this.eNewTodo = document.getElementById("new-todo");
		this.eTodoList = document.getElementById("todo-list"); */
		this.eNewTodo.addEventListener("keydown",this.addToList.bind(this));
		this.eTodoList.addEventListener("click", this.checkTodo.bind(this));		
	},

	loadTodo : function(){

		oAjax.get(function(oResult){
			var oMyTodo = {};
			//console.log(oResult.length);
			for(var i = 0; i < oResult.length ; ++i) {
				if ( oResult[i].nickname === "skyhills13" ) {
					//console.log(oResult[i].id);
					var compiled = _.template(
						"<li class =\"created\"><div class = \"view\"><input class=\"toggle\" type=\"checkbox\"><label><%=TODO%></label><button class=\"destroy\"></button></div></li>")
					var result = compiled({TODO:oResult[i].todo});
					this.eTodoList.insertAdjacentHTML("beforeend", result);
					this.eTodoList.lastChild.dataset.key = oResult[i].id;
				} 
			}
		}.bind(this));
	},

	addToList : function(e) {
		if ( e.keyCode == this.ENTER_KEYCODE ) {
			/*여기서 이것을 callback으로 사용하는 이유는, ajax가 비동기로 실행되기 때문.
			callback함수 내부에 있는 내용이, ajax와 별도로 실행되어서, ajax는 실패했는데 
			dom(겉모습)은 생기는 경우가 있을 수 있기 때문  
			*/
			oAjax.add(this.eNewTodo.value, function(json){
				/*javascript로 실행시 li class의 created 지울 것 */
				var compiled = _.template(
					"<li class =\"created\"><div class = \"view\"><input class=\"toggle\" type=\"checkbox\"><label><%=TODO%></label><button class=\"destroy\"></button></div></li>")
				var result = compiled({TODO:this.eNewTodo.value});
				this.eTodoList.insertAdjacentHTML("beforeend", result);
				this.eTodoList.lastChild.dataset.key = json.insertId;
				//this.fadeEffect(this.eTodoList.lastChild, 300, 1);
				this.eNewTodo.value ="";	
			}.bind(this));	
			//bind를 하지 않을경우, 위에있는 this는 oAjax야. oAjax가 불렀쟈나
			//했기 때문에 여기 context라서 this는 oTodoList야 
		}
	},

	checkTodo : function(e) {
		var eInput = e.target;
		var eLi = eInput.parentNode.parentNode;
		var completed = eInput.checked?"1":"0";
		var sNodeNameInput = eInput.nodeName.toUpperCase();
		var sNodeNameButton = eInput.nodeName.toUpperCase();
		var oParam = {
			"key" : eLi.dataset.key,
			"completed" : completed 
		}
		if(sNodeNameInput == "INPUT" ) {
			oAjax.complete(oParam, function(){
				if(completed === "1"){
					eLi.className = "completed";
				} else {
					eLi.className = "";
				}
			}.bind(this));
 		} else if( sNodeNameButton == "BUTTON" ){
 			oAjax.remove(oParam, function(){
 				/*javascript로 fadeEffect사용시, 아래의 코드 5줄은 주석처리후 fadeEffect 주석 해제*/
				eLi.className = "old";
				setTimeout(function(){ 
					eLi.style.display = "none";
					eLi.parentNode.removeChild(eLi);
				}, 400);
				//this.fadeEffect(eLi, 200, -1);
 			});
		}	
	},
	fadeEffect : function(element, totalTime, direction){
		var opacity = 0.5 - (direction * 0.5);
		var interval = 10;
		var gap = interval / totalTime * direction;	

		var execute = function (nDirection, func) {
			opacity += gap;
			element.style.opacity = opacity;
			if ( (opacity >= 1) || ( opacity <= 0)) {
				window.clearInterval(fading);
				if ( nDirection === -1) {
					func();
				}	
			}
		}

		var fading = window.setInterval(execute.bind(this, direction, function(){
			element.style.display = "none";
			element.parentNode.removeChild(element);
		}), interval);	
	}
}

oTodoList.init();