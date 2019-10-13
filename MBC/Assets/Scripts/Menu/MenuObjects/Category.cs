using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;

public class Category : MonoBehaviour
{
    public Text id, level, text;
    public Button buttonLeft, buttonRight, buttonEdit;

    public static int number;
    public int myNumber;

    public static Category Create(Transform parent)
    {
        GameObject instance = GameObject.Instantiate((Resources.Load<GameObject>("Prefabs/Category")), parent);
        instance.SetActive(false);

        Category instanceObj = instance.GetComponent<Category>();
        instanceObj.myNumber = number;

        number++;

        return instanceObj;
    }

    public void Set(string _id, string _level, string _text, UnityAction left, UnityAction right, UnityAction<int> edit)
    {
        RectTransform rt = gameObject.GetComponent<RectTransform>();
        rt.anchoredPosition = new Vector2(rt.anchoredPosition.x, -100);

        if (myNumber == 0)
            buttonLeft.gameObject.SetActive(false);

        buttonLeft.onClick.AddListener(left);
        buttonRight.onClick.AddListener(right);
        buttonEdit.onClick.AddListener(() => edit(myNumber));

        id.text = _id;
        level.text = _level;
        text.text = _text;

        gameObject.SetActive(true);
    }
    public void Set()
    {
        gameObject.SetActive(true);
    }

    public void Standby()
    {
        gameObject.SetActive(false);
    }
}
