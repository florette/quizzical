import "../App.css";

function Intro(props) {
    return (
        <div className="intro">
            <h1>Quizzical</h1>
            <p>Test your knowledge</p>
            <div className="challenge">
                <p>Choose your challenge:</p>
                <ul className="answer--list">
                    <li
                        onClick={(e) => props.setDifficulty(e)}
                        difficulty={"easy"}>
                        Easy
                    </li>
                    <li
                        className="selected"
                        onClick={(e) => props.setDifficulty(e)}
                        difficulty={"medium"}>
                        Medium
                    </li>
                    <li
                        onClick={(e) => props.setDifficulty(e)}
                        difficulty={"hard"}>
                        Hard
                    </li>
                </ul>
            </div>
            <button className="start--btn" onClick={props.start}>
                Start quiz
            </button>
        </div>
    );
}

export default Intro;
