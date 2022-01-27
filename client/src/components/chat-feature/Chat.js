// equivalent to Chat.js
import React, {useState, useEffect} from 'react'
import ScrollToBottom from "react-scroll-to-bottom"

function Chat({socket, username, room}) {
  const [currentMsg, setCurrentMsg]= useState('')
  const [messageList, setMessageList] = useState([])  

  const send_message = async () => {
    if(currentMsg){
      const messageData= {
        room,
        author: username,
        message: currentMsg,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }
      await socket.emit("send_message", messageData)
      setMessageList((List) => [...List, messageData])
      setCurrentMsg('')
    }   
  }  

  useEffect(() => {
    socket.on("recieve_message", (MsgData) => {
      setMessageList((List) => [...List, MsgData])
    })
    console.log(messageList)
  }, [socket])  


  return (
      <div className="chat-window">
        <div className="chat-header">
        <p>{room}</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>          
        </div>
        <div className="chat-footer">
        <input type="text" onChange={(e) => setCurrentMsg(e.target.value)} value={currentMsg}/>
        <button onClick={send_message} className="chat-button"
          onKeyPress={(event) => {
            event.key === "Enter" && send_message();
          }}        
        >&#9658;
        </button>          
        </div>
      </div>
  )
}

export default Chat
