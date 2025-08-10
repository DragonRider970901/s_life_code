import React, { useState } from 'react';
import axios from 'axios';

export default function CreateSurvey() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
  ]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      question_text: '',
      question_type: 'single',
      required: true,
      options: [''],
      isOtherEnabled: false,
    }]);
  };

  const updateQuestion = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/creator/create-survey-full', {
        title,
        questions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Survey created!");
      setTitle('');
      setQuestions([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create survey.");
    }
  };

  return (
    <div className="create-survey">
      <h2>Create Survey</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Survey title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Survey Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxlength="100"
          required
        />

        {questions.map((q, i) => (
          <div key={i} className="survey-question">
            <input
              placeholder={`Question ${i + 1}`}
              value={q.question_text}
              onChange={(e) => updateQuestion(i, 'question_text', e.target.value)}
              required
            />

            <select
              value={q.question_type}
              onChange={(e) => updateQuestion(i, 'question_type', e.target.value)}
            >
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
              <option value="text">Long Answer</option>
              <option value="input">Short Answer</option>
            </select>

            {(q.question_type === 'single' || q.question_type === 'multiple') && (
              <>
                {q.options.map((opt, j) => (
                  <div key={j}>
                    <input
                      placeholder={`Option ${j + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(i, j, e.target.value)}
                    />
                    <button type="button" onClick={() => removeOption(i, j)}>x</button>
                  </div>
                ))}
                <button type="button" onClick={() => addOption(i)}>Add Option</button>
                <label>
                  <input
                    type="checkbox"
                    checked={q.isOtherEnabled}
                    onChange={(e) => updateQuestion(i, 'isOtherEnabled', e.target.checked)}
                  />
                  Include "Other" write-in option
                </label>
              </>
            )}
          </div>
        ))}

        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Submit Survey</button>
      </form>
    </div>
  );
}
