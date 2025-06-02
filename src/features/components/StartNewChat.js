import React, { useEffect, useState } from "react";
import axios from "axios";
export default function StartNewChat() {

    const [ selected, setSelected ] = useState();
    const [ users, setUsers ] = useState();

    const fetchUsers = () => {

        const token = localStorage.getItem('token');

        axios.get('http://localhost:5000/me/users', {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => console.log(res.data))
        .catch(err => alert('Failed to fetch users'));
    }


    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = () => {
        console.log("SUBMITED (TEST)");
    }
    
    return (
        <div className="start-new-chat">
            <form onSubmit={handleSubmit}>
                
            </form>
        </div>
    );
}