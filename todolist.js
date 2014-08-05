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

var ajax = {
	xhr : function(requestData, method, url, callback){
		var request = new XMLHttpRequest();
		request.open(method, url, true );
		request.onload = function(){
			callback(JSON.parse(request.responseText));
		}
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		request.send(requestData);
	}
}

var todoList = {
	ENTER_KEYCODE : 13,
	eNewTodo : document.getElementById("new-todo"),
	eTodoList : document.getElementById("todo-list"),
	requestUrl : "http://ui.nhnnext.org:3333/skyhills13",

	init : function () {
		//DomContentLoaded에는 하나만 붙이는거야. 
		document.addEventListener("DOMContentLoaded", this.setEnvironments.bind(this));
	},

	setEnvironments : function(){
		this.addEvents();
		this.loadTodo();
	},

	addEvents: function(){
		/*script tag를 html file 상단에 넣었을 경우 
		this.eNewTodo = document.getElementById("new-todo");
		this.eTodoList = document.getElementById("todo-list"); */
		this.eNewTodo.addEventListener("keydown",this.addToDo.bind(this));
		this.eTodoList.addEventListener("click", this.delegateClick.bind(this));
	},

	loadTodo : function(){
		var savedList ="";
		var callback = function(requestResult){
			for(var i = 0; i < requestResult.length ; ++i) {
				if ( requestResult[i].nickname === "skyhills13" ) {
					var compiled = _.template(
						"<li class =\"created\" data-key = <%=DATAKEY%> >"
						+	"<div class = \"view\">"
						+		"<input class=\"toggle\" type=\"checkbox\">"
						+		"<label><%=TODO%></label>"
						+		"<button class=\"destroy\"></button>"
						+	"</div>"
						+"</li>")
					var result = compiled({DATAKEY:requestResult[i].id, TODO:requestResult[i].todo});
					savedList += result;
				} 
			}
			this.eTodoList.insertAdjacentHTML("beforeend", savedList);
		}.bind(this);
		ajax.xhr ( null, "GET", this.requestUrl, callback);

	},

	addToDo : function(e) {
		if ( e.keyCode == this.ENTER_KEYCODE ) {
			var requestData = "todo=" + this.eNewTodo.value;
			var callback = function(requestResult) {
				/*javascript로 실행시 li class의 created 지울 것 */
				var compiled = _.template(
					"<li class =\"created\">"
					+ 	"<div class = \"view\">"
					+ 		"<input class=\"toggle\" type=\"checkbox\">"
					+ 		"<label><%=TODO%></label>"
					+ 		"<button class=\"destroy\"></button>"
					+	"</div>"
					+"</li>")
				var result = compiled({TODO:this.eNewTodo.value});
				this.eTodoList.insertAdjacentHTML("beforeend", result);
				this.eTodoList.lastChild.dataset.key = requestResult.insertId;
				//this.fadeEffect(this.eTodoList.lastChild, 300, 1);
				this.eNewTodo.value ="";	
			}.bind(this);
			ajax.xhr(requestData, "PUT", this.requestUrl, callback.bind(this));
		}
	},

	delegateClick : function(e) {
		var eInput = e.target;
		var eLi = eInput.parentNode.parentNode;
		var completed = eInput.checked?"1":"0";
		var sNodeNameInput = eInput.nodeName.toUpperCase();
		var sNodeNameButton = eInput.nodeName.toUpperCase();
		var param = {
			"key" : eLi.dataset.key,
			"completed" : completed 
		};

		if( sNodeNameInput == "INPUT") {
			this.checkTodo(eLi, param, completed);
		} else if (sNodeNameButton == "BUTTON") {
			this.deleteTodo(eLi, param);
		} else {
			return;
		}
	},
	deleteTodo: function(eLi, param){
		var callback = function(){
			/*javascript로 fadeEffect사용시, 아래의 코드 5줄은 주석처리후 fadeEffect 주석 해제*/
			eLi.className = "old";
			var removeElement = function(){
				eLi.parentNode.removeChild(eLi);
			};
			eLi.addEventListener("webkitAnimationEnd", removeElement ,false);
			};
		ajax.xhr(null, "DELETE", this.requestUrl+"/"+param.key, callback);
	},

	checkTodo : function(eLi, param, completed) {
		var callback = function(){
			if(completed === "1"){
				eLi.className = "completed";
			} else {
				eLi.className = "";
			}
		};
		var requestData = "completed=" + param.completed;
		ajax.xhr(requestData, "POST", this.requestUrl+"/"+param.key, callback);	
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
		};
		var fading = window.setInterval(execute.bind(this, direction, function(){
			element.style.display = "none";
			element.parentNode.removeChild(element);
		}), interval);	
	}
}

todoList.init();