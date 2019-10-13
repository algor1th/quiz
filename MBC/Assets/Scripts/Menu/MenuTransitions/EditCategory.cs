using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

public class EditCategory : MonoBehaviour, IMenuTransition
{
    public Text title;
    public GameObject deleteButton;
    public Button saveButton;
    public InputField nameField, levelField;
    private string id = "", name = "", level = "";

    public void OnExit()
    {
        id = "";
        name = "";
        level = "";
    }

    public void OnLoad()
    {
        if (id != "")
        {
            title.text = "Edit Category ID: " + id;
            deleteButton.SetActive(true);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Save changes";
        }
        else
        {
            title.text = "Add Category";
            deleteButton.SetActive(false);

            saveButton.transform.GetChild(0).GetComponent<Text>().text = "Add category";
        }
        nameField.text = name;
        levelField.text = level;
    }

    public void Set(string _ID, string _name, string _level)
    {
        id = _ID;
        name = _name;
        level = _level;
    }

    public void Apply()
    {
        name = nameField.text;
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
                 "\"requiredLevel\": " + level + "}",
                 Encoding.UTF8,
                 "application/json");
            HTTPManager.current.AsyncSend(HttpMethod.Put, Credentials.gameserverURL + "/api/categories/" + id, Credentials.admintoken, content);
        }
    }

    private async void CreateUser()
    {
        StringContent content = new StringContent(
                "{ \"name\": \"" + name + "\"," +
                "\"requiredLevel\": " + level + "}",
                Encoding.UTF8,
                "application/json");

        string response = await HTTPManager.current.AsyncSend(HttpMethod.Post, Credentials.gameserverURL + "/api/categories", Credentials.admintoken, content);
        Node responseParsed = Node.ConstructFrom(response);
        Set(responseParsed["id"].ToString(), name, level);
        OnLoad();
    }

    public void ChangedText()
    {
        saveButton.interactable = (nameField.text != "") && (levelField.text != "") && (
            (name != nameField.text)
            || (level != levelField.text)
        );
    }

    public void DeleteCategory()
    {
        gameObject.GetComponent<CanvasGroup>().blocksRaycasts = false;
        DoDelete();
    }
    private async Task DoDelete (){
        string response = await HTTPManager.current.AsyncSend(HttpMethod.Delete, Credentials.gameserverURL + "/api/categories/" + id, Credentials.admintoken);
        Debug.Log(Node.ConstructFrom(response).ToString());
        MenuController.current.ChangeState(5);
    }
}
