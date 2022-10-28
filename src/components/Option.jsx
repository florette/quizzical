import "../App.css";

function Option(props) {
    return (
        <li onClick={(event) => props.selectAnswer(event)}>{props.answer}</li>
    );
}

export default Option;
