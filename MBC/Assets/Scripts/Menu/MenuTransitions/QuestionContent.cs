using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using UnityEngine;
using System.Linq;
using System.Threading.Tasks;
using System;
using UnityEngine.UI;

public class QuestionContent : MonoBehaviour, IMenuTransition
{
    public EditCategory editCategory;
    public EditQuestion editQuestion;

    public GameObject scrollRectCategoryPrefab;
    public GameObject scrollRectAdd;

    public GameObject AddQuestionPrefab;

    public Transform scrollRectParent;
    public Scrollbar categoryScrollbar;

    private List<GameObject> scrollRects = new List<GameObject>();
    private int curRect = 0;
    private async Task LoadQuestions()
    {
        //get data for all categorys
        string dataCategories = await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.gameserverURL + "/api/categories", Credentials.admintoken);

        Node parsedDataCategories = Node.ConstructFrom(dataCategories);
        List<Category> readyCategories = new List<Category>();

        //create scrollrects
        for (int iCategory = 0; iCategory < parsedDataCategories.Count(); iCategory++)
        {
            GameObject newScrollrect = GameObject.Instantiate(scrollRectCategoryPrefab, scrollRectParent);
            newScrollrect.SetActive(false);
            scrollRects.Add(newScrollrect);
            Category c = GetCategory(newScrollrect.transform.GetChild(0).GetChild(0));
            c.Set();
            readyCategories.Add(c);
        }
        scrollRects.Add(scrollRectAdd);
        scrollRectAdd.SetActive(false);

        scrollRects[0].SetActive(true);

        //fill scrollrects with categories
        for (int iCategory = 0; iCategory < parsedDataCategories.Count(); iCategory++)        
            readyCategories[iCategory].Set(parsedDataCategories[iCategory]["id"].ToString(), parsedDataCategories[iCategory]["requiredLevel"].ToString(), parsedDataCategories[iCategory]["name"].ToString(), () => ScrollLeft(), () => ScrollRight(), x => EditCategory(x));

        //do slide size and steps
        categoryScrollbar.size = 1f / scrollRects.Count;
        categoryScrollbar.numberOfSteps = scrollRects.Count;
        curRect = 0;
        SetNewRect();

        //get question data
        string dataQuestion = await HTTPManager.current.AsyncSend(HttpMethod.Get, Credentials.gameserverURL + "/api/questions", Credentials.admintoken);
        Node parsedDataQuestions = Node.ConstructFrom(dataQuestion);

        //load questions
        for(int iQuestion = 0; iQuestion < parsedDataQuestions.Count(); iQuestion++)
        {
            Transform parent = null;
            for (int iCategory = 0; iCategory < categories.Count; iCategory++)
            {
                if(categories[iCategory].id.text == parsedDataQuestions[iQuestion]["categoryID"].ToString())
                {
                    parent = scrollRects[iCategory].transform.GetChild(0).GetChild(0);
                    break;
                }
            }
            if (parent == null)
                continue;

            int temp = iQuestion;
            Question question = GetQuestion(parent);
            question.Set(parsedDataQuestions[iQuestion]["id"].ToString(),
                parsedDataQuestions[iQuestion]["answerTime"].ToString(),
                parsedDataQuestions[iQuestion]["requiredLevel"].ToString(),
                parsedDataQuestions[iQuestion]["score"].ToString(),
                parsedDataQuestions[iQuestion]["text"].ToString(),
                parent.childCount,
                (x) => EditQuestion(x, parsedDataQuestions[temp]["categoryID"].ToString())
            );
        }
    }

    private async void LoadContent()
    {
        await LoadQuestions();

        //scrollrect sizes and AddQuestion Button
        for(int i = 0; i< scrollRects.Count - 1; i++)
        {
            RectTransform rt = (RectTransform)scrollRects[i].transform.GetChild(0).GetChild(0);

            GameObject button = GameObject.Instantiate(AddQuestionPrefab, rt);
            button.SetActive(true);
            RectTransform rtButton = ((RectTransform)button.transform);
            rtButton.anchoredPosition = new Vector2(0, -10 - 160 * rt.childCount);
        }
        foreach (GameObject rect in scrollRects)
        {
            RectTransform rt = (RectTransform)rect.transform.GetChild(0).GetChild(0);
            rt.sizeDelta = new Vector2(rt.sizeDelta.x, 85 + 160 * rt.childCount);
        }

        scrollRectAdd.transform.GetChild(0).GetChild(0).GetChild(1).gameObject.SetActive(scrollRects.Count != 1);
    }

    public void OnLoad()
    {
        LoadContent();
    }
    public void OnExit()
    {
        StartCoroutine("Unload");
    }

    public void UpdateQuestions()
    {
        DoUnload();
        LoadContent();
    }
    public IEnumerator Unload()
    {
        yield return new WaitForSeconds(0.5f);
        DoUnload();
    }


    #region private helper functions
    private List<Category> categories = new List<Category>();
    private List<Question> questions = new List<Question>();

    private Category GetCategory(Transform parent)
    {
        Category category = categories.Find(g => !g.gameObject.activeSelf);
        if (category == null)
        {
            category = Category.Create(parent);
            categories.Add(category);
        }
        else
        {
            category.transform.parent = parent;
        }
        return category;
    }
    private Question GetQuestion(Transform parent)
    {
        Question question = questions.Find(g => !g.gameObject.activeSelf);
        if (question == null)
        {
            question = Question.Create(parent);
            questions.Add(question);
        }
        else
        {
            question.transform.parent = parent;
        }
        return question;
    }

    private void DoUnload()
    {
        categories.Clear();
        questions.Clear();

        for (int i=scrollRects.Count-2; i>=0; i--)
        {
            Destroy(scrollRects[i]);
        }
        scrollRects.Clear();

        Category.number = 0;
        Question.number = 0;
    }

    private void SetNewRect()
    {
        scrollRects[curRect].SetActive(true);
        categoryScrollbar.value = curRect / ((float)categoryScrollbar.numberOfSteps-1);
    }
    #endregion

    #region public buttonevent functions
    public void ScrollLeft()
    {
        scrollRects[curRect].SetActive(false);
        curRect = Mathf.Clamp(curRect - 1, 0, scrollRects.Count);
        SetNewRect();
    }
    public void ScrollRight()
    {
        scrollRects[curRect].SetActive(false);
        curRect = Mathf.Clamp(curRect + 1, 0, scrollRects.Count);
        SetNewRect();
    }
    public void EditCategory(int i)
    {
        editCategory.Set(categories[i].id.text, categories[i].text.text, categories[i].level.text);
        MenuController.current.ChangeState(8);
    }
    public void AddCategory()
    {
        MenuController.current.ChangeState(8);
    }
    public void EditQuestion(int i, string s)
    {
        editQuestion.Set(questions[i].id.text, questions[i].text.text, questions[i].score.text, questions[i].level.text, questions[i].time.text, s);
        MenuController.current.ChangeState(9);
    }
    public void AddQuestion()
    {
        string category = scrollRects[curRect].transform.GetChild(0).GetChild(0).GetChild(0).GetComponent<Category>().id.text;
        editQuestion.Set(category);
        MenuController.current.ChangeState(9);
    }
    #endregion
}
