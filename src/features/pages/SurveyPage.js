import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";


import "../../style/dektop/survey-page.css";
import Heart from "../../style/res/icons/heart.png";
import HeartFilled from "../../style/res/icons/heart-filled.png";
import Save from "../../style/res/icons/save-instagram.png";
import SaveHover from "../../style/res/icons/bookmark.png";
import Share from "../../style/res/icons/share.png";
import ShareHover from "../../style/res/icons/share-hover.png";
import More from "../../style/res/icons/dots.png";
import MoreHover from "../../style/res/icons/dots-hover.png";

export default function SurveyPage() {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    const [surveys, setSurveys] = useState([]);



    useEffect(() => {
        
        axios.get(`${window.location.origin}/public/survey/${id}`)
            .then(res => {
                setSurvey(res.data);
            })
            .catch(err => {
                console.error("Failed to load survey:", err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        
        axios.get(`${window.location.origin}/public/recent-surveys`)
            .then(res => setSurveys(res.data))
            .catch(err => console.error('Error fetching recent surveys:', err));
    }, []);

    const handleChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        
        axios.post(`${window.location.origin}/public/survey/${id}/submit`, { answers }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => alert("Thank you for your submission!"))
            .catch(() => alert("Something went wrong."));
    };

    if (loading) return <p>Loading survey...</p>;
    if (!survey) return <p>Survey not found.</p>;

    return (
        <div className="survey-page">

            <div className="article-side-menu">

                <div className="article-menu-button">
                    <img src={Heart} className="icon" />
                    <img src={HeartFilled} className="icon-hover" />
                </div>

                <div className="article-menu-button">
                    <img src={Save} className="icon" />
                    <img src={SaveHover} className="icon-hover" />
                </div>

                <div className="article-menu-button">
                    <img src={Share} className="icon" />
                    <img src={ShareHover} className="icon-hover" />
                </div>

                <div className="article-menu-button">
                    <img src={More} className="icon" />
                    <img src={MoreHover} className="icon-hover" />
                </div>

            </div>

            <div className="survey-section">
                <h1>{survey.title}</h1>

                {survey.questions.map(q => (
                    <div key={q.id} className="survey-question">
                        <p><strong>{q.question_text}</strong> {q.required ? "*" : ""}</p>

                        {q.question_type === "input" && (
                            <input
                                type="text"
                                onChange={e => handleChange(q.id, e.target.value)}
                                required={q.required}
                            />
                        )}

                        {q.question_type === "single" && q.options && (
                            <div className="single-options">
                                {
                                    q.options.map(opt => (
                                        <label key={opt.id} className="answer-option">
                                            <input
                                                type="radio"
                                                name={`question_${q.id}`}
                                                value={opt.option_text}
                                                onChange={e => handleChange(q.id, e.target.value)}
                                            />
                                            {opt.option_text}
                                            {opt.is_other === 1 && " (Other)"}
                                        </label>
                                    ))
                                }
                            </div>

                        )}

                        {q.question_type === "multiple" && q.options && (
                            q.options.map(opt => (
                                <label key={opt.id}>
                                    <input
                                        type="checkbox"
                                        value={opt.option_text}
                                        onChange={e => {
                                            const prev = answers[q.id] || [];
                                            if (e.target.checked) {
                                                handleChange(q.id, [...prev, e.target.value]);
                                            } else {
                                                handleChange(q.id, prev.filter(v => v !== e.target.value));
                                            }
                                        }}
                                    />
                                    {opt.option_text}
                                    {opt.is_other === 1 && " (Other)"}
                                </label>
                            ))
                        )}
                    </div>
                ))}

                <button onClick={handleSubmit} className="submit-survey">Submit Survey</button>
            </div>

            <div className="survey-suggested-panel">
                <h3>Recent Surveys</h3>
                <div className="right-panel-recent-articles">
                    {surveys.map(recent => (
                        <NavLink key={recent.id} className="right-recent-article" to={`/survey/${recent.id}`}>
                            <div>
                                <h4>{recent.title}</h4>
                                <p>by {recent.username}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>

        </div>
    );
}
