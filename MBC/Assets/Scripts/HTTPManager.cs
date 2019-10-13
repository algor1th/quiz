using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net.Http;
using System.Threading.Tasks;

public class HTTPManager : MonoBehaviour
{
    private HttpClient client = new HttpClient();
    public static HTTPManager current;

    private void Awake()
    {
        current = this;
    }

    public async Task<string> AsyncSend(HttpMethod RequestType, string URL, string token, StringContent content)
    {
        HttpRequestMessage requestMessage = new HttpRequestMessage(RequestType, URL);
        requestMessage.Headers.Add("authentication", token);
        requestMessage.Content = content;

        return await AsyncSend(requestMessage);
    }
    public async Task<string> AsyncSend(HttpMethod RequestType, string URL)
    {
        HttpRequestMessage requestMessage = new HttpRequestMessage(RequestType, URL);
        return await AsyncSend(requestMessage);
    }
    public async Task<string> AsyncSend(HttpMethod RequestType, string URL, string token)
    {
        HttpRequestMessage requestMessage = new HttpRequestMessage(RequestType, URL);
        requestMessage.Headers.Add("authentication", token);

        return await AsyncSend(requestMessage);
    }

    private async Task<string> AsyncSend(HttpRequestMessage requestMessage)
    {
        var response = await client.SendAsync(requestMessage);

        string responseString = await response.Content.ReadAsStringAsync();
        return responseString;
    }
}
