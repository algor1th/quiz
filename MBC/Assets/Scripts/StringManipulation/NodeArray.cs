using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NodeArray : Node
{
    private List<Node> dataList = new List<Node>();

    public NodeArray(ref string data)
    {
        data = data.Substring(1);

        while (data[0] == ' ')
            data = data.Substring(1);

        while (data[0] != ']')
        {
            dataList.Add(Node.ConstructFrom(ref data));
            while (data[0] == ' ')
                data = data.Substring(1);
            if (data[0] == ',')
                data = data.Substring(1);
        }

        data = data.Substring(1);
    }

    public override int Count()
    {
        return dataList.Count;
    }

    public override string ToString()
    {
        string temp = "[";
        foreach (Node entries in dataList)
        {
            if (temp != "[")
                temp += ",";
            temp += entries.ToString();
        }
        return temp + "]";
    }

    protected override Node Get(int key)
    {
        return dataList[key];
    }

    protected override Node Get(string key)
    {
        throw new System.NotImplementedException("Cant ask array "+ToString()+" for key "+key);
    }
}
