import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SurveyPage() {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/public/survey/${id}`)
            .then(res => {
                setSurvey(res.data);
            })
            .catch(err => {
                console.error("Failed to load survey:", err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:5000/public/survey/${id}/submit`, { answers }, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(() => alert("Thank you for your submission!"))
            .catch(() => alert("Something went wrong."));
    };

    if (loading) return <p>Loading survey...</p>;
    if (!survey) return <p>Survey not found.</p>;

    return (
        <div className="survey-page">
            <h2>{survey.title}</h2>

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
                        q.options.map(opt => (
                            <label key={opt.id}>
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

            <button onClick={handleSubmit}>Submit Survey</button>
        </div>
    );
}
