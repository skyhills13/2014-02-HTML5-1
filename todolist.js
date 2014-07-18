/*
# 두번째
1. 등록한 할일을 완료처리하기.
	- 이벤트 할당하기.
	- class추가하기(li에 completed)
2. 삭제하기
	- 이벤트 할당하기.
	- li을 서서히 사라지게 처리한 후 삭제.
3. 등록하기
	- 애니메이션 기능을 추가.
*/

var oTodoList = {
	ENTER_KEYCODE : 13,
	eNewTodo : document.getElementById("new-todo"),
	eTodoList : document.getElementById("todo-list"),

	init : function () {
		
		document.addEventListener("DOMContentLoaded", this.addEvents.bind(this));
	},

	addEvents: function(){
		/*script tag를 html file 상단에 넣었을 경우 
		this.eNewTodo = document.getElementById("new-todo");
		this.eTodoList = document.getElementById("todo-list"); */
		this.eNewTodo.addEventListener("keydown",this.addToList.bind(this));
		this.eTodoList.addEventListener("click", this.checkTodo.bind(this));		
	},

	addToList : function(e) {
		if ( e.keyCode == this.ENTER_KEYCODE ) {
			/*javascript로 실행시 li class의 created 지울 것 */
			var compiled = _.template(
				"<li class =\"created\"><div class = \"view\"><input class=\"toggle\" type=\"checkbox\"><label><%=TODO%></label><button class=\"destroy\"></button></div></li>")
			var result = compiled({TODO:this.eNewTodo.value});
			this.eTodoList.insertAdjacentHTML("beforeend", result);
			//this.fadeEffect(this.eTodoList.lastChild, 300, 1);
			this.eNewTodo.value ="";
		}
	},

	checkTodo : function(e) {
		var eInput = e.target;
		var eLi = eInput.parentNode.parentNode;
		var sNodeNameInput = eInput.nodeName.toUpperCase();
		var sNodeNameButton = eInput.nodeName.toUpperCase();

		if(sNodeNameInput == "INPUT" ){
			if(eInput.checked){
				eLi.className = "completed";
			} else {
				eLi.className = "";
			}
		} else if( sNodeNameButton == "BUTTON" ){
			/*javascript로 fadeEffect사용시, 아래의 코드 5줄은 주석처리후 fadeEffect 주석 해제*/
			eLi.className = "old";
			setTimeout(function(){ 
				eLi.style.display = "none";
				eLi.parentNode.removeChild(eLi);
			}, 400);
			//this.fadeEffect(eLi, 200, -1);
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