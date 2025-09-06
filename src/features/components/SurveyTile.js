import React from "react";

import "../../style/dektop/survey-data-tools-tile.css";

export default function SurveyTile ({ id, title, onClick }) {

    return (
        <div className="survey-tile" onClick={onClick}>

        <h4>{title}</h4>
        </div>
    );
}