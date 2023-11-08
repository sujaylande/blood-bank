// In this we will wrap all the pages which will need authorization:


import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { GetCurrentUser } from '../apicalls/users'
import { useNavigate } from 'react-router-dom'
import { getLoggedInUserName } from '../utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { SetCurrentUser } from '../redux/userSlice'
import { SetLoading } from '../redux/loaderSlice'


const ProtectedPage = ({children}) => {

    const navigate = useNavigate();

    const {currentUser} = useSelector((state)=>state.users);




    const dispatch = useDispatch();




    // getting logged in user informatioN;

    const getCurrentUser = async()=>{
        try{
            
            dispatch(SetLoading(true));

            const response = await GetCurrentUser();

            dispatch(SetLoading(false));

            if(response.success){
                message.success(response.message);
                
                dispatch(SetCurrentUser(response.data))
                
                // setCurrentUser(response.data);

            }
            else{
                throw new Error(response.message);
            }
        }
        catch(error){
            dispatch(SetLoading(false));
            message.error(error.message)
        }
    }

    useEffect(()=>{
        if(localStorage.getItem("token")){
            getCurrentUser();
        }
        else{
            navigate('/login');
        }
    },[])


  return (
    currentUser && (
        <div>
            <div
                className='flex justify-between items-center bg-primary text-white p-5'
            >
                {/* Header */}

                <div>
                    <h1 className='text-2xl'>Blood Bank</h1>
                    <span className='text-sm'>{currentUser.userType.toUpperCase()}</span>
                </div>

                

            <div className='flex items-center gap-2'>
                <i class="ri-shield-user-line"></i>
                <div className='flex flex-col'>
                    <span className='mr-3 uppercase text-xl cursor-pointer'
                    onClick={()=> navigate('/profile')}
                    >
                    {getLoggedInUserName(currentUser)}
                    </span>
                </div>

                {/* Logout */}

                <span className='flex gap-2 cursor-pointer' onClick={()=>{
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}>

                    <i className="ri-logout-circle-line" ></i>
                    <p>Logout</p>
                </span>


            </div>

            </div>
            {/* Content body */}
            <div className='p-5'>{children}</div>
        </div>
    )
  )
}

export default ProtectedPage



