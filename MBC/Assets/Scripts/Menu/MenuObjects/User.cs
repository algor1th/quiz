using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class User : MonoBehaviour
{
    public Text playerID, playerName, score, level;

    private static int number;
    public int myNumber;

    public static int GetNumber()
    {
        return number;
    }

    public static User Create(Transform parent)
    {
        GameObject instance = GameObject.Instantiate((Resources.Load<GameObject>("Prefabs/User")), parent);
        instance.SetActive(false);

        User instanceUser = instance.GetComponent<User>();
        instanceUser.myNumber = number;

        number++;

        return instanceUser;
    }

    public void Set(string _playerID, string _playerName, string _score, string _level)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -100 - 160 * myNumber);

        playerID.text = _playerID;
        playerName.text = _playerName;
        score.text = _score;
        level.text = _level;


        gameObject.SetActive(true);
    }

    public void Standby()
    {
        gameObject.SetActive(false);
    }
}
