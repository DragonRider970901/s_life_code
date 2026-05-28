import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SeeFullResult() {

    const [profile, setProfile] = useState();


    const { id } = useParams();


    const fetchProfile = async () => {

        const token = localStorage.getItem('token');

        try {

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/test-result/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
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
    }, []);

    return (
        <div className="see-full-result">
            <h1>See Full Result</h1>
            <p>{profile ? profile.id : "Loading..."}</p>
        </div>
    );
}