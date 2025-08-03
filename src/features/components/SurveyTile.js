import React from "react";


export default function SurveyTile ({ id, title, onClick }) {

    return (
        <div className="survey-tile" onClick={onClick}>

        <h4>{title}</h4>
        </div>
    );
}