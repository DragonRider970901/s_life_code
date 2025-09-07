import axios from "axios";
import React from "react";


import "../../style/dektop/see-requests.css";

export default function RequestTile({ request, onApprove, onReject }) {

    return (
        <div className="request-tile">
            <div className="request-details">
                <p>Request by: <span className="info">{request.creator_id}</span></p>
                <p>Request For:<span className="info">{request.request_for}</span></p>
                <p>Reason:<span className="info">{request.reason}</span></p>
                <p>Created at:<span className="info">{request.created_at}</span></p>
                <p>Status:<span className="info">{request.status}</span></p>
            </div>

            {
                request.status === 'pending' && (
                    <div className="request-action">
                        <button onClick={() => onApprove(request.id)}>Approve</button>
                        <button onClick={() => onReject(request.id)}>Reject</button>
                    </div>
                )
            }


        </div>
    );
}