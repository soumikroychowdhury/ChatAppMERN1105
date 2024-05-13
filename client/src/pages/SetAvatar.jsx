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
    useEffect(()=>{
      if(!localStorage.getItem('chatapp-user')) navigate('/login');
  },[])
  const setProfilePicture=async()=>{
    if(selectedAvatar===undefined){
        toast.error('Please select an avatar',toastOptions);
    }
    else{
        const user=await JSON.parse(localStorage.getItem('chatapp-user'));
        const {data}=await axios.post(`${setAvatarRoute}/${user._id}`,{image:avatars[selectedAvatar]});
        if(data.isSet){
            user.isAvatarImageSet=true;
            user.avatarImage=data.image;
            localStorage.setItem('chatapp-user',JSON.stringify(user));
            navigate('/');
        }
        else{
            toast.error('Error setting avatar',toastOptions);
        }
    }
  };
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
      
  return (<>{
    isLoading ? <Container>
      <img src={Loader} alt="loader" className="loader"/>
    </Container>:(
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
      <button className="submit-btn" onClick={setProfilePicture}>Set Avatar</button>
    </Container>)}
  <ToastContainer/>
  </>
  )
}
const Container=styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;
.loader {
  max-inline-size: 100%;
}
.title-container {
  h1 {
    color: white;
  }
}
.avatars {
  display: flex;
  gap: 2rem;
  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    img {
      height: 6rem;
      transition: 0.5s ease-in-out;
    }
  }
  .selected {
    border: 0.4rem solid #4e0eff;
  }
}
.submit-btn {
  background-color: #4e0eff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  &:hover {
    background-color: #4e0eff;
  }
}`;
export default SetAvatar