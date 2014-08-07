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

	eFilters : document.getElementById("filters"),
	eHeader : document.getElementById("header"),

	requestUrl : "http://ui.nhnnext.org:3333/skyhills13",
	currentFilterIndex : 0,

	init : function () {
		//DomContentLoaded에는 하나만 붙이는거야. 
		document.addEventListener("DOMContentLoaded", this.setEnvironments.bind(this));
	},

	setEnvironments : function(){
		this.addEvents();
		this.loadTodo();
	},

	addEvents: function(){
		this.eNewTodo.addEventListener("keydown",this.addToDo.bind(this));
		this.eTodoList.addEventListener("click", this.changeTodo.bind(this));
		this.eFilters.addEventListener("click", this.changeFilter.bind(this));

		window.addEventListener("online", this.onofflineEvent );
		window.addEventListener("offline", this.onofflineEvent );
		window.addEventListener("popstate", this.changeHistory.bind(this));

	},
	changeHistory : function(e) {	
		if (e.state) {
			var method  = e.state.method.caplitalize();
			console.log(method);
			console.log("view"+method);
			this["view"+method]();
		} else {
			this.viewAll();
		}
	},

	onofflineEvent : function(e) {
		document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
		//이건 왜 안될까? 답 찾아라 
		// console.log(this.eHeader);
		// this.eHeader.classList[navigator.onLine?"remove":"add"]("offline");	

	},

	changeFilter : function(e) {
		var targetTagName = e.target.tagName.toUpperCase();
		var targetHref = e.target.getAttribute("href");
		if ( targetTagName == "A") {
			if (targetHref === "active") {
				this.viewActive();
			} else if ( targetHref === "completed") {
				this.viewCompleted();
			} else {
				this.viewAll();
			}
		}
		e.preventDefault();
	},

	viewAll : function () {
		this.eTodoList.className = "";
		this.changeFilterStatus ( 0 );
		history.pushState({"method": "all"}, null , "index.html");
	},

	viewActive : function() {
		this.eTodoList.className = "all-active";
		this.changeFilterStatus ( 1 );
		history.pushState({"method": "active"}, null , "active");
		console.log(history);
	},

	viewCompleted : function () {
		this.eTodoList.className = "all-completed";
		this.changeFilterStatus ( 2 );
		history.pushState({"method": "completed"}, null , "completed");
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