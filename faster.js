/**
  Author: ironmaniiith
  Date Created: 22 July 2016
  Website: https://github.com/ironmaniiith
  Description: Faster script for winning the mi.com Pair 2 win (http://www.mi.com/in/events/2ndanniversary/playgame/)
                Play here: http://mobile.mi.com/in/events/2ndanniversary/playgame/level/
  */

/** Cache some methods */
var slice = Array.prototype.slice,
    splice = Array.prototype.splice,
    sort = Array.prototype.sort;

var jsonpCallback = function(){};

/** The gameWinner object */
var gameWinner = {
    endgame: function(stage, e){
        console.log('Ending stage: ' + stage);
        var data = e.data,
            graph_id = data.graph_id,
            graph = Array.prototype.sort.call(slice.call(data.graph)).join('');
            t = (new Date()).getTime(),
            URL = 'http://hd.global.mi.com/in/sec/endgame?from=mb&stage=' + stage + '&use_time=0&graph_id=' + graph_id + '&path=' + graph + '&_=' + t + '&jsonpcallback=jsonpCallback';

        XIAOMI.app.getAjax({
            url: URL,
            type: 'GET',
            dataType: 'jsonp',
            success: function(e) {
                gameWinner.startgame(++stage, e);
            },
            error: function(e) {
                /** Doesn't matter, hahhahaa :P */
                gameWinner.startgame(++stage, e);
            }
        })
    },
    startgame: function(stage, e) {
        console.log('Starting stage: ' + stage);
        if (stage > 50) {
            return ;
        }
        var t = (new Date()).getTime(),
            URL = 'http://hd.global.mi.com/in/sec/startgame?from=mb&stage=' + stage 
                    + '&_=' + t + '&jsonpcallback=jsonpCallback';
        /** Have some gap between two consecutive games */
        setTimeout(function(){
            XIAOMI.app.getAjax({
                url: URL,
                type: 'GET',
                dataType: 'jsonp',
                success: function(e) {
                    gameWinner.endgame(stage, e);
                }
            });
        }, 100);
    }
}

/** Yeah B-) */
gameWinner.startgame(1, null);