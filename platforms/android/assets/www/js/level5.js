board = []; //to store the rows as lists, starting from top to bottom
board[0]=[[3,1,1,3],[1,1,3,1],[3,3,1,1],[3,3,1,3]];//border-width in px. direction: clockwise starting from top
board[1]=[[1,1,1,3],[3,3,3,1],[1,1,3,3],[1,3,1,1]];
board[2]=[[1,1,1,3],[1,1,1,1],[3,3,1,1],[1,3,1,1]];
board[3]=[[1,3,3,3],[1,1,3,3],[1,1,3,1],[1,3,3,1]];

//initial positions of Theseus, the Minotaur, and the Exit.
var ip_t = "d44";
var ip_m = "d11";
var ip_e = "d12";


function printboard(b){
var row_max = board.length; //how many rows in total
var col_max = board[0].length; //how many columns in total
var row = 0;
var col = 0;

//creating a node for the table.
var table = document.createElement("table");

//a loop that makes each row
for (row = 0; row < row_max; row++){
var rowNode = document.createElement("tr");

  //a loop that makes each data cell within one row
  for(col = 0; col < col_max; col++){
  var d = document.createElement("td");
  d.id = "d" + (row + 1) + (col + 1); //give an id to each of the data cell
  d.style.borderTopWidth = board[row][col][0] + "px"; //specify the border-width
  d.style.borderRightWidth = board[row][col][1] + "px";
  d.style.borderBottomWidth = board[row][col][2] + "px";
  d.style.borderLeftWidth = board[row][col][3] + "px";
  rowNode.appendChild(d);
};
table.appendChild(rowNode);};

document.getElementById("board").appendChild(table);

//Put Theseus(T), the Minotaur(M), and the Exit(E) on the board
var t = document.createElement("img");
	t.src = "img/T.gif";
	t.id = "Theseus";
	document.getElementById(ip_t).appendChild(t);
	
var m = document.createElement("img");
	m.src = "img/M.gif";
	m.id = "Minotaur";
	document.getElementById(ip_m).appendChild(m);

document.getElementById(ip_e).style.background = "#D8D8D8";
	
make_clickable();
};

//To get the location(l) Theseus(t) is at
function get_t(){
//Get the id of the table cell Theseus is at.
	var lt_id = document.getElementById("Theseus").parentNode.id;
//	alert("Theseus is at " + lt_id); //for testing
	var t_row = parseInt(lt_id[1]);
	var t_col = parseInt(lt_id[2]);
	var lt = document.getElementById(lt_id);
	return [lt, t_row, t_col];
}

//To get the location(l) the Minotaur(m) is at
function get_m(){
//Firstly, get the id of the table cell the Minotaur is at;
	var lm_id = document.getElementById("Minotaur").parentNode.id;
	var m_row = parseInt(lm_id[1]);
	var m_col = parseInt(lm_id[2]);
	var lm = document.getElementById(lm_id);
	return [lm, m_row, m_col];
}

function make_clickable(){
//make Theseus clickable
	var t = document.getElementById("Theseus");
	t.onclick = move_m;

//make cells surrounding Theseus clickable
//Firstly, get the id of the table cell Theseus(t) is at;
	var result = get_t();
	var lt = result[0];
	var row_current = result[1];
	var col_current = result[2];

//Secondly, check borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth of the table cell 
//so as to make bordering cells that can be entered by Theseus (without wall in between) clickable
	if (lt.style.borderTopWidth === "1px") {
		var up = document.getElementById("d" + (row_current-1) + col_current);
		up.onclick = move_t;
		up.setAttribute("class", "clickable");};
	if (lt.style.borderRightWidth === "1px") {
		var right = document.getElementById("d" + row_current + (col_current+1));
		right.onclick = move_t;
		right.setAttribute("class","clickable");}; 
	if (lt.style.borderBottomWidth === "1px") {
		var down = document.getElementById("d" + (row_current+1) + col_current);
		down.onclick = move_t;
		down.setAttribute("class","clickable");};
	if (lt.style.borderLeftWidth === "1px") {
		var left = document.getElementById("d" + row_current + (col_current-1));
		left.onclick = move_t;
		left.setAttribute("class","clickable");};
		
//Thirdly, make the Minotaur's table cell unclickable
	var lm = get_m()[0];
	lm.onclick = null;
}


function move_t(evt) {
//remove Theseus from previous location.
	var remove_t = document.getElementById("Theseus"); 
	remove_t.parentNode.removeChild(remove_t);
//relocate Theseus to new location.	
	newloc_t = evt.target;
	var t = document.createElement("img");
	t.src = "img/T.gif";
	t.id = "Theseus";
	t.onclick = move_m;
	newloc_t.appendChild(t);
//disable all onclicks
	var remove_click = document.getElementsByClassName("clickable");
	while (remove_click.length > 0) {
		remove_click[0].onclick = null;
		remove_click[0].className = "";
	};

//move the Minotaur
move_m();
		
}


function move_m() {
//Firstly, get the location of Theseus
	var result_t = get_t();
	var lt = result_t[0];
	var t_row = result_t[1];
	var t_col = result_t[2];

//Secondly, get the location of the Minotaur
	var result_m = get_m();
	var lm = result_m[0];
	var m_row = result_m[1];
	var m_col = result_m[2];

//Calculate the distance between M and T
	var hor = t_col - m_col; //distance on x axis
	var ver = t_row - m_row; //distance on y axis
	
//The Minotaur counts and moves, unless he has already moved up to 2 steps or if he has already hit Theseus
MWIN = false;
TWIN = false;
counter = 0; //to counter the step of the Minotaur
while (!MWIN && counter < 2) { 
//The Minotaur calculates where he is going to end up ==> the new "lm"
	if (hor>0) {if (lm.style.borderRightWidth === "1px") {
		m_col = m_col+1;
		lm = document.getElementById("d" + m_row + m_col);} else {if ((ver<0) && (lm.style.borderTopWidth === "1px")){
		m_row = m_row -1;
		lm = document.getElementById("d" + m_row + m_col);} else if ((ver>0) && (lm.style.borderBottomWidth === "1px")) {
		m_row = m_row+1;
		lm = document.getElementById("d" + m_row + m_col);
		}
		}
	}
		
	else if (hor<0) {if (lm.style.borderLeftWidth === "1px") {
		m_col = m_col-1;
		lm = document.getElementById("d" + m_row + m_col);} else {if ((ver<0) && (lm.style.borderTopWidth === "1px")){
		m_row = m_row -1;
		lm = document.getElementById("d" + m_row + m_col);} else if ((ver>0) && (lm.style.borderBottomWidth === "1px")) {
		m_row = m_row+1;
		lm = document.getElementById("d" + m_row + m_col);
		}
		}
	}
		
	else if ((hor===0) && (ver>0) && (lm.style.borderBottomWidth === "1px")) {
			m_row = m_row+1;
			lm = document.getElementById("d" + m_row + m_col);
		}
		
	else if ((hor===0) && (ver<0) && (lm.style.borderTopWidth === "1px")) {
			m_row = m_row-1;
			lm = document.getElementById("d" + m_row + m_col);
		}
		
	else {
	//Check if Theseus has won
	if (lt === document.getElementById(ip_e)) {
		msg = document.getElementById("message");
		msg.innerHTML = "Congratulations! Theseus has successfully escaped!";
		document.getElementById("Theseus").onclick = null;
		next();
		TWIN = true;
		break;} 
	make_clickable()}; //else he will just wait. Give the chance back to Theseus then.
	
	var hor = t_col - m_col;
	var abs_hor = Math.abs(hor); //distance on x axis
	var ver = t_row - m_row;
	var abs_ver = Math.abs(ver); //distance on y axis
	
//The Minotaur sees if Theseus is already on his way, and makes his actual move
	if (lm !== lt) { 
	//if Theseus is not within reach, then Minotaur will be removed from his previous location.
		var remove_m = document.getElementById("Minotaur"); 
		remove_m.parentNode.removeChild(remove_m);	
		} else { //If Theseus is within reach of the Minotaur...
		MWIN = true;
		var msg = document.getElementById("message");
		msg.innerHTML = "Sorry, but the Minotaur won...";
	//Remove Theseus from the board
		var remove_t = document.getElementById("Theseus"); 
		remove_t.parentNode.removeChild(remove_t);
	//Remove previous Minotaur from the board
		var remove_m = document.getElementById("Minotaur");
		remove_m.parentNode.removeChild(remove_m);
	}
	
	//Place the Minotaur	
		var m = document.createElement("img");
		m.src = "img/M.gif";
		m.id = "Minotaur";
		lm.appendChild(m);	
	
	counter = counter+1;
};
if (!MWIN && !TWIN){
	//Check if Theseus has won
	if (lt === document.getElementById(ip_e)) {
		msg = document.getElementById("message");
		msg.innerHTML = "Congratulations! Theseus has successfully escaped!";
		document.getElementById("Theseus").onclick = null;
		next();} else {
	make_clickable();}
	} else if (MWIN){
	replay();
	}
}	

function replay(){
	var btn = document.createElement("input");
	btn.type = "button";
	btn.value = "Replay";
	btn.onclick = function(){document.location.reload();}
	document.getElementById("button").appendChild(btn);
}

function next(){ 
	var link = document.createElement("a");
	link.href = "level1.html";
	var btn = document.createElement("button");
	btn.type = "button";
	btn.value = "Next Level";
	btn.innerHTML = "Level 1";
	document.getElementById("button").appendChild(link);
	link.appendChild(btn);
}
