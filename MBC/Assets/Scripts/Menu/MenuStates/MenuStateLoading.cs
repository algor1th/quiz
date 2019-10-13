using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MenuStateLoading : MenuState
{
    public RectTransform child;
    public RectTransform target;
    public CanvasGroup fader;

    public GameObject controllWindow;

    public override void EnterState()
    {
        Vector3 startPos = child.position;
        Vector3 startScale = child.sizeDelta;
        DoContinuous(1f, f =>
        {
            fader.alpha = f;
            child.position = Vector3.Slerp(startPos, target.position, f);
            child.sizeDelta = Vector3.Slerp(startScale, target.sizeDelta, f);           
        });
        DoAfterWait(0.55f, () => DoContinue());
    }

    public override void ExitState()
    {
    }
    
    public void DoContinue()
    {
        MenuController.current.ChangeState(2);
        DoAfterWait(0.5f, () =>
        {
            controllWindow.SetActive(true);
        });
    }
}
