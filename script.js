/**
  Author: ironmaniiith
  Date Created: 16 July 2016
  Website: https://github.com/ironmaniiith
  Description: Script for winning the mi.com Pair 2 win (http://www.mi.com/in/events/2ndanniversary/playgame/)
  				Play here: http://mobile.mi.com/in/events/2ndanniversary/playgame/level/
  */

/**
  dispatchMouseEvent:
  Credits: http://stackoverflow.com/questions/4158847/is-there-a-way-to-simulate-key-presses-or-a-click-with-javascript#answer-4176116
  */
var dispatchMouseEvent = function(target, var_args) {
  var e = document.createEvent("MouseEvents");
  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
  target.dispatchEvent(e);
};

function properClick(el) {
	['mouseover', 'mousedown', 'click', 'mouseup'].forEach(function(val){
		dispatchMouseEvent(el, val, true, true);
	});
}
/** Click on the `node` after `time` ms */
function clickNode(node, time){
	setTimeout(function(){
		properClick(node);
	}, time);
	return;
}


/** Cache some methods */
var Floor = Math.floor;
var arraySlice = Array.prototype.slice;

/** Globals */
var pairs = [],
  i = -1,
  selector = 1;

/** Extras */
function getDimensions() {
	var section = document.getElementById('J_playSection');
	var totalBlocks = section.getElementsByTagName('li').length;
	var row = section.getElementsByTagName('ul').length;
	var col = totalBlocks / row;
	return {row: row, col: col};
}


/** Board processing starts here */
function processBoard() {
	var x = arraySlice.call(document.getElementsByClassName('front'));
	var board = [];
	var dim = getDimensions();
	var n = dim.row,
		m = dim.col;

	/** Prepare the board array from the cards */
	x.forEach(function(val, index, arr){
		if (index % 2 === 1) {
			tag = val.getElementsByTagName('img')[0];
			tag ? board.push({img: tag, imgSrc: tag.src}) : console.log('Error: ' + index);
		}
	});
	var boardImgSrc = board.map(function(e){ return e.imgSrc });

	/** Extract the paired cards from board array */
	var pairs = [];
	board.forEach(function(val, index, arr){
		var img = val.img;
		var imgSrc = val.imgSrc;
		var conjugate;
		arr[index + 1] ? (conjugate = boardImgSrc.indexOf(imgSrc, index + 1)) : console.log('Skipping: ' + (index + 1));
		(conjugate && conjugate !== -1) ? pairs.push({0: val, 1: arr[conjugate]}) : console.log('Skipping: ' + (index + 1));
	});
	return pairs;
}

function startGame() {
	/** Initialize `i` and `selector` in opposite sense */
	i = -1;
	selector = 1;
	pairs = processBoard();
	/* Start with a fake click */
	properClick(document.head, 0);
}


/** Game playing by clicking logic */
/** Let's rock and roll */
function listenerDevOps(e) {
	var time = 1200; /* Time gap before first paired card opening */
	(selector === 1) ? i++ : time = 700; /* Time gap before second paired card opening */
	selector ^= 1;
	var pair = pairs[i];
	if (pair) {
		var next = pair[selector].img.closest('li');
		clickNode(next, time);
	}
}
document.addEventListener('mouseup', listenerDevOps);

startGame();

/** Keep track of next level popup */
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
        var popupDiv = mutationRecord['target'],
            divClass = popupDiv ? popupDiv['className'] : undefined;
        if (divClass === 'popup') {
        	var decision = confirm('Congratulations! Your bot won the game, do you want to automate one more round.?');
        	if (decision) {
	        	var replayButton = document.getElementsByClassName('btn replay-btn')[0];
	        	setTimeout(function(){
	        		replayButton.click()
		        	setTimeout(startGame, 2000); /* Start playing game again after 2000 ms */
	        	}, 500);
        	} else {
				observer.disconnect();
				document.removeEventListener('mouseup', listenerDevOps);        		
        		alert('Thanks for using bot /** Author: Ironmaniiith */');
        	}
        	return ;
        }
    });    
});

var target = document.getElementById('J_priceSection');
observer.observe(target, { attributes : true, attributeFilter: ['class']});