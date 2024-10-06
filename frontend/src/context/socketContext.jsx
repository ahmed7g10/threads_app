
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
const socketContext=createContext();

export const useSocket=()=>{
    return useContext(socketContext); 
}
export const SocketContextProvider=({children})=>{
    const [socket,setSocket]=useState(null);
    const [onlineUsers,setOnlineUsers]=useState([])
    const {user}=useSelector(state=>state.user);
    useEffect(()=>{
        const socket=io("http://localhost:5000",{
            query:{
                userId:user?._id
            }
        })
        setSocket(socket)
        socket.on('getOnlineUsers',(users)=>{
            setOnlineUsers(users);
        })
        
        return ()=>socket &&socket.close();  
    },[user?._id])

    return <socketContext.Provider value={{socket,onlineUsers}}>
        {children} 
    </socketContext.Provider> 
}