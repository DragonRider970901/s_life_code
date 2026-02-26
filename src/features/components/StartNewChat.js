import React, { useEffect, useState } from "react";
import axios from "axios";
import MessagesWithNewUser from "../pages/MessagesWithUser";
import { useSelector } from "react-redux";


import "../../style/dektop/chat.css";

export default function StartNewChat({ onNewChat }) {
  const [selectedNew, setSelectedNew] = useState();
  const [users, setUsers] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const user = useSelector(s => s.user.data);
  /*useEffect(() => {
    console.log("Users in useEffect: ", users);
  }, [users]);*/

  useEffect(() => {
    console.log("Selected: ", selectedNew);
  }, [selectedNew]);

  const fetchUsers = async () => {



    const token = localStorage.getItem('token');

    

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //console.log("Users res: ", res.data.users);
      //setUsers(res.data.users);
      //console.log(users);
      const list = res.data.users || [];
      setUsers(list);
      if (list.length > 0) setSelectedNew(String(list[0].id)); // initialize selection
      console.log("(START NEW CHAT) Role through store: ", user.role);
    } catch (err) {
      console.log("Failed to fetch users, ", err);
    }

  }


  const startConversation = () => {
    fetchUsers();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNew || !newMsg.trim()) {
      alert("Pick a user and type a message.");
      return;
    }
    console.log("SUBMITTED (TEST)");

    const token = localStorage.getItem('token');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/${user.role}/send-message`, {
        receiverId: selectedNew,
        message: newMsg
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMsg('');
      alert('Message sent!');
      if (typeof onNewChat === 'function') onNewChat();
    } catch (err) {
      alert('Failed to send message.');
    }
  };

  return (
    <div className="start-new-chat">
      <button onClick={startConversation} className="start-new-chat-btn">Start a New Chat</button>



      {users && users.length != 0 &&
        (
          <form onSubmit={handleSubmit} className="start-new-chat-form">
            <select value={selectedNew ?? ''} onChange={(e) => setSelectedNew(e.target.value)}>
              {
                users.map((user) => (<option key={user.id} value={user.id}>{user.username} </option>))
              }
            </select>

            <input
              type="text"
              placeholder="Type your message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              required
            />
            <button type="submit">Start</button>
          </form>
        )}

    </div>
  );
}
