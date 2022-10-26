import { useState, useEffect } from "react";
import "./App.css";
import Intro from "./components/Intro";
import Quiz from "./components/Quiz";

function App() {
    const [startScreen, setStartScreen] = useState(true);
    const [difLevel, setDifLevel] = useState("medium");

    function start() {
        setStartScreen(!startScreen);
    }

    function setDifficulty(e) {
        const selectedEl = e.target;
        const listArr = selectedEl.parentNode.childNodes;
        listArr.forEach((el) => el.classList.remove("selected"));
        selectedEl.classList.add("selected");
        setDifLevel(e.target.attributes.difficulty.value);
    }

    return (
        <div className="App">
            {startScreen && (
                <Intro start={start} setDifficulty={setDifficulty} />
            )}
            {!startScreen && <Quiz difLevel={difLevel} />}
        </div>
    );
}

export default App;
