var turn = "X";
var lastMove = -1;
var playerColors={
  "X":"bg-primary",
  "O":"bg-danger"
}

$(document).ready(function() {
  var smallboardcontents =
    '<table class="smallboard"><tr><td class="border-0"></td><td class="border-top-0"></td><td class="border-0"></td></tr><tr><td class="border-left-0"></td><td class="border-0"></td><td class="border-right-0"></td></tr><tr><td class="border-0"></td><td class="border-bottom-0"></td><td class="border-0"></td></tr></table>';
  var bigboard = $(smallboardcontents);
  bigboard.addClass("bigboard");
  bigboard.removeClass("smallboard");
  bigboard.find("td").html(smallboardcontents);
  $("body").html("<h1 class='text-center'>Venkat's Ultimate Tic Tac Toe</h1><br>");
  $("body").append(bigboard);

  $("table").addClass("rounded");
  $("td").addClass("border border-dark p-3");
  $(".bigboard").addClass("mx-auto");
  $(".smallboard").find("td").html("<pre> </pre>");

  $(".smallboard").find("td").click(function(){
    var moveIndex = getSpaceIndex(this);
    var parentBox = getParentBox(this);
    if(isValidMove(moveIndex)){
      $("td").removeClass("text-success");
      $(this).html(turn);
      $(this).addClass("text-success");
      lastMove=moveIndex;
      if(isBoxWon(turn, parentBox)){
        parentBox.addClass(playerColors[turn]);
        parentBox.addClass("won");
        if(isBoardWon(turn)) displayWinner(turn);
      }
      else if(!(parentBox.hasClass("won")||hasBlank(parentBox))){
          parentBox.addClass("bg-secondary");
      }
      turn = otherLetter(turn);
    }
  });
});

function displayWinner(turn){
  $("body").append("<h1 class='text-center'>"+turn+" Wins!</h1>");
  $("td").off();
}

function isBoxWon(letter, box){
  if(box.hasClass("won")) return false;
  var spaces=box.text();
  for(var i = 0;i<3;i++){
    if(spaces[3*i]==spaces[3*i+1]&&spaces[3*i+1]==spaces[3*i+2]&&spaces[3*i]==letter) return true;
    if(spaces[i]==spaces[3+i]&&spaces[3+i]==spaces[6+i]&&spaces[i]==letter) return true;
  }
  if(spaces[0]==spaces[4]&&spaces[4]==spaces[8]&&spaces[0]==letter) return true;
  if(spaces[2]==spaces[4]&&spaces[4]==spaces[6]&&spaces[2]==letter) return true;
  return false;
}

function isValidMove(moveIndex){
  console.log(moveIndex);
  var moveDOM = getSpaceFromIndex(moveIndex);
  var newBox = getBoxFromIndex(lastMove%9);
  console.log("d");
  if(lastMove==-1) return true;
  if(isSpaceFull(moveIndex)){ 
    console.log("a");
    return false;
  }
  console.log("e");
  if(!boxContains(newBox,moveDOM)){
    return !hasBlank(newBox);
  }
  console.log("c");
  return true;
}

function boxContains(boxDOM,spaceDOM){
  return boxDOM.find(spaceDOM).length!=0;
}

function otherLetter(letter){
  if (letter == "X") return "O";
  return "X";
}

function getBoxFromIndex(index){
  return $(".smallboard").eq(index);
}
  
function getSpaceIndex(spaceDOM){
  return getAllSpaces().index(spaceDOM);
}

function getParentBox(spaceDOM){
  return $(spaceDOM).parents(".smallboard");
}

function getAllSpaces(){
  return $(".smallboard").find("td");
}

function getSpaceFromIndex(index){
  return getAllSpaces().eq(index);
}

function isSpaceFull(spaceIndex){
  return !hasBlank(getSpaceFromIndex(spaceIndex));
}
  
function hasBlank(arg){
  return arg.find("pre").length!=0;
}

function isBoardWon(letter){
  var spaces=[];
  var tmp;
  for(var i = 0;i<9;i++){
    tmp=getBoxFromIndex(i);
    if(tmp.hasClass(playerColors[letter])){
      spaces.push(letter);
    }
    else spaces.push(" ");
  }
  for(var i = 0;i<3;i++){
    if(spaces[3*i]==spaces[3*i+1]&&spaces[3*i+1]==spaces[3*i+2]&&spaces[3*i]==letter) return true;
    if(spaces[i]==spaces[3+i]&&spaces[3+i]==spaces[6+i]&&spaces[i]==letter) return true;
  }
  if(spaces[0]==spaces[4]&&spaces[4]==spaces[8]&&spaces[0]==letter) return true;
  if(spaces[2]==spaces[4]&&spaces[4]==spaces[6]&&spaces[2]==letter) return true;
  return false;
}
