using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using UnityEngine;
using System.Linq;
using System.Threading.Tasks;
using System;
using UnityEngine.UI;

public class GameContent : MonoBehaviour, IMenuTransition
{
    public Scrollbar scrollbar;
    public Transform gameParent;
    public GameObject openText, closedText, truncateButton, updateButton;

    private List<OpenGame> openGames = new List<OpenGame>();
    private List<ClosedGame> closedGames = new List<ClosedGame>();
    private int openGamesActive, closedGamesActive;

    private async Task LoadGames()
    {
        //get data for all games
        string data = await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.gameserverURL + "/api/games", Credentials.admintoken);

        Node parsedData = Node.ConstructFrom(data);

        //show first version
        for(int i=0; i<parsedData.Count(); i++)
            if (parsedData[i]["isFinished"].Equals("0"))
            {
                OpenGame game = GetOpenGame();
                string name_2 = parsedData[i]["userName_2"].ToString();
                game.Set(parsedData[i]["userName_1"].ToString(), name_2 != "null"?name_2:"");
                openGamesActive++;
            }

        for (int i = 0; i < parsedData.Count(); i++)
            if (!parsedData[i]["isFinished"].Equals("0"))
            {
                ClosedGame game = GetClosedGame();
                string name_2 = parsedData[i]["userName_2"].ToString();
                game.Set(parsedData[i]["userName_1"].ToString(), name_2 != "null" ? name_2 : "");
                closedGamesActive++;
            }


        //show detailed version
        int openedGameIndex = 0;
        int closedGameIndex = 0;

        for (int iGame=0; iGame < parsedData.Count(); iGame++)
        {
            string detailedData = await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.gameserverURL + "/api/games/"+parsedData[iGame]["id"].ToString()+ "/?containsFullHistory=true", Credentials.admintoken);
            Node parsedDetailData = Node.ConstructFrom(detailedData);

            int points_1 = 0;
            int points_2 = 0;

            for(int iRound=0; iRound < parsedDetailData["rounds"].Count(); iRound++)
            {
                for (int iQuestion = 0; iQuestion < parsedDetailData["rounds"][iRound]["questions"].Count(); iQuestion++)
                {
                    string answer_1 = parsedDetailData["rounds"][iRound]["questions"][iQuestion]["answerID_1"].ToString();
                    string answer_2 = parsedDetailData["rounds"][iRound]["questions"][iQuestion]["answerID_2"].ToString();
                    for (int iAnswer = 0; iAnswer < parsedDetailData["rounds"][iRound]["questions"][iQuestion]["question"]["answers"].Count(); iAnswer++)
                    {
                        if (parsedDetailData["rounds"][iRound]["questions"][iQuestion]["question"]["answers"][iAnswer]["id"].Equals(answer_1))
                            if (parsedDetailData["rounds"][iRound]["questions"][iQuestion]["question"]["answers"][iAnswer]["isCorrect"].Equals("1"))
                                points_1++;
                        if (parsedDetailData["rounds"][iRound]["questions"][iQuestion]["question"]["answers"][iAnswer]["id"].Equals(answer_2))
                            if (parsedDetailData["rounds"][iRound]["questions"][iQuestion]["question"]["answers"][iAnswer]["isCorrect"].Equals("1"))
                                points_2++;

                    }
                }
            }

            if (parsedData[iGame]["isFinished"].Equals("0"))
            {
                string name_2 = parsedData[iGame]["userName_2"].ToString();

                openGames[openedGameIndex].Set(
                    parsedData[iGame]["userName_1"].ToString(),
                    name_2 != "null" ? name_2 : "",
                    points_1.ToString(),
                    points_2.ToString(),
                    parsedDetailData["rounds"].Count().ToString());
                openedGameIndex++;
            }
            else
            {
                string change = parsedData[iGame]["scoring"]["change"].ToString();
                string change_1 = (parsedData[iGame]["scoring"]["winner"].Equals("2") ? "-" : "") + change;
                string change_2 = (parsedData[iGame]["scoring"]["winner"].Equals("1") ? "-" : "") + change;

                string name_2 = parsedData[iGame]["userName_2"].ToString();

                closedGames[closedGameIndex].Set(
                   parsedData[iGame]["userName_1"].ToString(),
                   name_2 != "null" ? name_2 : "",
                   points_1.ToString(),
                   points_2.ToString(),
                   change_1,
                   change_2);
                closedGameIndex++;
            }
        }
    }

    private OpenGame GetOpenGame()
    {
        OpenGame openGame = openGames.Find(g => !g.gameObject.activeSelf);
        if(openGame == null)
        {
            openGame = OpenGame.Create(gameParent);
            openGames.Add(openGame);
        }
        return openGame;  
    }
    private ClosedGame GetClosedGame()
    {
        ClosedGame closedGame = closedGames.Find(g => !g.gameObject.activeSelf);
        if (closedGame == null)
        {
            closedGame = ClosedGame.Create(gameParent);
            closedGames.Add(closedGame);
        }
        return closedGame;
    }

    private async void LoadContent()
    {
        await LoadGames();

        RectTransform rt;
        int offset = 100;

        if(openGamesActive > 0)
        {
            openText.SetActive(true);
            offset += 150;
        }
        else
        {
            openText.SetActive(false);
        }

        if (closedGamesActive > 0)
        {
            closedText.SetActive(true);
            rt = closedText.GetComponent<RectTransform>();
            rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -offset - 160 * (openGamesActive));
            offset += 150;
        }
        else
        {
            closedText.SetActive(false);
        }

        rt = updateButton.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -offset - 160 * (openGamesActive + closedGamesActive));
        offset += 150;

        rt = truncateButton.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -offset - 160 * (openGamesActive + closedGamesActive));
        offset += 150;

        rt = gameParent.gameObject.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(rt.sizeDelta.x, offset-50 + (openGamesActive + closedGamesActive) * 160);
        scrollbar.onValueChanged.Invoke(1);

        truncateButton.GetComponent<Button>().interactable = (openGamesActive + closedGamesActive) > 0;
    }

    public void OnLoad()
    {
        LoadContent();
    }

    public void OnExit()
    {
        StartCoroutine("Unload");
    }

    public void Truncate()
    {
        DoTruncate();
        truncateButton.GetComponent<Button>().interactable = false;
    }

    private async void DoTruncate()
    {
        await HTTPManager.current.AsyncSend(HttpMethod.Delete, Credentials.gameserverURL + "/api/games", Credentials.admintoken);
        UpdateGames();
    }

    public void UpdateGames()
    {
        foreach (OpenGame game in openGames)
            game.gameObject.SetActive(false);
        foreach (ClosedGame game in closedGames)
            game.gameObject.SetActive(false);

        openGamesActive = 0;
        closedGamesActive = 0;
        LoadContent();
    }

    public IEnumerator Unload()
    {
        yield return new WaitForSeconds(0.5f);
        foreach (OpenGame game in openGames)
            game.gameObject.SetActive(false);
        foreach (ClosedGame game in closedGames)
            game.gameObject.SetActive(false);

        openGamesActive = 0;
        closedGamesActive = 0;
    }
}
