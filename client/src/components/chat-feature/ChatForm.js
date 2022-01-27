// equivalent to App.js
import React, {useState} from 'react'
import io from 'socket.io-client'
import Chat from './Chat'
import './Chat.css'

let socket = io.connect("http://localhost:8000")

function ChatForm() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [showChats, setShowChats] = useState(false)

  const join_room = () => {
    if(username && room){
      socket.emit('join_room', room)
      setShowChats(true)
    }
  }

  return (
    <div className="Chat-App">
      {!showChats ? (
             <div className="joinChatContainer">
             <h3>Join the chat room</h3>
             <label style={{textAlign: "left"}}>Name: </label>
             <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
             <label style={{textAlign: "left"}}>Room: </label>
             <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}/>
             <div className="error">Remember this chat will get wiped out on page-reload.</div>
             <button onClick={join_room}>Join the room</button>
             </div>
      ) : (
        <Chat socket={socket} username={username} room={room}/>
      )}
    </div>
  )
}

export default ChatForm
