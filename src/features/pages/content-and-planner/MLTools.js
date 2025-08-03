import React, { useState } from "react";
import BasicResearchDataMLTools from "./BasicResearchDataMLTools";
import SeeSurveys from "./SeeSurveys";

export default function MLTools () {

    const [ selected, setSelected ] = useState('');

    return (
        <div className="ml-tools">

            <ul>
                <li onClick={() => setSelected('basic')}>Basic Research Data Tools</li>
                <li onClick={() => setSelected('survey')}>Survey Data Tools</li>
            </ul>

            {selected === 'basic' && (<BasicResearchDataMLTools />)}
            {selected === 'survey' && (<SeeSurveys />)}
            
        </div>
    );
}