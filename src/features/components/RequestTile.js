import axios from "axios";
import React from "react";

export default function RequestTile({ request, onApprove, onReject }) {






    return (
        <div className="request-tile">
            <div className="request-details">
                <h4>Request by {request.creator_id}</h4>
                <h4>Request For: {request.request_for}</h4>
                <p>Reason: {request.reason}</p>
                <p>Created at: {request.created_at}</p>
                <p>Status: {request.status}</p>
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