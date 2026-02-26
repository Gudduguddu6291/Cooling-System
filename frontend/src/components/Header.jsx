import React, {useState} from 'react';
import { Menu, Bell, User, Search, LayoutDashboard, Database, History, Settings2 } from 'lucide-react';
import { auth, provider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector,useDispatch} from 'react-redux';
import { clearUser } from '../redux/userSlice.js';
import { setUserData } from '../redux/userSlice.js';
import { AnimatePresence, motion } from 'framer-motion';

const Header = ({ setIsOpen }) => {
    const dispatch = useDispatch();
    const {userData} = useSelector((state)=>state.user);
    const handleLogin = async () => {
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;
            const email = user.email;
            const name = user.displayName;
            const result = await axios.post(serverUrl+"/api/auth/googleauth", { name, email }, { withCredentials: true });
            console.log('Response:', result.data);
            dispatch(setUserData(result.data));  // 
        }
        catch (error) {
            console.error('Login failed:', error);
        }
    }

     const handleLogout = async () => {
        try {
            const result = await axios.get(serverUrl+"/api/auth/logout", { withCredentials: true });
            dispatch(clearUser()); 
            console.log('Response:', result.data);
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    }
    const [open, setOpen] = useState(false);
  return (
    <header className="h-20 bg-[#0D2546] border-b border-white/10 flex items-center justify-between px-6 lg:px-10 text-white shrink-0">
  
  {/* Left Section */}
  <div className="flex items-center gap-6">
    
    <button 
      onClick={() => setIsOpen(true)}
      className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
    >
      <Menu size={24} />
    </button>

    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
      <button className="bg-blue-600/20 border border-blue-500/50 px-4 py-2 rounded-xl flex items-center gap-2">
        <LayoutDashboard size={16} /> Dashboard
      </button>

      <button className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
        <Database size={16} /> Add Data
      </button>

      <button className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
        <History size={16} /> History
      </button>

      <button className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
        <Settings2 size={16} /> Control Panel
      </button>
    </nav>
  </div>

  {/* Right Section */}
  <div className="flex items-center gap-3">

    {/* 🔔 Bell */}
    <div className="relative cursor-pointer hover:bg-white/5 p-2 rounded-full transition-colors">
      <Bell size={20} className="text-gray-300" />
      <span className="absolute top-1.5 right-1.5 bg-red-500 w-4 h-4 text-[10px] flex items-center justify-center rounded-full border-2 border-[#0D2546]">
        3
      </span>
    </div>

    {/* 👤 Profile */}
    <div className="relative flex items-center gap-2">

      {userData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="hidden sm:block text-right"
        >
          <p className="text-sm font-semibold">{userData.user.name}</p>
          <p className="text-xs text-blue-400">Master Control</p>
        </motion.div>
      )}

      <div
        className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center border border-white/20 shadow-inner cursor-pointer"
        onClick={() => {
          if (userData) {
            setOpen(!open);
          } else {
            handleLogin();
          }
        }}
      >
        <User size={20} className="text-white" />
      </div>

      <AnimatePresence>
        {open && userData && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-11 w-32 bg-white text-black shadow-xl rounded-lg py-2 z-50"
          >
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  </div>
  </header>
  );
};

export default Header;