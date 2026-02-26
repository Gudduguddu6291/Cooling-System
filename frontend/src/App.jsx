import React,{useEffect} from 'react';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
export const serverUrl ="http://localhost:8000";
import {getUserProfile} from '../src/services/api.js'
import { useSelector,useDispatch } from 'react-redux';

function App(){
    const dispatch = useDispatch();
    useEffect(()=>{
        getUserProfile(dispatch)  
    },[dispatch])

    const {userData} = useSelector((state)=>state.user);
    console.log(userData);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}
export default App;