import React, { useState } from "react";
import Photo from "./Photo";
import { useDispatch, useSelector } from "react-redux";
import { addDisliked, addLatent, addLiked, addWarehouse } from "../../store/testSlice";

import "../../style/desktop.css";

export default function Set({ set, locked, onNext }) {

    const profile = useSelector((state) => state.test);
    const dispatch = useDispatch();

    const [step, setStep] = useState(0);
    const [message, setMessage] = useState("1. Select the two photos you LIKE the most.");
    const [clickedPhotos, setClickedPhotos] = useState([]);
    const [remaining, setRemaining] = useState([]);
    const [formState, setFormState] = useState(false);
    const [responses, setResponses] = useState([]);

    const factors = ["d", "e", "h", "hy", "k", "p", "m","s"];

    const messages = [
        "1. Select the two photos you LIKE the most.",
        "2. Select the two photos that you DISLIKE the most.",
        "3. Select another two photos you DISLIKE.",
        "Go to next set >>"
    ];

    const findFactor = (photo) => {
        let path = photo;
        const factorWithExtension = path.split('/').pop();
        const factor = factorWithExtension.split('.')[0];
        return factor;
    }

    const handleChange = (photo, value, index) => {
        console.log("factor  ", findFactor(photo));
        console.log("value  ", value);
        console.log("index  ", index);
        const newResponse = { factor: findFactor(photo), choice: parseInt(value) };

        // Update the specific index in the responses array
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            updatedResponses[index] = newResponse;  // Update the response at the specific index
            return updatedResponses;
        });

        console.log("Updated responses: ", responses);
    };

    const handleSubmit = () => {
        console.log("Submitted Responses:", responses);

        if (responses.length < 2 || responses.some((response) => response.choice === undefined)) {
            alert("Please fill in all responses before submitting.");
            return;
        }

        dispatch(addWarehouse(responses[0]));
        dispatch(addWarehouse(responses[1]));

        setFormState(false);
        setRemaining([]);
        setMessage(messages[3]);
        //alert("Responses submitted successfully!");

        onNext(); //Move to next set
    };

    return (
        <div className="set">
            <h1 className="set-title">{set.title}</h1>
            <div className="set-content">
                {set.photos.map((photo) => (
                    <Photo
                        key={photo}
                        photo={photo}
                        onClick={() => {
                            if (locked || clickedPhotos.includes(photo)) return; //Lock logic
                            const factor = findFactor(photo);
                            
                            // Use the callback version of setClickedPhotos to ensure updated state
                            setClickedPhotos((prevState) => {
                                const updatedClickedPhotos = [...prevState, photo];

                                if (updatedClickedPhotos.length === 6) {
                                    // Calculate the remaining photos after updating clickedPhotos
                                    const unchosenPhotos = set.photos.filter(p => !updatedClickedPhotos.includes(p));
                                    setRemaining(unchosenPhotos);
                                    setFormState(true);
                                    console.log("Updated CLICKED: ", updatedClickedPhotos);
                                    console.log("Updated REMAINING: ", unchosenPhotos);
                                }

                                return updatedClickedPhotos;
                            });

                            if (step >= 0 && step < 2) {
                                dispatch(addLiked(factor));
                            } else if (step >= 2 && step < 4) {
                                dispatch(addDisliked(factor));
                            } else if (step >= 4 && step < 6) {
                                dispatch(addLatent(factor));
                            }

                            setStep((prevStep) => prevStep + 1);

                            if (step === 1) {
                                setMessage(messages[1]);
                            } else if (step === 3) {
                                setMessage(messages[2]);
                            } else if(step === 5) {
                                setMessage("");
                            }
                        }
                        
                        }
                        disabled={locked || clickedPhotos.includes(photo)}
                    />
                ))}
            </div>

            <h2 className="set-message">{message}</h2>

            {step >= 6 && formState && (
                <>
                    {remaining.map((photo, index) => (
                        <div key={photo} className="photo-question">
                            <h2>The photo {factors.indexOf(findFactor(photo)) + 1} is to you: </h2>
                            <div>
                                <label className="custom-radio">
                                    <input
                                        type="radio"
                                        name={`response-${index}`}
                                        value="1"
                                        onChange={(e) => handleChange(photo, e.target.value, index)}
                                    />
                                    Liked
                                </label>

                                <label className="custom-radio">
                                    <input
                                        type="radio"
                                        name={`response-${index}`}
                                        value="0"
                                        onChange={(e) => handleChange(photo, e.target.value, index)}
                                    />
                                    Neutral
                                </label>

                                <label className="custom-radio">
                                    <input
                                        type="radio"
                                        name={`response-${index}`}
                                        value="2"
                                        onChange={(e) => handleChange(photo, e.target.value, index)}
                                    />
                                    Disliked
                                </label>
                            </div>
                        </div>
                    ))}

                    <button onClick={handleSubmit} disabled={!formState} className="submit-radio">
                        Submit
                    </button>
                </>
            )}
        </div>
    );
}
