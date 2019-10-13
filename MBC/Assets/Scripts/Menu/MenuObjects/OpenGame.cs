using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class OpenGame: MonoBehaviour
{
    public Text playerName_1, playerName_2, score_1, score_2, curRound;

    private static int number;
    public int myNumber;

    public static int GetNumber()
    {
        return number;
    }

    public static OpenGame Create(Transform parent)
    {
        GameObject instance = GameObject.Instantiate((Resources.Load<GameObject>("Prefabs/GamePrefabOpen")), parent);
        instance.SetActive(false);

        OpenGame instanceGame = instance.GetComponent<OpenGame>();
        instanceGame.myNumber = number;

        number++;

        return instanceGame;
    }

    public void Set(string _playerName_1, string _playerName_2)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -200 - 160 * myNumber);

        score_1.text = "?";
        score_2.text = "?";
        curRound.text = "?";

        playerName_1.text = _playerName_1;
        playerName_2.text = _playerName_2;

        gameObject.SetActive(true);
    }

    public void Set(string _playerName_1, string _playerName_2, string _score_1, string _score_2, string _curRound)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -200 - 160 * myNumber);

        score_1.text = _score_1;
        score_2.text = _score_2;
        curRound.text = _curRound;

        playerName_1.text = _playerName_1;
        playerName_2.text = _playerName_2;

        gameObject.SetActive(true);
    }

    public void Standby()
    {
        gameObject.SetActive(false);
    }
}
