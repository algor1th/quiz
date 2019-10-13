using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Credentials : MonoBehaviour, IMenuTransition
{
    public static string userserverURL;
    public static string gameserverURL;
    public static string admintoken;

    public InputField fieldToken;
    public InputField fieldGameserver;
    public InputField fieldUserserver;

    public Button saveButton;


    private void Awake()
    {
        admintoken = PlayerPrefs.GetString("_admintoken");
        gameserverURL = PlayerPrefs.GetString("_gameserverURL");
        userserverURL = PlayerPrefs.GetString("_userserverURL");
    }

    public void OnChange()
    {
        saveButton.interactable = (fieldToken.text != admintoken ||
            fieldGameserver.text != gameserverURL ||
            fieldUserserver.text != userserverURL);
    }
    public void Save()
    {
        admintoken = fieldToken.text;
        gameserverURL = fieldGameserver.text;
        userserverURL = fieldUserserver.text;

        PlayerPrefs.SetString("_admintoken", admintoken);
        PlayerPrefs.SetString("_gameserverURL", gameserverURL);
        PlayerPrefs.SetString("_userserverURL", userserverURL);

        saveButton.interactable = false;
    }

    public void OnLoad()
    {
        fieldToken.text = admintoken;
        fieldGameserver.text = gameserverURL;
        fieldUserserver.text = userserverURL;

        saveButton.interactable = false;
    }
    public void OnExit()
    {
    }
}
