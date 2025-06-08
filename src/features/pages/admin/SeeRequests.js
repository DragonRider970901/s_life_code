import axios from "axios";
import React, { useEffect, useState } from "react";
import RequestTile from "../../components/RequestTile";

export default function SeeRequests() {

    const [requests, setRequests] = useState([]);



    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get("http://localhost:5000/admin/requests", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("REQUESTS: ", res.data);
            setRequests(res.data);

        } catch (err) {

        }
    }
    useEffect(() => {

        fetchRequests();
    }, []);

    return (
        <div className="requests">
            <h2>Requests</h2>

            {requests && requests.length > 0 && (
                
                
                    requests.map((request) => (<RequestTile key={request.id} creatorId={request.creator_id} createdAt={request.created_at}/>))
                
            )}
        </div>
    );
}