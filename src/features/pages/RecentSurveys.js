import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function RecentSurveys() {

    const [surveys, setSurveys] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/public/recent-surveys')
            .then(res => setSurveys(res.data))
            .catch(err => console.error('Error fetching recent articles:', err));
    }, []);
    return (
        <div className="recent-surveys-div">
            {/* 📰 Recent Articles Section */}
            <section className="recent-surveys">
                <h2>Recent Surveys</h2>
                {surveys.map(survey => (
                    <div key={survey.id} className="survey-card">
                        <h3>{survey.title}</h3>
                        <p className="author-date">
                            by {survey.username} • {new Date(survey.created_at).toLocaleDateString()}
                        </p>
                        
                        <NavLink to={`/survey/${survey.id}`}>Take →</NavLink>
                    </div>
                ))}
            </section>
        </div>
    )
}