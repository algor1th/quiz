using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

public class EditAnswer : MonoBehaviour, IMenuTransition
{
    public EditQuestion editQuestion;

    public Text title;
    public GameObject deleteButton;
    public Button saveButton;
    public InputField textField;
    public Toggle isCorrectToggle;

    private string text = "", id="", questionID="";
    private bool isCorrect;


    private string Qid = "", Qtext = "", Qscore = "", Qlevel = "", Qtime = "", Qcategory = "";
    public void BackupQuestion()
    {
        Qid = editQuestion.id;
        Qtext = editQuestion.text;
        Qscore = editQuestion.score;
        Qlevel = editQuestion.level;
        Qtime = editQuestion.time;
        Qcategory = editQuestion.category;
    }
    public void OnExit()
    {
        text = "";
        id = "";
        questionID = "";
        isCorrect = false;
    }

    public void OnLoad()
    {
        if (id != "")
        {
            title.text = "Edit Answer ID: " + id;
            deleteButton.SetActive(true);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Save changes";
        }
        else
        {
            title.text = "Add Answer";
            deleteButton.SetActive(false);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Add answer";
        }

        textField.text = text;
        isCorrectToggle.isOn = isCorrect;
    }

    public void Set(string _text, string _id, string _questionID, bool _isCorrect)
    {
        id = _id;
        text = _text;
        isCorrect = _isCorrect;
        questionID = _questionID;
    }

    public void Set(string _questionID)
    {
        questionID = _questionID;
    }

    public void Apply()
    {
        text = textField.text;
        isCorrect = isCorrectToggle.isOn;
        ChangedText();

        if (id == "")
        {
            CreateAnswer();
        }
        else
        {
            StringContent content = new StringContent(
                 "{ \"text\": \"" + name + "\"," +
                 "\"isCorrect\": " + isCorrect.ToString().ToLower() + "," +
                 "\"questionID\": " + questionID + "}",
                 Encoding.UTF8,
                 "application/json");
            HTTPManager.current.AsyncSend(HttpMethod.Put, Credentials.gameserverURL + "/api/answers/" + id, Credentials.admintoken, content);

        }
    }

    private async void CreateAnswer()
    {
        StringContent content = new StringContent(
                 "{ \"text\": \"" + text + "\"," +
                 "\"isCorrect\": " + isCorrect.ToString().ToLower() + "," +
                 "\"questionID\": " + questionID + "}",
                 Encoding.UTF8,
                 "application/json");

        string response = await HTTPManager.current.AsyncSend(HttpMethod.Post, Credentials.gameserverURL + "/api/answers", Credentials.admintoken, content);
        Node responseParsed = Node.ConstructFrom(response);
        Set(text,responseParsed["id"].ToString(), questionID, isCorrect);
        OnLoad();
    }

    public void ChangedText()
    {
        saveButton.interactable = (textField.text != "") &&
             ((text != textField.text)
            || (isCorrect != isCorrectToggle.isOn)
        );
    }

    public void DeleteAnswer()
    {
        gameObject.GetComponent<CanvasGroup>().blocksRaycasts = false;
        DoDelete();
    }
    private async Task DoDelete (){
        string response = await HTTPManager.current.AsyncSend(HttpMethod.Delete, Credentials.gameserverURL + "/api/answers/" + id, Credentials.admintoken);
        BackToQuestion();
    }

    public void BackToQuestion()
    {
        editQuestion.id = Qid;
        editQuestion.text = Qtext;
        editQuestion.score = Qscore;
        editQuestion.level = Qlevel;
        editQuestion.time = Qtime;
        editQuestion.category = Qcategory;

        MenuController.current.ChangeState(9);
    }
}
