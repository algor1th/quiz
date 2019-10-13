using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MenuController : MonoBehaviour
{
    public static MenuController current;

    public List<MenuState> states;

    [HideInInspector]private MenuState currentstate;
    public int currentState;

    public void Awake()
    {
        current = this;
    }

    public void Start()
    {
        ChangeState(0);
    }

    public void ChangeState(int i)
    {
        currentState = i;
        if (currentstate != null)
        {
            if (currentstate == states[i])
                return;
            currentstate.ExitState();
        }
        currentstate = states[i];
        currentstate.EnterState();
    }

    public void ReloadState()
    {
        currentstate.ExitState();
        currentstate.EnterState();
    }
}
