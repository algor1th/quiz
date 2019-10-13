using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NodeValue : Node
{
    private string value;

    public NodeValue(ref string data)
    {
        if (data[0] == '"')
        {
            data = data.Substring(1);
            int i = data.IndexOf('"');
            value = data.Substring(0, i);
            data = data.Substring(i+1);
            return;
        }

        int indexA = data.IndexOf(',');
        int indexB = data.IndexOf('}');
        int indexC = data.IndexOf(']');

        indexA = indexA == -1 ? data.Length : indexA;
        indexB = indexB == -1 ? data.Length : indexB;
        indexC = indexC == -1 ? data.Length : indexC;

        int index = Mathf.Min(indexA, indexB, indexC);
        value = data.Substring(0,index);
        data = data.Substring(index);        
    }

    public override int Count()
    {
        return 0;
    }

    public override string ToString()
    {
        return value;
    }

    protected override Node Get(int key)
    {
        throw new System.NotImplementedException();
    }

    protected override Node Get(string key)
    {
        throw new System.NotImplementedException();
    }
}
