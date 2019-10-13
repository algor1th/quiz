using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using UnityEngine;
using System.Linq;
using System.Threading.Tasks;
using System;
using UnityEngine.UI;

public class UserContent : MonoBehaviour, IMenuTransition
{
    public Scrollbar scrollbar;

    public EditUser editUser;

    public Transform gameParent;
    public GameObject addButton, updateButton, backButton, showButton;
    public InputField tokenText;

    private List<User> users = new List<User>();

    private int usersActive;

    private async Task LoadGames()
    {
        //get data for all games
        string data = await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.userserverURL + "/api/users", Credentials.admintoken);

        Node parsedData = Node.ConstructFrom(data);

        //show
        for(int i=0; i<parsedData.Count(); i++)
        {
            User user = GetUser();
            user.Set(parsedData[i]["id"].ToString(),
                parsedData[i]["name"].ToString(),
                parsedData[i]["score"].ToString(),
                parsedData[i]["level"].ToString());
            usersActive++;
        }
    }

    private User GetUser()
    {
        User user = users.Find(g => !g.gameObject.activeSelf);
        if(user == null)
        {
            user = User.Create(gameParent);
            user.transform.GetChild(4).GetComponent<Button>().onClick.AddListener(() => EditUser(user));
            users.Add(user);
        }
        return user;  
    }

    private async void LoadContent()
    {
        await LoadGames();

        RectTransform rt;
        int offset = 100;

        rt = updateButton.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -offset - 160 * (usersActive));
        offset += 150;

        rt = addButton.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -offset - 160 * (usersActive));
        offset += 150;

        rt = gameParent.gameObject.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(rt.sizeDelta.x, offset-50 + (usersActive) * 160);

        scrollbar.onValueChanged.Invoke(1);
    }

    public void OnLoad()
    {
        LoadContent();
    }

    public void OnExit()
    {
        StartCoroutine("Unload");
    }

    public void EditUser(User u)
    {
        editUser.Set(u.playerID.text, u.playerName.text, u.score.text, u.level.text);
        MenuController.current.ChangeState(7);
    }
    public void UpdateUsers()
    {
        foreach (User user in users)
            user.gameObject.SetActive(false);

        usersActive = 0;
        LoadContent();
    }

    public IEnumerator Unload()
    {
        yield return new WaitForSeconds(0.5f);
        foreach (User user in users)
            user.gameObject.SetActive(false);

        usersActive = 0;
    }
}
