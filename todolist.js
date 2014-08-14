//foreach와 map의 차이를 공부하고 map을 사용한 개선


String.prototype.caplitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

var Ajax = {
	localStorageIndex : 0,
	xhr : function(requestData, method, url, callback){
		if(navigator.onLine) {
			var request = new XMLHttpRequest();
			request.open(method, url, true );
			request.onload = function(){
				callback(JSON.parse(request.responseText), method);
			}
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
			request.send(requestData);
		} else {
			localStorage.setItem(this.localStorageIndex, JSON.stringify(
																			{"method" : method,
																			"url" : url,
																			"requestData" : requestData}
																			));
			++this.localStorageIndex;
			callback();
		}
	}
};

var TODOOnoff = {
	init : function() {
		window.addEventListener("online", this.onofflineEvent.bind(this));
		window.addEventListener("offline", this.onofflineEvent.bind(this));
	},

	onofflineEvent : function(e) {
		document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
		// 이건 왜 안될까? 답 찾아라 
		// console.log(this.headerEle);
		// this.headerEle.classList[navigator.onLine?"remove":"add"]("offline");	
		if ( navigator.onLine ) {
			var ArrayIndex = 0; 
			var localStorageArray = [];
			var randomKeyNrealKey = {};
			for( var i = 0; i < Ajax.localStorageIndex ; ++i) {
				var localStorageValue = JSON.parse(localStorage[i]);
				var method = localStorageValue.method;
				var url = localStorageValue.url;
				for( randomKey in randomKeyNrealKey) {
					if (url.indexOf(randomKey) != -1 ) {
						url.replace(randomKey, randomKeyNrealKey[randomKey]);
					}
				}
				var requestData = localStorageValue.requestData;
				Ajax.xhr(requestData, method, url, function(requestResult, method){
					if ( method === "PUT") {
						//put일 경우, 랜덤으로 생성해서 넣어두었던 dataset key를 previous key에 저장하고,
						randomKeyNrealKey[TODOList.todoListEle.firstChild.dataset.key] = requestResult.insertId;
						//requestResult로 받은 값중에 id를 dataset key에다가 다시 넣고, 
						TODOList.todoListEle.firstChild.dataset.key = requestResult.insertId;
					}
				}.bind(this));
			}
			localStorage.clear();
		}
	}
};

var TODOHistory = {
	
	filtersEle : document.getElementById("filters"),
	currentFilterIndex : 0,
	hrefNIndex : 
	{
				"index.html" : 0,
				"active" : 1,
				"completed" : 2
	},

	init : function() {
		this.filtersEle.addEventListener("click", this.changeFilter.bind(this));
		window.addEventListener("popstate", this.changeHistory.bind(this));
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

	changeHistory : function(e) {	
		if (e.state) {
			var method  = e.state.method;
			this.changeView(method, this.hrefNIndex[method]);
		} else {
			this.changeView("index.html",0);
		}
	},

	changeView: function( targetHref, targetFilterIndex ) {
		if (targetHref == "index.html") {
			TODOList.todoListEle.className = "";
		}
		TODOList.todoListEle.className = "all-" + targetHref;
		this.changeFilterStatus(targetFilterIndex);
	},

	changeFilterStatus : function(selectedFilterIndex) {
		var filters = document.querySelectorAll("#filters a");
		filters[this.currentFilterIndex].classList.remove("selected");
		
		filters[selectedFilterIndex].classList.add("selected");
		this.currentFilterIndex = selectedFilterIndex; 
	}
};

var TODOList = {
	
	ENTER_KEYCODE : 13,
	newTodoEle : document.getElementById("new-todo"),
	todoListEle : document.getElementById("todo-list"),
	
	headerEle : document.getElementById("header"),

	requestUrl : "http://ui.nhnnext.org:3333/skyhills13",

	init : function(){
		this.newTodoEle.addEventListener("keydown",this.addTODO.bind(this));
		this.todoListEle.addEventListener("click", this.changeTODO.bind(this));
		this.loadTODO();
	},

	loadTODO : function(){
		localStorage.clear(); //load도 offline sync 구현시 이 라인은 삭제할 것 
		//삭제 후, 적당한 시기에 clear할 것.
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

	addTODO : function(e) {
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
					+"</li>");
				var result = compiled({TODO:this.newTodoEle.value});
				this.todoListEle.insertAdjacentHTML("afterbegin", result);
				this.todoListEle.firstChild.dataset.key = navigator.onLine ? requestResult.insertId : Math.floor((Math.random()*500000 ) + 400000);
				//Util.fadeEffect(this.todoListEle.fisrtChild, 300, 1);
				this.newTodoEle.value ="";	
			}.bind(this);
			Ajax.xhr(requestData, "PUT", this.requestUrl, callback.bind(this));
		}
	},

	changeTODO : function(e) {
		var inputEle = e.target;
		var li = inputEle.parentNode.parentNode;
		var completed = inputEle.checked?"1":"0";
		var sNodeNameInput = inputEle.nodeName.toUpperCase();
		var sNodeNameButton = inputEle.nodeName.toUpperCase();
		var param = {
			"key" : li.dataset.key,
			"completed" : completed 
		};

		if( sNodeNameInput == "INPUT") {
			this.checkTODO(li, param, completed);
		} else if (sNodeNameButton == "BUTTON") {
			this.deleteTODO(li, param);
		} else {
			return;
		}
	},
	deleteTODO: function(li, param){
		var callback = function(){
			/*javascript로 fadeEffect사용시, 아래의 코드 5줄은 주석처리후 fadeEffect 주석 해제*/
			li.className = "old";
			var removeElement = function(){
				li.parentNode.removeChild(li);
			};
			li.addEventListener("webkitAnimationEnd", removeElement ,false);
		};
		Ajax.xhr(null, "DELETE", this.requestUrl+"/"+param.key, callback);
	},

	checkTODO : function(li, param, completed) {
		var callback = function(){
			if(completed === "1"){
				li.className = "completed";
			} else {
				li.className = "";
			}
		};
		var requestData = "completed=" + param.completed;
		Ajax.xhr(requestData, "POST", this.requestUrl+"/"+param.key, callback);	
	}
};

var Util = {
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

document.addEventListener("DOMContentLoaded", function(){
	TODOList.init();
	TODOHistory.init();
	TODOOnoff.init();
});