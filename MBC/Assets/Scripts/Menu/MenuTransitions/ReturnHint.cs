using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ReturnHint : MonoBehaviour, IMenuTransition
{
    private bool successfullUsed;
    private bool isUsed;
    public GameObject hint;

    public void OnExit()
    {
        if (!successfullUsed)
        {
            StartCoroutine(ShowHint());
        }
    }

    public void OnLoad()
    {
        hint.SetActive(false);
        if (isUsed)
            successfullUsed = true;
    }

    private IEnumerator ShowHint()
    {
        yield return new WaitForSeconds(0.75f);
        isUsed = true;
        hint.SetActive(true);
    }
}
