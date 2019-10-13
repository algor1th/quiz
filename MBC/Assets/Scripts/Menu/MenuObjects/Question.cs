using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;

public class Question : MonoBehaviour
{
    public Text id, time, level, score;
    public TMP_Text text;

    public static int number;
    public int myNumber;

    public static Question Create(Transform parent)
    {
        GameObject instance = GameObject.Instantiate((Resources.Load<GameObject>("Prefabs/Question")), parent);
        instance.SetActive(false);

        Question instanceObj = instance.GetComponent<Question>();
        instanceObj.myNumber = number;

        number++;

        return instanceObj;
    }

    public void Set(string _id, string _time, string _level, string _score, string _text, int position, UnityAction<int> edit)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x,  - 160 * position);

        id.text = _id;
        time.text = _time;
        level.text = _level;
        score.text = _score;
        text.text = _text;

        transform.GetChild(4).gameObject.GetComponent<Button>().onClick.AddListener(() => edit(myNumber));
        gameObject.SetActive(true);
    }

    public void Standby()
    {
        gameObject.SetActive(false);
    }
}
