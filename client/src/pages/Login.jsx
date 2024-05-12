import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Link,useNavigate} from 'react-router-dom'
import Logo from '../assets/logo.svg'
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import {loginRoute} from '../utils/APIRoutes'
function Login() {
    const [values,setValues]=useState({
        username:"",password:""
    });
    const navigate=useNavigate();
    const toastOptions={
        position: 'bottom-right',
        autoClose:8000,
        pauseOnHover:true,
        draggable:true,
        theme:'dark'
    };
    const handleValidation=()=>{
        const {username,password}=values;
        if(password===""||username===""){
            toast.error("Username and Password is required",toastOptions);
            return false;
        }
        return true;
    }
    const handleSubmit=async (event)=>{
        event.preventDefault();
        if(handleValidation()){
            const {username,password}=values;
            const {data}=await axios.post(loginRoute,{username,password});
            if(data.status===true){
                localStorage.setItem('chatapp-user',JSON.stringify(data.user));
                navigate('/');
            }
            else{
                toast.error(data.msg,toastOptions);
            }
        };
    }
    const handleChange=(event)=>{
        setValues({...values,[event.target.name]:event.target.value});
    }
  return (
    <>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="Logo" />
                <h1>Chat App</h1>
            </div>
            <input type="text" placeholder="Username" name="username" onChange={(e)=>handleChange(e)} min="4"/>
            <input type="password" placeholder="Password" name="password" onChange={(e)=>handleChange(e)} min="6"/>
            <button type="submit">Login User</button>
            <span>New User? <Link to='/register'>Register</Link></span>
        </form>
    </FormContainer>
    <ToastContainer/>
    </>
  )
}

const FormContainer=styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:1rem;
    align-items:center;
    background-color: #1a1a1a;

    .brand{
        display:flex;
        align-items:center;
        gap:1rem;
        justify-content:center;

        img{
            height:5rem;
        }

        h1{
            color:white;
            text-transform: uppercase;
        }
    }

    form{
        display:flex;
        flex-direction:column;
        gap:2rem;
        background-color: #00000080;
        border-radius:2rem;
        padding: 3rem 5rem;

        input{
            background-color: transparent;
            padding: 1rem;
            border:0.1rem solid #4e0eff;
            border-radius:0.4rem;
            color:white;
            width:100%;
            font-size:1rem;

            &:focus{
                border: 0.1rem solid #997af0;
                outline:none;
            }
        }
        button{
            background-color: #997af0;
            color:white;
            padding: 1rem 2rem;
            border:none;
            font-weight:bold;
            cursor:pointer;
            font-size:1rem;
            text-transform:uppercase;
            transition: 0.5s ease-in-out;
            &:hover{
                background-color: #4e0eff;
            }
        }
        span{
            color:white;
            text-transform:uppercase;
            a{
                color:rgb(153, 140, 240);
                text-decoration:none;
                font-weight:bold;
            }
        }
    }
`;
export default Login