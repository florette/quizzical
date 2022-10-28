import { useState, useEffect } from "react";
import "../App.css";
import { nanoid } from "nanoid";
import Option from "./Option";

function Quiz(props) {
    const [showQuestions, setShowQuestions] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionsLoaded, setQuestionsLoaded] = useState(false);
    const [questionMarkup, setQuestionMarkup] = useState();
    const [displayResult, setDisplayResult] = useState(false);
    const [correctAnsNum, setCorrectAnsNum] = useState(0);
    const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(0);

    function getQuestions() {
        fetch(
            `https://opentdb.com/api.php?amount=5&difficulty=${props.difLevel}`
        )
            .then((res) => res.json())
            .then((data) => {
                const newQ = data.results.map((q) => ({
                    ...q,
                    id: nanoid(),
                }));
                console.log(newQ);

                setQuestionsLoaded(true);
                setShowQuestions(true);
                return setQuestions(newQ);
            });
    }

    // call api
    useEffect(() => {
        console.log("effect ran");
        getQuestions();
    }, []);

    // create markup from api data
    useEffect(() => {
        const questionList = questions.map((question) => {
            const typeMulti = question.type === "multiple";
            const typeBool = question.type === "boolean";

            // make array with wrong and correct answers
            const answerArr = [
                ...question.incorrect_answers,
                question.correct_answer,
            ];

            // shuffle the answers
            const shuffledAswers = shuffledArr(answerArr);
            let answerList;

            // create the answers markup
            if (typeMulti) {
                answerList = shuffledAswers.map((answer) => {
                    const id = nanoid();
                    return (
                        <Option
                            key={id}
                            selectAnswer={selectAnswer}
                            answer={decodeHtml(answer)}
                        />
                    );
                });
            } else if (typeBool) {
                const idTrue = nanoid();
                const idFalse = nanoid();
                answerList = (
                    <>
                        <Option
                            key={idTrue}
                            selectAnswer={selectAnswer}
                            answer={"True"}
                        />
                        <Option
                            key={idFalse}
                            selectAnswer={selectAnswer}
                            answer={"False"}
                        />
                    </>
                );
            }

            // create the questions and answers markup
            return (
                <li key={question.id}>
                    <h2>{decodeHtml(question.question)}</h2>
                    <ul className="answer--list" data-id={question.id}>
                        {answerList}
                    </ul>
                </li>
            );
        });

        setQuestionMarkup(questionList);
    }, [questionsLoaded]);

    function shuffledArr(arr) {
        return arr.reduce(
            (newArr, _, i) => {
                var rand = i + Math.floor(Math.random() * (newArr.length - i));
                [newArr[rand], newArr[i]] = [newArr[i], newArr[rand]];
                return newArr;
            },
            [...arr]
        );
    }

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function selectAnswer(event) {
        console.log("selected", event.target);
        const selectedEl = event.target;
        const listArr = selectedEl.parentNode.childNodes;
        listArr.forEach((el) => el.classList.remove("selected"));
        selectedEl.classList.add("selected");

        // check if all questions are answered and enable the button
        const listSelected = document.querySelectorAll(".selected");
        setAllQuestionsAnswered(listSelected.length);
    }

    function checkAnswers() {
        console.log("check answers", questions);

        // display result
        setDisplayResult(true);

        // display correct answers in green and wrong answers in red
        questions.map((q) => {
            // Grab the set of questions/answers
            const targetList = document.querySelector(
                `.answer--list[data-id="${q.id}"]`
            );
            // List the options text and compare with the correct answer from the API
            const targetChildren = targetList.children;
            for (let child of targetChildren) {
                if (
                    child.className === "selected" &&
                    decodeHtml(q.correct_answer) === child.innerText
                ) {
                    child.classList.add("correct");
                    setCorrectAnsNum((prevState) => prevState + 1);
                } else if (
                    child.className === "selected" &&
                    decodeHtml(q.correct_answer) !== child.innerText
                ) {
                    child.classList.add("wrong");
                } else if (
                    child.className !== "selected" &&
                    decodeHtml(q.correct_answer) === child.innerText
                ) {
                    child.classList.add("correct");
                }
            }
        });
    }

    function playAgain() {
        console.log("play again");
        // Reset the game
        setShowQuestions(false);
        setQuestionsLoaded(false);
        setDisplayResult(false);
        setCorrectAnsNum(0);
        setAllQuestionsAnswered(0);
        // New questions
        getQuestions();
    }

    return (
        <div className="quiz">
            {showQuestions ? (
                <ul className="question--list">{questionMarkup}</ul>
            ) : (
                <p>Loading questions...</p>
            )}
            {displayResult && (
                <div className="result--text">
                    You scored correct {`${correctAnsNum}/${questions.length}`}{" "}
                    answers
                    <button className="play--btn" onClick={playAgain}>
                        Play again
                    </button>
                </div>
            )}

            {questions.length > 0 && !displayResult && showQuestions && (
                <button
                    className="check--btn"
                    title="Answer all the question to check the answers"
                    disabled={allQuestionsAnswered < questions.length}
                    onClick={checkAnswers}>
                    Check answers
                </button>
            )}
        </div>
    );
}

export default Quiz;
