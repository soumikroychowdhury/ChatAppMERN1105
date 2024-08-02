import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components'
import Logout from './Logout'
import ChatInput from './ChatInput'
import axios from 'axios'
import {sendMessageRoute,getAllMessagesRoute} from '../utils/APIRoutes'
import {v4 as uuidv4} from 'uuid'
function ChatContainer({currentChat,currentUser,socket}) {
  const [messages,setMessages]=useState([]);
  const [receivedMessages,setReceivedMessages]=useState([]);
  const scrollRef=useRef();
  useEffect(()=>{
    const check=async()=>{
      if(currentUser&&currentChat){
        const response=await axios.post(getAllMessagesRoute,{from:currentUser._id,to:currentChat._id});
        setMessages(response.data);
      }
    }
    check();
  },[currentChat]);
  const handleSendMessage=async(message)=>{
    await axios.post(sendMessageRoute,{from:currentUser._id,to:currentChat._id,message:{text:message}})
    socket.current.emit('send-message',{to:currentChat._id,from:currentUser._id,message:{text:message}})
    const msg1=[...messages];
    msg1.push({fromSelf:true,message});
    setMessages(msg1);
  };
  useEffect(()=>{
    if(socket.current){
      socket.current.on('receive-message',(data)=>{
        setReceivedMessages({fromSelf:false,message:data.text});
      })
    }
  },[]);
  useEffect(()=>{
    receivedMessages&&setMessages((pre)=>[...pre,receivedMessages]);
  },[receivedMessages]);
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])
  return (
    <>
    {
        currentChat&&(
    <Container>
        <div className="chat-header">
            <div className="user-details">
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar"/>
                </div>
                <div className="username">
                    <h3>{currentChat.username}</h3>
                </div>
            </div>
            <Logout/>
        </div>
        <div className="chat-messages">
          {messages.map((message,index)=>{
            return(<div ref={scrollRef} key={`${index}`}>
              <div className={`message ${message.fromSelf?'sent':'received'}`}>
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>)
          })}
        </div>
        <ChatInput handleSendMessage={handleSendMessage}/>
    </Container>
        )
    }
    </>
  )
}
const Container=styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sent {
    justify-content: flex-end;
    .content {
      background-color: #4f04ff21;
    }
  }
  .received {
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
}`;
export default ChatContainer