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

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Created At</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {drafts.map(draft => (
                            <tr key={draft.id}>
                                <td>{draft.id}</td>
                                <td>{draft.title}</td>
                                <td>{draft.createdAt}</td>
                                <td>{draft.updatedAt}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>) : (<p>
                Loading drafts...
            </p>)}
            
        </div>
    );
}