using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MenuStateExit : MenuState
{
    public override void EnterState()
    {
        DoAfterWait(1, () => Application.Quit());
    }

    public override void ExitState()
    {
    }
}
