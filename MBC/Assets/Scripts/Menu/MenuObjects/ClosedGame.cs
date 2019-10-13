using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ClosedGame: MonoBehaviour
{
    public Text playerName_1, playerName_2, score_1, score_2, points_1, points_2;

    private static int number;
    public int myNumber;

    public static int GetNumber()
    {
        return number;
    }

    public static ClosedGame Create(Transform parent)
    {
        GameObject instance = GameObject.Instantiate((Resources.Load<GameObject>("Prefabs/GamePrefabClosed")), parent);
        instance.SetActive(false);

        ClosedGame instanceGame = instance.GetComponent<ClosedGame>();
        instanceGame.myNumber = number;

        number++;

        return instanceGame;
    }

    public void Set(string _playerName_1, string _playerName_2)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -390 - 160 * (myNumber+OpenGame.GetNumber()));

        score_1.text = "?";
        score_2.text = "?";
        points_1.text = "?"; 
        points_2.text = "?"; 

        playerName_1.text = _playerName_1;
        playerName_2.text = _playerName_2;

        gameObject.SetActive(true);
    }

    public void Set(string _playerName_1, string _playerName_2, string _score_1, string _score_2, string _points_1, string _points_2)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -390 - 160 * (myNumber + OpenGame.GetNumber()));

        score_1.text = _score_1;
        score_2.text = _score_2;
        points_1.text = _points_1;
        points_2.text = _points_2;

        playerName_1.text = _playerName_1;
        playerName_2.text = _playerName_2;

        gameObject.SetActive(true);
    }

    public void Standby()
    {
        gameObject.SetActive(false);
    }
}
