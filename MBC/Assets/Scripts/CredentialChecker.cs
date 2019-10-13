using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using UnityEngine;
using UnityEngine.UI;

public class CredentialChecker : MonoBehaviour
{
    public GameObject tokenIndicator, gameserverIndicator, userServerIndicator;
    public Button playerButton, questionButton, gamesButton;

    void Start()
    {
        StartCoroutine(CheckContinous());
    }

    private IEnumerator CheckContinous()
    {
        while (true)
        {
            CheckCredentials();
            yield return new WaitForSeconds(1);
        }
    }
    private async void CheckCredentials()
    {
        bool gameserver = false;
        bool userserver = false;
        bool token = false;

        //check gameserver
        try
        {
            await HTTPManager.current.AsyncSend(HttpMethod.Get ,Credentials.gameserverURL + "/api/ping");
            gameserverIndicator.transform.GetChild(0).gameObject.SetActive(true);
            gameserverIndicator.transform.GetChild(1).gameObject.SetActive(false);
            gameserver = true;
        }
        catch (Exception e)
        {
            gameserverIndicator.transform.GetChild(0).gameObject.SetActive(false);
            gameserverIndicator.transform.GetChild(1).gameObject.SetActive(true);
            gameserver = false;
        }

        //check userserver
        try
        {
            await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.userserverURL + "/api/ping");
            userServerIndicator.transform.GetChild(0).gameObject.SetActive(true);
            userServerIndicator.transform.GetChild(1).gameObject.SetActive(false);
            userserver = true;
        }
        catch (Exception e)
        {
            userServerIndicator.transform.GetChild(0).gameObject.SetActive(false);
            userServerIndicator.transform.GetChild(1).gameObject.SetActive(true);
            userserver = false;
        }

        //check token
        try
        {
            if(await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.userserverURL + "/api/ping", Credentials.admintoken) == "pong admin"){
                tokenIndicator.transform.GetChild(0).gameObject.SetActive(true);
                tokenIndicator.transform.GetChild(1).gameObject.SetActive(false);
                token = true;
            }
            else{
                tokenIndicator.transform.GetChild(0).gameObject.SetActive(false);
                tokenIndicator.transform.GetChild(1).gameObject.SetActive(true);
                token = false;
            }
        }
        catch (Exception e)
        {
            userServerIndicator.transform.GetChild(0).gameObject.SetActive(false);
            userServerIndicator.transform.GetChild(1).gameObject.SetActive(true);
            token = false;
        }


        List<int> forbiddenStates = new List<int>(new int[] { 5, 6, 8, 9, 10});
        if((questionButton.interactable && !(gameserver && token)) || (gamesButton.interactable && !(gameserver && token)))
        {
            if (forbiddenStates.Contains(MenuController.current.currentState))
                MenuController.current.ChangeState(2);
           

        }

        forbiddenStates = new List<int>(new int[] { 4, 7 });
        if (playerButton.interactable && !(userserver && token))
        {
            if (forbiddenStates.Contains(MenuController.current.currentState))
                MenuController.current.ChangeState(2);
        }


        playerButton.interactable = userserver && token;
        gamesButton.interactable = gameserver && token;
        questionButton.interactable = gameserver && token;
    }
}
