using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

public class EditUser : MonoBehaviour, IMenuTransition
{
    public Scrollbar scrollbar;

    public Text title;
    public GameObject deleteButton, tokenButton, backButton;
    public Button saveButton;
    public RectTransform contentTransform;
    public InputField nameField, scoreField, levelField, tokenField;
    private string id = "", name = "", score = "", level = "";

    public void OnExit()
    {
        id = "";
        name = "";
        score = "";
        level = "";
    }

    public void OnLoad()
    {
        if (id != "")
        {
            title.text = "Edit User ID: " + id;
            tokenButton.SetActive(true);
            deleteButton.SetActive(true);
            tokenField.gameObject.SetActive(false);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Save changes";

            tokenButton.GetComponent<Button>().interactable = true;
            saveButton.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -885);
            backButton.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -1035);
            contentTransform.sizeDelta = new Vector2(contentTransform.sizeDelta.x, 1270);
        }
        else//15Uhr montag
        {
            title.text = "Add User";
            tokenButton.SetActive(false);
            deleteButton.SetActive(false);
            tokenField.gameObject.SetActive(false);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Add user";

            backButton.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -885);
            saveButton.GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -735);

            contentTransform.sizeDelta = new Vector2(contentTransform.sizeDelta.x, 980);


        }

        scrollbar.onValueChanged.Invoke(1);
        nameField.text = name;
        scoreField.text = score;
        levelField.text = level;
    }

    public void Set(string _ID, string _name, string _score, string _level)
    {
        id = _ID;
        name = _name;
        score = _score;
        level = _level;
    }

    public void Apply()
    {
        name = nameField.text;
        score = scoreField.text;
        level = levelField.text;
        ChangedText();

        if (id == "")
        {
            CreateUser();
        }
        else
        {
            StringContent content = new StringContent(
                 "{ \"name\": \"" + name + "\"," +
                 "\"score\": " + score + "," +
                 "\"level\": " + level + "}",
                 Encoding.UTF8,
                 "application/json");
            HTTPManager.current.AsyncSend(HttpMethod.Put, Credentials.userserverURL + "/api/users/" + id, Credentials.admintoken, content);

        }
    }

    private async void CreateUser()
    {
        StringContent content = new StringContent(
                "{ \"name\": \"" + name + "\"," +
                "\"score\": " + score + "," +
                "\"level\": " + level + "}",
                Encoding.UTF8,
                "application/json");

        string response = await HTTPManager.current.AsyncSend(HttpMethod.Post, Credentials.userserverURL + "/api/users", Credentials.admintoken, content);
        Node responseParsed = Node.ConstructFrom(response);
        Set(responseParsed["id"].ToString(), name, score, level);
        OnLoad();
    }

    public void ChangedText()
    {
        saveButton.interactable = (nameField.text != "") && (scoreField.text != "") && (levelField.text != "") && (
            (name != nameField.text)
            || (score != scoreField.text)
            || (level != levelField.text)
        );
    }

    public void ShowToken()
    {
        DoShow();
        tokenButton.GetComponent<Button>().interactable = false;
    }
    private async void DoShow()
    {
        StringContent content = new StringContent(
                "{ \"userID\": " + id + "}",
                Encoding.UTF8,
                "application/json");

        string response = await HTTPManager.current.AsyncSend(HttpMethod.Post, Credentials.userserverURL + "/api/authentication", Credentials.admintoken, content);
        Node responseParsed = Node.ConstructFrom(response);
        Debug.Log(responseParsed.ToString());

        tokenField.text = responseParsed["token"].ToString();
        tokenField.gameObject.SetActive(true);
        tokenButton.gameObject.SetActive(false);
    }
    public void DeleteUser()
    {
        gameObject.GetComponent<CanvasGroup>().blocksRaycasts = false;
        DoDelete();
    }
    private async Task DoDelete (){
        string response = await HTTPManager.current.AsyncSend(HttpMethod.Delete, Credentials.userserverURL + "/api/users/" + id, Credentials.admintoken);

        MenuController.current.ChangeState(4);
    }
}
