import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSets } from '../../store/setsSlice';
import Set from "./Set";
import { Link } from "react-router-dom";
import axios from "axios";


import "../../style/desktop.css";
import "../../style/dektop/test-page.css";

export default function Test() {

    const sets = useSelector((state) => state.sets.sets);
    const profile = useSelector((state) => state.test);
    //console.log(sets);
    const dispatch = useDispatch();

    const [ condition, setCondition ] = useState(false);
    const [ isLocked, setIsLocked ] = useState(true);
    const [ currentSetIndex, setCurrentSetIndex ] = useState(0);  //keeps track of the current set index

    const firstSetRef = useRef(null);



    useEffect(() => {
        dispatch(fetchSets());
    }, []);

    useEffect(() => {
        console.log(profile);

        let totalSum = 0;

        // Loop through each property in the object
        for (const key in profile) {
            if (profile.hasOwnProperty(key) && profile[key].values) {
                // Only sum if the `values` array exists
                const sum = profile[key].values.reduce((acc, val) => acc + val, 0);  // Sum the values array
                totalSum += sum;
            }
        }

        console.log(totalSum);

        if (totalSum === 36) {
            setCondition(true);
        }
    }, [profile]);

    const handleStartClick = () => {
        setIsLocked(false);

        setTimeout(() => {
            firstSetRef.current?.scrollIntoView( { behavior: 'smooth' });
        }, 100);
    }


    const handleClick = async (e) => {
        if (!condition) {
            e.preventDefault();  // Prevent navigation
            alert("Link is disabled until the condition is met!");
        }
        else {
            const token = localStorage.getItem('token');

            try {
                const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
                const res = await axios.post(
                    `${FRONTEND_URL}/save-result`,
                    { results: profile },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert(res.data.message);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to save results')
            }
        }


    };


    if (sets.length === 0) {
        return (
            <div className="sets-error">
                <h3>No sets matching</h3>
            </div>
        );
    }


    return (
        <div className="test">

            <div className="hero">
                <div className="hero-message">
                    <h1>The Szondi Test</h1>
                    <p>Take the Szondi test, a non-verbal  projective personality test, and find out which of the 16 personality types you are.</p>
                </div>
                <div className="hero-btn" onClick={handleStartClick}>
                    <h2>Start</h2>
                </div>
            </div>


            <div className="container">

                {isLocked && <div className="cover"></div>}
                
                <div className="content">
                    {sets.map((set, index) => (<div ref={index  === 0 ? firstSetRef : null } key={set.id}><Set set={set} locked={index !== currentSetIndex} onNext={() => {setCurrentSetIndex((prev) => prev + 1)}}/></div>))}
                    <Link to="/result" onClick={handleClick} className={!condition ? 'disabled-link result-page-link' : 'result-page-link'}>
                        Go to result page
                    </Link>
                </div>
            </div>



        </div>
    );
}