using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

public class EditQuestion : MonoBehaviour, IMenuTransition
{
    public EditAnswer editAnswer;

    public Scrollbar scrollbar;

    public Text title;
    public GameObject deleteButton, addButton, backButton, answerText;
    public Button saveButton, answerButton;
    public RectTransform contentTransform;
    public InputField textField, scoreField, levelField, timeField;
    public string id = "", text = "", score = "", level = "", time = "", category = "";

    public void OnExit()
    {
        id = "";
        text = "";
        score = "";
        level = "";
        time = "";
        category = "";

        Answer.number = 0;
        StartCoroutine("doUnload");
    }

    private List<Answer> answers = new List<Answer>();
    private async void ShowAnswers()
    {
        int offset = 860;
        if(id != "")
        {
            answerButton.gameObject.SetActive(true);
            answerText.SetActive(true);
            offset += 350;

            string response = await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.gameserverURL + "/api/answers/?forQuestion=" + id, Credentials.admintoken);
            Node parsedResponse = Node.ConstructFrom(response);
            for(int iAnswer = 0; iAnswer<parsedResponse.Count(); iAnswer++)
            {
                Answer answer = Answer.Create(contentTransform.GetChild(5));
                answers.Add(answer);
                answer.Set(parsedResponse[iAnswer]["id"].ToString(),
                    parsedResponse[iAnswer]["isCorrect"].Equals("0") ? "false" : "true",
                    parsedResponse[iAnswer]["text"].ToString(),
                    offset,
                    x => EditAnswer(x));
                offset += 160;
            }
            offset += 30;
        }
        else
        {
            answerButton.gameObject.SetActive(false);
            answerText.SetActive(false);
        }


        //do correct pos
        addButton.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -offset);
        offset += 150;
        backButton.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -offset);
        offset += 150;
        if (id != "")
        {
            deleteButton.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -offset);
            offset += 100;
        }
        contentTransform.sizeDelta = new Vector2(contentTransform.sizeDelta.x, offset);


        scrollbar.onValueChanged.Invoke(1);
    }
    public void OnLoad()
    {
        if (id != "")
        {
            title.text = "Edit Question ID: " + id;
            deleteButton.SetActive(true);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Save changes";
        }
        else
        {
            title.text = "Add Question";
            deleteButton.SetActive(false);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Add question";
        }

        ShowAnswers();

        textField.text = text;
        scoreField.text = score;
        levelField.text = level;
        timeField.text = time;
    }

    public void Set(string _ID, string _text, string _score, string _level, string _time, string _category)
    {
        id = _ID;
        text = _text;
        score = _score;
        level = _level;
        time = _time;
        category = _category;
    }
    public void Set(string _category)
    {
        category = _category;
    }

    public void Apply()
    {
        text = textField.text;
        score = scoreField.text;
        level = levelField.text;
        time = timeField.text;

        ChangedText();

        if (id == "")
        {
            CreateQuestion();
        }
        else
        {
            StringContent content = new StringContent(
                          "{ \"text\": \"" + text + "\"," +
                          "\"score\": " + score + "," +
                          "\"requiredLevel\": " + level + "," +
                          "\"categoryID\": " + category + "," +
                          "\"answerTime\": " + time +
                          "}",
                          Encoding.UTF8,
                          "application/json");
             HTTPManager.current.AsyncSend(HttpMethod.Put, Credentials.gameserverURL + "/api/questions/" + id, Credentials.admintoken, content);
        }
    }

    private async void CreateQuestion()
    {
        StringContent content = new StringContent(
                            "{ \"text\": \"" + text + "\"," +
                            "\"score\": " + score + "," +
                            "\"requiredLevel\": " + level + "," +
                            "\"categoryID\": " + category + "," +
                            "\"answerTime\": " + time +
                            "}",
                            Encoding.UTF8,
                            "application/json");
        string response = await HTTPManager.current.AsyncSend(HttpMethod.Post, Credentials.gameserverURL + "/api/questions", Credentials.admintoken, content);
        Node responseParsed = Node.ConstructFrom(response);
        Set(responseParsed["id"].ToString(), text, score, level, time, category);
        OnLoad();
    }

    public void ChangedText()
    {
        saveButton.interactable = (textField.text != "") && 
            (scoreField.text != "") &&
            (timeField.text != "") &&
            (levelField.text != "") && (
            (text != textField.text)
            || (score != scoreField.text)
            || (time != timeField.text)
            || (level != levelField.text)
        );
    }

    public void EditAnswer(int x)
    {
        editAnswer.Set(answers[x].text.text, answers[x].id.text, id, Boolean.Parse(answers[x].isCorrect.text));
        editAnswer.BackupQuestion();
        MenuController.current.ChangeState(10);
    }
    public void AddAnswer()
    {
        editAnswer.Set(id);
        editAnswer.BackupQuestion();
        MenuController.current.ChangeState(10);
    }
    public void DeleteQuestion()
    {
        gameObject.GetComponent<CanvasGroup>().blocksRaycasts = false;
        DoDelete();
    }
    private async Task DoDelete (){
        string response = await HTTPManager.current.AsyncSend(HttpMethod.Delete, Credentials.gameserverURL + "/api/questions/" + id, Credentials.admintoken);

        MenuController.current.ChangeState(5);
    }

    private IEnumerator doUnload()
    {
        yield return new WaitForSeconds(0.5f);
        for (int i = answers.Count - 1; i >= 0; i--)
            Destroy(answers[i].gameObject);
        answers.Clear();
        
    }
}
