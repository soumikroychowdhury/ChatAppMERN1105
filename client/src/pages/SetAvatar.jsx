import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import Loader from '../assets/loader.gif'
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import {setAvatarRoute} from '../utils/APIRoutes'
import {Buffer} from 'buffer'
function SetAvatar() {
    const a=`https://api.multiavatar.com/`;
    const getRandomNumbers=(count)=>{
        const numbers=[];
        while(numbers.length<count){
            const randomNum=Math.floor(Math.random()*1000);
            if(!numbers.includes(randomNum)){
                numbers.push(randomNum);
            }
        }
        return numbers;
    }
    const navigate=useNavigate();
    const [avatars,setAvatars]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [selectedAvatar,setSelectedAvatar]=useState('');
    const toastOptions={
        position: 'bottom-right',
        autoClose:8000,
        pauseOnHover:true,
        draggable:true,
        theme:'dark'
    };
    const setProfilePicture=async()=>{};
    const delay=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));
    useEffect(()=>{
      const fetchData=async()=>{
          try{
              const randomNumbers=getRandomNumbers(4);
              const data=[];
              for(const num of randomNumbers){
                  const image=await axios.get(`${a}${num}`);
                  data.push(Buffer.from(image.data,'binary').toString('base64'));
                  await delay(1000);
              }
              setAvatars(data);
              setIsLoading(false);
          }catch(e){
              console.error('Error fetching avatars:',e);
              setIsLoading(false);
          }
      }
      fetchData();
    },[]);
      
  return (<>
  <Container>
    <div className="title-container">
        <h1>Pick Avatar As Your Profile Picture</h1>
    </div>
    <div className="avatars">
        {avatars.map((avatar,index)=>(
            <div className={`avatar ${selectedAvatar===index?'selected':''}`} key={index}>
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=>setSelectedAvatar(index)}/>
            </div>
        ))}
    </div>
  </Container>
  <ToastContainer/>
  </>
  )
}
const Container=styled.div``;
export default SetAvatar