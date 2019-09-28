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
            console.log(userID+" took question "+questionID+" from round "+roundID+" at "+ dt.getTime());
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
            console.log(userID+" gave back question "+questionID+" from round "+roundID+" at "+ dt.getTime()+" <? "+(time + answerTime*1000) +"  -> "+(dt.getTime() <= time + answerTime*1000));
            if(time){
                return dt.getTime() <= time + answerTime*1000;
            } 
        }
        return false;
    },
    finishRound: function(roundID){
        console.log("delete questions for round "+roundID);
        delete questionTimeDic[roundID];
    }
}  