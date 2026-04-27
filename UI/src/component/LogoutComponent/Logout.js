import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout(){
    const navigate=useNavigate();
    useEffect(()=>{
        localStorage.removeItem('_id');
        localStorage.removeItem('city');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('pincode');
        localStorage.removeItem('mobile');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
         localStorage.removeItem('address');
        navigate('/login');   
    },[])
    return(
        <>
     
        </>
    );
}
export default Logout;