using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NodeDictionary : Node
{
    private Dictionary<string, Node> dataDic = new Dictionary<string, Node>();

    public NodeDictionary(ref string data)
    {
        data = data.Substring(1);

        while (data[0] != '}')
        {
            while (data[0] == ' ')
                data = data.Substring(1);

            if (data[0] == '"')
            {
                data = data.Substring(1);
                int index = data.IndexOf('"');
                string key = data.Substring(0, index);
                data = data.Substring(index+2);
                dataDic.Add(key, Node.ConstructFrom(ref data));

                while (data[0] == ' ')
                    data = data.Substring(1);

                if (data[0]==',')
                    data = data.Substring(1);
            }
            else
                throw new System.Exception("parsing error, remaining "+data);
        }

        data = data.Substring(1);
    }

    public override int Count()
    {
        throw new System.NotImplementedException();
    }

    public override string ToString()
    {
        string temp = "{";
        foreach (string key in dataDic.Keys)
        {
            if (temp != "{")
                temp += ",";
            temp += "\"" + key + "\":" + dataDic[key].ToString();
        }
        return temp+"}";
    }

    protected override Node Get(int key)
    {
        throw new System.NotImplementedException("Cant ask dict " + ToString() + " for key " + key);
    }

    protected override Node Get(string key)
    {
        return dataDic[key];
    }
}
