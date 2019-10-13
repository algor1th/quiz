public abstract class Node
{
    protected static Node ConstructFrom(ref string data)
    {
        while (data[0] == ' ')
            data = data.Substring(1);
        switch (data[0])
        {
            case '{':
                return new NodeDictionary(ref data);
            case '[':
                return new NodeArray(ref data);
            default:
                return new NodeValue(ref data);
        }
    }
    public static Node ConstructFrom(string data)
    {
        string tmpData = (string)data.Clone(); //data.Replace(" ", "");
        return ConstructFrom(ref tmpData);
    }

    public Node this[int key]
    {
        get => Get(key);
    }
    public Node this[string key]
    {
        get => Get(key);
    }

    protected abstract Node Get(int key);
    protected abstract Node Get(string key);

    public abstract int Count();

    public bool Equals(string s)
    {
        return ToString().Equals(s);
    }
}