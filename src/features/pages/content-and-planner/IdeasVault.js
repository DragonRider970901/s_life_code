import React from "react";
import RequestCSV from "./RequestCSV";
import CreatorSeeRequests from "./CreatorSeeRequests";
import MLTools from "./MLTools";


export default function IdeasVault () {

    return (
        <div className="ideas-vault">

            <h3>Ideas Vault</h3>
            <RequestCSV />

            <h3>Requests</h3>
            <CreatorSeeRequests />

            <h3>Creator ML Tools</h3>
            <MLTools />
            
            
        </div>
    );
}