import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SeeFullResult() {

    const [profile, setProfile] = useState();
    const [tests, setTests] = useState([]);


    const { id } = useParams();

    const fetchTests = async () => {

        const token = localStorage.getItem('token');

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/tests-taken`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTests(res.data);
        } catch (err) {
            console.log("Failed to fetch user tests: ", err);
        }
    }


    const fetchProfile = async () => {

        const token = localStorage.getItem('token');

        try {

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/test-result/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProfile({
                ...res.data,
                result: typeof res.data.result === "string" ? JSON.parse(res.data.result) : res.data.result,

            })

        } catch (err) {
            console.error("Error fetching selected profile: ", err);
        }
    }

    useEffect(() => {
        fetchProfile();
        fetchTests();
    }, []);

    const getProfileNumber = () => {
        if (!profile || tests.length === 0) return '0';

        if (profile && tests.length > 0) {
            for (let i = 1; i <= tests.length; i++) {
                if (tests[i - 1].id === profile.id) {
                    return i.toString();
                    break;
                }
            }
        }
    }

        return (
            <div className="see-full-result">
                <h1>See Full Result</h1>
                <p>{profile && tests.length > 0? (
                <div>
                    <h2> Profile Number {getProfileNumber()}</h2>
                </div>) : "Loading..."}</p>
            </div>
        );
    }