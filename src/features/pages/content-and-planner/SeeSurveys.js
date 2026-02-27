import axios from "axios";
import React, { useEffect, useState } from "react";
import SurveyTile from "../../components/SurveyTile";


import "../../../style/dektop/survey-data-tools.css";

export default function SeeSurveys() {

    const [surveys, setSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState();
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState("");

    const tools = [
        { id: 'distribution', label: 'Distribution Chart' },
        { id: 'cramersV', label: "Cramér's V (Association Strength)" },
        { id: 'chiSquare', label: 'Chi-Square Test (p-value)' },
        { id: 'clustering', label: 'Clustering by Type' }
    ];

    const runTool = async (toolId, surveyId, columnId) => {
        const token = localStorage.getItem('token');
        
        console.log(`Running tool: ${toolId}`);
        console.log(`Survey ID: ${surveyId}, Column ID: ${columnId}`);
        // Optionally send a request to the backend or navigate

        if (toolId === "distribution") {
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/creator/ml/distribution`, {
                    surveyId,
                    column: columnId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Distribution result:", res.data);
                // Store in state if you want to render a chart
            } catch (err) {
                console.error("Error running distribution tool:", err);
            }
        }
    };




    const fetchSurveys = async () => {

        const token = localStorage.getItem('token');
        

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/creator/see-surveys`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            //console.log(res.data);
            setSurveys(res.data);
        } catch (err) {
            alert("Failed to fetch surveys");
        }
    }
    useEffect(() => {
        fetchSurveys();

    }, []);

    useEffect(() => {
        if (selectedSurvey) {
            const fetchColumns = async () => {
                try {
                    const token = localStorage.getItem('token');
                    
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/creator/survey-columns/${selectedSurvey.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setColumns(res.data);
                } catch (err) {
                    alert("Failed to fetch survey columns");
                }
            };

            fetchColumns();
        }
    }, [selectedSurvey]);


    return (
        <div className="see-surveys">
            <h3>Survey Data Tools</h3>
            {surveys.length > 0 && (
                <>
                    {surveys.map((survey) => (<SurveyTile key={survey.id} id={survey.id} title={survey.title} onClick={() => setSelectedSurvey(survey)
                    } />))}
                </>
            )}

            {columns.length > 0 && (
                <div className="selected-survey-tools-div">
                    <h4>"{selectedSurvey.title}" Survey Tools</h4>
                    <label htmlFor="column-select">Choose a column to analyze:</label>
                    <select
                        id="column-select"
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                    >
                        <option value="">-- Select a column --</option>
                        {columns.map(col => (
                            <option key={col.id} value={col.id}>{col.label}</option>
                        ))}

                    </select>
                </div>
            )}

            {selectedColumn && (
                <div className="tools-panel">
                    <ul>
                        {tools.map(tool => (
                            <li key={tool.id}>
                                <button onClick={() => runTool(tool.id, selectedSurvey.id, selectedColumn)}>
                                    {tool.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}




        </div>
    );
}