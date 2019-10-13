using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class MenuState : MonoBehaviour
{
    public abstract void EnterState();
    public abstract void ExitState(); 

    protected void DoAfterWait(float f, Action a)
    {
        StartCoroutine(DoAfterWaitIEnu(f, a));
    }
    protected void DoContinuous(float maxTime, Action<float> a)
    {
        StartCoroutine(DoContinuousIEnu(maxTime, a));
    }

    private IEnumerator DoAfterWaitIEnu(float f, Action a)
    {
        yield return new WaitForSeconds(f);
        a();
    }
    private IEnumerator DoContinuousIEnu(float maxTime, Action<float> a)
    {
        for(float f = 0; f<1; f+= Time.deltaTime/ maxTime)
        {
            a(f);
            yield return new WaitForEndOfFrame();
        }
        a(1);
    }

}
