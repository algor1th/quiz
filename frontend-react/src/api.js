const api = {

    "listGames": () => {
        return [{
            "id": 24,
            "userID_1": 42,
            "userID_2": 43,
            "isFinished": 1
        },
        {
            "id": 25,
            "userID_1": 43,
            "userID_2": null,
            "isFinished": 0
        }];
    },
    "getGame": (id) => {
        return (
            {
                "id": 19,
                "gameID": 29,
                "category": null,
                "question_1": {
                    "questionID": 10,
                    "answerID_1": null,
                    "answerID_2": null
                },
                "question_2": {
                    "questionID": 9,
                    "answerID_1": null,
                    "answerID_2": null
                },
                "question_3": {
                    "questionID": 8,
                    "answerID_1": null,
                    "answerID_2": null
                }
            }
        )
    },
    "getQuestion": (roundId) => {
        let question = {
            "selectAnswer": (answerID) => {

            }
        }
        return question;
    }

}
export default api;