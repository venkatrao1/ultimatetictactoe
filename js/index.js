var myTurn;
var gameID;
var turn = "X";
var lastMove = -1;
var playerColors={
  "X":"bg-primary",
  "O":"bg-danger"
}
var database;
var gameData;
var tmp;

$(document).ready(function(){
  $("button").click(function(){
    if($(this).hasClass("create")) myTurn = "X";
    else myTurn='O';
    gameID = $("#gameid").val();
    init();
  });
});

function init(){
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
  
  startFirebase();
  
  getAllSpaces().click(function(){
    if(turn==myTurn) $(this).trigger("move");
  });

  getAllSpaces().on("move",function(){
    var moveIndex = getSpaceIndex(this);
    var parentBox = getParentBox(this);
    if(isValidMove(moveIndex)){
      $(this).html(turn);
      lastMove=moveIndex;
      if(isBoxWon(turn, parentBox)){
        parentBox.addClass(playerColors[turn]);
        parentBox.addClass("won");
        if(isBoardWon(turn)) displayWinner(turn);
      }
      else if(!hasBlank(parentBox)){
          parentBox.addClass("bg-secondary");
      }
      turn = otherLetter(turn);
      gameData.child("last").set(lastMove);
    }
  });
}

function startFirebase(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCLH9b36TqaRUSIOlltU4nposdsoiguNqc",
    authDomain: "ultimate-tic-tac-toe-ea3ac.firebaseapp.com",
    databaseURL: "https://ultimate-tic-tac-toe-ea3ac.firebaseio.com",
    projectId: "ultimate-tic-tac-toe-ea3ac",
    storageBucket: "ultimate-tic-tac-toe-ea3ac.appspot.com",
    messagingSenderId: "1088131710249"
  };
  firebase.initializeApp(config);
  database = firebase.database();
  gameData=firebase.database().ref(gameID);
  gameData.set({});
  gameData.on('value',function(snapshot){
    tmp=snapshot;
    console.log("updated");
    console.log(snapshot.val());
    getSpaceFromIndex(snapshot.val().last).trigger("move");
  });
}

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
  var moveDOM = getSpaceFromIndex(moveIndex);
  var newBox = getBoxFromIndex(lastMove%9);
  if(lastMove==-1) return true;
  if(isSpaceFull(moveIndex)) return false;
  if(!boxContains(newBox,moveDOM)) return !hasBlank(newBox);
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