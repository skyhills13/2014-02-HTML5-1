// # 첫번째
// 1. 할일에 넣고 엔터를 치면 할일이 추가된다.
// 	- 이벤트를 할당한다.(addEventListener)
// 	- 할일을 추가한다.(appendChild,insertAdjacentHTML)

var ENTER_KEYCODE = 13;

function addToList(e){
	if ( e.keyCode == ENTER_KEYCODE ) {
		var eNewTodo = document.getElementById("new-todo");
		var eTodoList = document.getElementById("todo-list");

		//var template = document.getElementById("template");
		//var templateInnerHTML = template.innerHTML;
		//var compiled = _.template(templateInnerHTML);
		var compiled = _.template(
			"<li><div class = \"view\"><input class=\"toggle\" type=\"checkbox\"><label><%=TODO%></label><button class=\"destroy\"></button></div></li>")
		var result = compiled({TODO:eNewTodo.value});
		eTodoList.insertAdjacentHTML("beforeend", result);
		eNewTodo.value ="";
	}
}

function loadEvent (){
	document.getElementById("new-todo").addEventListener("keydown",addToList);	
}

document.addEventListener("DOMContentLoaded", loadEvent);


/* <html file에 <script type="text/template">로 format 만들어놓는 방법 */
	/* 아래 코드를 html file의 ul 태그 하위에 삽입 
	<script type = "text/template" id = "template">
		<li>
			<div class = "view">
				<input class="toggle" type="checkbox">
				<label><%=TODO%></label>
				<button class="destroy"></button>
			</div>
		</li>
	</script>
	*/
	/*	js file의 아래 부분 주석 해제 
		var template = document.getElementById("template");
		var templateInnerHTML = template.innerHTML;
		var compiled = _.template(templateInnerHTML);
	*/
