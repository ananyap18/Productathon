import React, {useEffect, useState} from 'react';


function Inbox() {
  const [messages, setMessages] = useState([])

  const getUserMessages = async () => {
    try{
      const response = await fetch('/myMessages', {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }         
      })
      const resJSON = await response.json()
      setMessages(resJSON.myMessages)
      console.log("messages length",messages.length)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getUserMessages()
  }, [])

  const inboxToRender = messages.map(msg => {
    return (
    <>
    <h4 style={{paddingBottom: "5px"}}>{msg.sentBy.nickname!=""?msg.sentBy.nickname:"Loading.."}</h4>
    <p>{msg.body!=""?msg.body:"Loading.."}</p>
    <hr />
    </>
  )})

  return (
    <>
    <h2 style={{paddingBottom: "25px"}}>INBOX</h2>
    {messages.length === 0 && <p>Inbox is Empty :(</p>}
    {messages.length !== 0 && inboxToRender}
    </>
  )
  
}

export default Inbox;

