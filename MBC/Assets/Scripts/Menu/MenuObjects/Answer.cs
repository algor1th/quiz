using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;

public class Answer : MonoBehaviour
{
    public Text id, isCorrect;
    public TMP_Text text;

    public static int number;
    public int myNumber;

    public static int GetNumber()
    {
        return number;
    }

    public static Answer Create(Transform parent)
    {
        GameObject instance = GameObject.Instantiate((Resources.Load<GameObject>("Prefabs/Answer")), parent);
        instance.SetActive(false);

        Answer instanceObj = instance.GetComponent<Answer>();
        instanceObj.myNumber = number;

        number++;

        return instanceObj;
    }

    public void Set(string _id, string _isCorrect, string _text, int offset, UnityAction<int> edit)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -offset);

        isCorrect.text = _isCorrect;
        text.text = _text;
        id.text = _id;

        transform.GetChild(5).gameObject.GetComponent<Button>().onClick.AddListener(() => edit(myNumber));

        gameObject.SetActive(true);
    }

    public void Standby()
    {
        gameObject.SetActive(false);
    }
}
