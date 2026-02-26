import { auth, provider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector,useDispatch} from 'react-redux';
import { clearUser } from '../redux/userSlice.js';
import { setUserData } from '../redux/userSlice.js';
function Auth() {
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

    return (
        <div>
            <h1>Authentication Page</h1>
            {userData  ? <button onClick={handleLogout}>logout</button> : (<button onClick={handleLogin}>Login with Google</button>)}
        </div>
    );
}
export default Auth;