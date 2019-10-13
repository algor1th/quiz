using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MenuStatePage : MenuState
{
    public CanvasGroup fader;
    public List<GameObject> customTransitionEffects;

    public MenuStatePage()
    {
    }

    public override void EnterState()
    {
        foreach (GameObject g in customTransitionEffects)
            foreach (IMenuTransition t in g.GetComponents<IMenuTransition>())
                t.OnLoad();

        fader.blocksRaycasts = true;

        DoAfterWait(0.45f, () =>
            DoContinuous(0.5f, f =>
            {
                fader.alpha = f;
            })
        );
    }

    public override void ExitState()
    {
        foreach (GameObject g in customTransitionEffects)
            foreach (IMenuTransition t in g.GetComponents<IMenuTransition>())
                t.OnExit();

        fader.blocksRaycasts = false;

        DoContinuous(0.5f, f =>
        {
            fader.alpha = 1 - f;
        });
    }
}
