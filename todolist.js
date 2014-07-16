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

var ENTER_KEYCODE = 13;

function addToList(e){
	if ( e.keyCode == ENTER_KEYCODE ) {
		var eNewTodo = document.getElementById("new-todo");
		var eTodoList = document.getElementById("todo-list");

		var compiled = _.template(
			"<li><div class = \"view\"><input class=\"toggle\" type=\"checkbox\"><label><%=TODO%></label><button class=\"destroy\"></button></div></li>")
		var result = compiled({TODO:eNewTodo.value});
		eTodoList.insertAdjacentHTML("beforeend", result);
		//fadeEffect(eTodoList.lastChild, 300, "in");
		eNewTodo.value ="";
	}
}

function checkTodo(e){
	var eInput = e.target;
	var eLi = eInput.parentNode.parentNode;

	if(eInput.nodeName == "INPUT" ){
		if(eInput.checked){
			eLi.className = "completed";
		} else {
			eLi.className = "";
		}
	} else if(eInput.nodeName == "BUTTON" ){
		fadeEffect(eLi, 200, "out");
	}
}

function fadeEffect(element, totalTime, direction){
	var opacity = 0;
	var interval = 10;
	var gap = interval / totalTime;	
	
	if ( direction === "in"){
		function func() {
			opacity +=gap;
			element.style.opacity = opacity;

			if(opacity >= 1) {
				window.clearInterval(fading);
			}
		}
	} else if ( direction === "out"){
		var opacity = 1;
		var interval = 10;
		function func() {
			opacity -=gap;
			element.style.opacity = opacity;

			if(opacity <= 0) {
				window.clearInterval(fading);
				element.style.display = "none";
				element.parentNode.removeChild(element);
			}
		}
	}
	var fading = window.setInterval(func, interval);	
}

function loadEvent (){
	document.getElementById("new-todo").addEventListener("keydown",addToList);
	document.querySelector("ul").addEventListener("click", checkTodo);
}

document.addEventListener("DOMContentLoaded", loadEvent);
