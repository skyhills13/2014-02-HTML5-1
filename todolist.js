/*
# 네번째
1. 온라인 / 오프라인
	- 오프라인일 때 localStorage에 저장하기.
	- 온라인일 때 서버에 싱크 맞추기.

# 다섯번째
1. 뒤로 가기.
	- pushState활용하기.
2. 등록,삭제할 때 애니메이션 입히기
	- CSS3활용
*/
String.prototype.caplitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

var Ajax = {
	xhr : function(requestData, method, url, callback){
		if(navigator.onLine) {
			var request = new XMLHttpRequest();
			request.open(method, url, true );
			request.onload = function(){
				callback(JSON.parse(request.responseText));
			}
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
			request.send(requestData);
		} else {
			//data를 클라이언트에 저장 (로컬스토리지나 indexedDb사용)
			//NULL일때는 load할때나 delete할때. 
			if (requestData === null) {
				localStorage.setItem(method, method+","+url);
			} else {
				localStorage.setItem(requestData, method+","+url);
			}
			callback();
		}
	}
};
//db에 넣을 것을 로컬에 저장
//
var TodoList = {
	ENTER_KEYCODE : 13,
	newTodoEle : document.getElementById("new-todo"),
	todoListEle : document.getElementById("todo-list"),

	filtersEle : document.getElementById("filters"),
	headerEle : document.getElementById("header"),

	requestUrl : "http://ui.nhnnext.org:3333/skyhills13",
	currentFilterIndex : 0,

	hrefNIndex : 
	{
				"index.html" : 0,
				"active" : 1,
				"completed" : 2
	},

	init : function () {
		//DomContentLoaded에는 하나만 붙이는거야. 
		document.addEventListener("DOMContentLoaded", this.setEnvironments.bind(this));
	},

	setEnvironments : function(){
		this.addEvents();
		this.loadTodo();
	},

	addEvents: function(){
		this.newTodoEle.addEventListener("keydown",this.addToDo.bind(this));
		this.todoListEle.addEventListener("click", this.changeTodo.bind(this));
		this.filtersEle.addEventListener("click", this.changeFilter.bind(this));

		window.addEventListener("online", this.onofflineEvent.bind(this));
		window.addEventListener("offline", this.onofflineEvent.bind(this));
		window.addEventListener("popstate", this.changeHistory.bind(this));

	},
	changeHistory : function(e) {	
		if (e.state) {
			var method  = e.state.method;
			this.changeView(method, this.hrefNIndex[method]);
		} else {
			this.changeView("index.html",0);
		}
	},

	onofflineEvent : function(e) {
		document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
		// 이건 왜 안될까? 답 찾아라 
		// console.log(this.headerEle);
		// this.headerEle.classList[navigator.onLine?"remove":"add"]("offline");	
		if ( navigator.onLine ) {
			//서버로 싱크 맞추기 
			var keys = Object.keys(localStorage);
			for(var key in localStorage) {
				var value = localStorage[key];
				var methodNurl = value.split(",");
				if (key === "DELETE") {
					key = null;
				}
				console.log(methodNurl);
				Ajax.xhr(key, methodNurl[0], methodNurl[1], function(requestResult){
					if ( methodNurl[0] === "PUT") {
						this.todoListEle.lastChild.dataset.key = requestResult.insertId;
					} else if (methodNurl[0] === "POST") {
						console.log("check sync");
					} else if ( methodNurl[0] === "DELETE") {
						console.log("delete sync");
					}
				}.bind(this));
			}
			localStorage.clear();
		}
	},

	changeFilter : function(e) {
		var targetTagName = e.target.tagName.toUpperCase();
		var targetHref = e.target.getAttribute("href");
		if ( targetTagName == "A") {
			if ( targetHref ) {
				this.changeView(targetHref, this.hrefNIndex[targetHref]);
				history.pushState({ "method": targetHref }, null, targetHref);	
			}
		}
		e.preventDefault();
	},

	changeView: function( targetHref, targetFilterIndex ) {
		if (targetHref == "index.html") {
			this.todoListEle.className = "";
		}
		this.todoListEle.className = "all-" + targetHref;
		this.changeFilterStatus(targetFilterIndex);
	},

	changeFilterStatus : function(selectedFilterIndex) {
		var Filters = document.querySelectorAll("#filters a");
		Filters[this.currentFilterIndex].classList.remove("selected");
		
		Filters[selectedFilterIndex].classList.add("selected");
		this.currentFilterIndex = selectedFilterIndex; 
	},

	loadTodo : function(){
		var savedList ="";
		var callback = function(requestResult){
			for(var i = 0; i < requestResult.length ; ++i) {
				if ( requestResult[i].nickname === "skyhills13" ) {
					var compiled = _.template(
						"<li class = <%=COMPLETED%> data-key = <%=DATAKEY%> >"
						+	"<div class = \"view\">"
						+		"<input class=\"toggle\" type=\"checkbox\">"
						+		"<label><%=TODO%></label>"
						+		"<button class=\"destroy\"></button>"
						+	"</div>"
						+"</li>")
					var result = compiled({ COMPLETED:requestResult[i].completed, DATAKEY:requestResult[i].id, TODO:requestResult[i].todo});
					result = result.replace("class = 0" , "");
					result = result.replace("class = 1", "class = completed");
					savedList += result;
				} 
			}
			this.todoListEle.insertAdjacentHTML("beforeend", savedList);
		}.bind(this);
		Ajax.xhr ( null, "GET", this.requestUrl, callback);
	},

	addToDo : function(e) {
		if ( e.keyCode == this.ENTER_KEYCODE ) {
			var requestData = "todo=" + this.newTodoEle.value;
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
				var result = compiled({TODO:this.newTodoEle.value});
				this.todoListEle.insertAdjacentHTML("beforeend", result);
				if ( navigator.onLine ) {
					this.todoListEle.lastChild.dataset.key = requestResult.insertId;
				} else {
					console.log("offline");
				}
				//this.fadeEffect(this.todoListEle.lastChild, 300, 1);
				this.newTodoEle.value ="";	
			}.bind(this);
			Ajax.xhr(requestData, "PUT", this.requestUrl, callback.bind(this));
		}
	},

	changeTodo : function(e) {
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
		Ajax.xhr(null, "DELETE", this.requestUrl+"/"+param.key, callback);
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
		Ajax.xhr(requestData, "POST", this.requestUrl+"/"+param.key, callback);	
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
};

TodoList.init();