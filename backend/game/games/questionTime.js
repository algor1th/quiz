'use strict';

var questionTimeDic = {}

module.exports = {
    startQuestion: function(userID, questionID, roundID){
        if(!questionTimeDic[roundID]){
            questionTimeDic[roundID] = {}
        }
        if(!questionTimeDic[userID+"_"+questionID]){
            var dt = new Date();
            questionTimeDic[userID+"_"+questionID] = dt.getTime();
        }
    },
    tryEndQuestion: function(userID, questionID, roundID, answerTime){
        var round = questionTimeDic[roundID];
        if(!round){
            round = questionTimeDic[0];
        }
        if(round){
            var time = questionTimeDic[userID+"_"+questionID]
            var dt = new Date();
            if(time){
                return dt.getTime() <= time + answerTime*1000;
            } 
        }
        return false;
    },
    finishRound: function(roundID){
        delete questionTimeDic[roundID];
    }
}  