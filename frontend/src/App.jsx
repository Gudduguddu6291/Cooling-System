import React,{useEffect} from 'react';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
export const serverUrl ="http://localhost:8000";
import {getUserProfile} from '../src/services/api.js'
import { useSelector,useDispatch } from 'react-redux';
import AddSensor from './pages/AddSensor';
import Prediction from './pages/Prediction';
import DataHistory from './pages/DataHistory';
import ControlPanel from './pages/ControlPanel';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import { TemperatureProvider } from './context/TemperatureContext.jsx';


function App(){
    const dispatch = useDispatch();
    useEffect(()=>{
        getUserProfile(dispatch)  
    },[dispatch])

    const {userData} = useSelector((state)=>state.user);
    console.log(userData);

    return (
        <TemperatureProvider>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-sensor" element={<AddSensor/>} />
            <Route path="/prediction" element={<Prediction/>} />
            <Route path="/history" element={<DataHistory/>} />
            <Route path="/control-panel" element={<ControlPanel/>} />
            <Route path="/alerts" element={<Alerts/>} />
            <Route path="/reports" element={<Reports/>} />
        </Routes>
        </TemperatureProvider>
    );
}
export default App;