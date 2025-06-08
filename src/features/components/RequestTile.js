import React from "react";

export default function RequestTile ({ creatorId, createdAt }) {

    return (
        <div className="request-tile">
            <h4>Request by {creatorId}</h4>
            <p>Created at: {createdAt}</p>
        </div>
    );
}