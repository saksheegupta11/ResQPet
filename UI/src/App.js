import './App.css';
import Header from './component/HeaderComponent/Header';
import Nav from './component/NavComponent/Nav';
import Footer from './component/FooterComponent/Footer';
import { Routes, Route } from 'react-router-dom';
import Main from './component/MainComponent/Main';
import Login from './component/LoginComponent/Login';
import Register from './component/RegisterComponent/Register';
import AdminHome from './component/AdminHomeComponent/AdminHome';
import NGOs from './component/NGOsComponent/NGOs';
import Rescue from './component/RescuePetComponent/Rescue';
import ChangePassword from './component/ChangePassAdminComponent/ChangePass';
import EditProfile from './component/EditProfileAdminComponent/EditProfile';
import Managengo from './component/ManageNGOsComponent/ManageNgo';
import Logout from './component/LogoutComponent/Logout';
import NgoHome from './component/NgoHomeComponent/NgoHome';
import EditProfileNgo from './component/EditProfileNgoComponent/EditProfile';
import ChangePasswordNgo from './component/ChangePassNgoComponent/ChangePass';
import ManageRequest from './component/ManageRequestComponent/ManageRequest';
import Auth from './component/AuthComponent/Auth';
import TrackStatus from './component/TrackStatusComponent/TrackStatus';
import ForgotPassword from './component/LoginComponent/ForgotPassword';

function App() {
  return (
    <>
      <Auth />
      <Header />
      <Nav />

      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/admin' element={<AdminHome />} />
        <Route path='/rescue' element={<Rescue />} />
        <Route path='/ngos' element={<NGOs />} />
        <Route path='/cpadmin' element={<ChangePassword />} />
        <Route path='/epadmin' element={<EditProfile />} />
        <Route path='/managengo' element={<Managengo />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/ngo' element={<NgoHome />} />
        <Route path='/cpngo' element={<ChangePasswordNgo />} />
        <Route path='/epngo' element={<EditProfileNgo />} />
        <Route path='/managereq' element={<ManageRequest />} />
        <Route path='/track' element={<TrackStatus />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

