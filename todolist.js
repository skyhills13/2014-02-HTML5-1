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

//send의 param이 없는 애끼리 묶을 것인가 
//url이 같은 애들끼리 묶을 것인가
var oAjax = {
	xhr : function(oParam, method, url, callback){
		var sRequestParam = "";
		if ( method == "GET") {
			sRequestParam = null;
		} else if ( method == "PUT") {
			sRequestParam = "todo=" + oParam.todo;
		} else if (method == "POST") {
			sRequestParam = "completed=" + oParam.completed;
		} else {
			sRequestParam = null;
		}
		var request = new XMLHttpRequest();
		request.open(method, url, true );
		request.onload = function(){
			callback(JSON.parse(request.responseText));
		}
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		request.send(sRequestParam);
	}
}

var oTodoList = {
	ENTER_KEYCODE : 13,
	eNewTodo : document.getElementById("new-todo"),
	eTodoList : document.getElementById("todo-list"),
	sRequestUrl : "http://ui.nhnnext.org:3333/skyhills13",

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

	insertElement : function(todo, nKey){
		var compiled = _.template(
			"<li class =\"created\"><div class = \"view\"><input class=\"toggle\" type=\"checkbox\"><label><%=TODO%></label><button class=\"destroy\"></button></div></li>")
		var result = compiled({TODO:todo});
		this.eTodoList.insertAdjacentHTML("beforeend", result);
		this.eTodoList.lastChild.dataset.key = nKey;
	},

	//TODO:새로고침했을 때 순서가 엉망으로 들어가는 문제 
	loadTodo : function(){

		var callback = function(oResult){
			for(var i = 0; i < oResult.length ; ++i) {
				if ( oResult[i].nickname === "skyhills13" ) {
					//console.log(oResult[i].id);
					this.insertElement(oResult[i].todo, oResult[i].id);
				} 
			}
		}.bind(this);
		oAjax.xhr ( null, "GET", this.sRequestUrl, callback);

	},

	addToList : function(e) {
		if ( e.keyCode == this.ENTER_KEYCODE ) {
			/* 여기서 이것을 callback으로 사용하는 이유는, ajax가 비동기로 실행되기 때문.
			callback함수 내부에 있는 내용이, ajax와 별도로 실행되어서, ajax는 실패했는데 
			dom(겉모습)은 생기는 경우가 있을 수 있기 때문  
			*/
			var oParam = {
				"todo" : this.eNewTodo.value
			}
			var callback = function(oResult) {
				/*javascript로 실행시 li class의 created 지울 것 */
				this.insertElement(this.eNewTodo.value, oResult.insertId);
				//this.fadeEffect(this.eTodoList.lastChild, 300, 1);
				this.eNewTodo.value ="";	
			}.bind(this);
			oAjax.xhr(oParam, "PUT", this.sRequestUrl, callback.bind(this));
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
			var callback = function(){
				if(completed === "1"){
					eLi.className = "completed";
				} else {
					eLi.className = "";
				}
			}
			oAjax.xhr(oParam, "POST", this.sRequestUrl+"/"+oParam.key, callback);	
 		} else if( sNodeNameButton == "BUTTON" ){
 			var callback = function(){
 				/*javascript로 fadeEffect사용시, 아래의 코드 5줄은 주석처리후 fadeEffect 주석 해제*/
				eLi.className = "old";
				setTimeout(function(){ 
					eLi.style.display = "none";
					eLi.parentNode.removeChild(eLi);
				}, 400);
				//this.fadeEffect(eLi, 200, -1);		
 			}
 			oAjax.xhr(oParam, "DELETE", this.sRequestUrl+"/"+oParam.key, callback);
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