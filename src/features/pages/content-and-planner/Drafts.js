import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Drafts () {

    const [drafts, setDrafts ] = useState([]);


    const fetchDrafts = async () => {

        const token = localStorage.getItem('token');

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/creator/drafts`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setDrafts(res.data.drafts);
        } catch (err) {
            console.error("Fetch drafts frontend error: ", err.response?.data || err);
        }
    }

    useEffect(() => {
        fetchDrafts();
    }, []);
    return (
        <div className="drafts">

            <h3>Drafts</h3>
            {drafts.length > 0 ? (<div>

            </div>) : (<p>
                Loading drafts...
            </p>)}
            
        </div>
    );
}