import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../../style/dektop/recent-surveys.css";

export default function RecentSurveys() {

    const { t } = useTranslation("home");

    const [surveys, setSurveys] = useState([]);

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_API_URL}/public/recent-surveys`)
            .then(res => setSurveys(res.data))
            .catch(err => console.error('Error fetching recent surveys:', err));
    }, []);
    return (
        <div className="recent-surveys-div">
            {/* 📰 Recent Articles Section */}
            <h2>{t("recentSurveys")}</h2>
            <section className="recent-surveys">
                <div className="survey-cards-container">
                {surveys.map(survey => (
                    <div key={survey.id} className="survey-card">
                        <div className="survey-text">
                            <h3>{survey.title}</h3>
                            <p className="author-date">
                                by {survey.username} • {new Date(survey.created_at).toLocaleDateString()}
                            </p>
                        </div>


                        <NavLink to={`/survey/${survey.id}`} className="read-more">TAKE</NavLink>
                    </div>
                ))}</div>
            </section>
        </div>
    )
}