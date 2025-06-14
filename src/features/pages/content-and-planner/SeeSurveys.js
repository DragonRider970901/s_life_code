import axios from "axios";
import React, { useEffect, useState } from "react";

export default function SeeSurveys() {

    const [surveys, setSurveys] = useState([]);

    const fetchSurveys = async () => {

        const token = localStorage.getItem('token');


        try {
            const res = await axios.get('http://localhost:5000/creator/see-surveys', {
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
    return (
        <div className="see-surveys">

        {surveys.length > 0 && (
            <>
            {surveys.map((survey) => (<p key={survey.id}>{survey.title}</p>))}
            </>
        )}


        </div>
    );
}