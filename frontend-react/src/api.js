const api = {
    "apiUrl": 'localhost:3000',
    'userId': '',
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
        let game = {
            "id": 30,
            "userID_1": 1007,
            "userID_2": 1008,
            "isFinished": 0,
            "rounds": [
                {
                    "id": 20,
                    "category": null,
                    "questions": [
                        {
                            "answerID_1": 7,
                            "answerID_2": null,
                            "question": {
                                "id": 8,
                                "text": "Frage Nummer 1?",
                                "answers": [
                                    {
                                        "id": 7,
                                        "text": "Antwort 1",
                                        "questionID": 8,
                                        "isCorrect": 1
                                    },
                                    {
                                        "id": 8,
                                        "text": "Antwort 2",
                                        "questionID": 8,
                                        "isCorrect": 1
                                    }
                                ]
                            }
                        },
                        {
                            "answerID_1": 11,
                            "answerID_2": null,
                            "question": {
                                "id": 10,
                                "text": "Frage Nummer 3?",
                                "answers": [
                                    {
                                        "id": 11,
                                        "text": "Antwort 1",
                                        "questionID": 10,
                                        "isCorrect": 1
                                    },
                                    {
                                        "id": 12,
                                        "text": "Antwort 2",
                                        "questionID": 10,
                                        "isCorrect": 1
                                    }
                                ]
                            }
                        },
                        {
                            "answerID_1": null,
                            "answerID_2": null,
                            "question": {
                                "id": 9,
                                "text": "Frage Nummer 2?",
                                "answers": [
                                    null,
                                    null
                                ]
                            }
                        }
                    ]
                }
            ]
        };
        let player = game.userID_1 === api.userId ? 0 : 1;
        game.currentRound = () => {
            return (
                game.rounds.find((round) => round.questions.some(
                    (question) => question.question.answers[player] == null
                )
                )
            )
        }
        return (game)
    },
    "getQuestion": (roundId) => {
        fetch(api.apiUrl + `/rounds/${roundId}`)
        let question = {}
        question.selectAnswer = (answerID) => {

        }
        return question;
    }

}
export default api;