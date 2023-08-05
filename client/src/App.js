import {BrowserRouter,Routes,Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes';
import ApplyDoctor from './pages/ApplyDoctor';
import Notification from './pages/Notification';
import Users from './pages/admin/Users';
import Doctor from './pages/admin/Doctor';
import Profile from './pages/doctor/Profile';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
function App() {
  const {Loading} = useSelector((state) => state.alerts)
  return (
    <>
     <BrowserRouter>
     {Loading ? (<Spinner/>):(
     <Routes>
      <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
      <Route path='/appointments' element={<ProtectedRoutes><Appointments/></ProtectedRoutes>}/>
      <Route path='/doctor-appointments' element={<ProtectedRoutes><DoctorAppointments/></ProtectedRoutes>}/>
      <Route path='/apply-doctor' element={<ProtectedRoutes><ApplyDoctor/></ProtectedRoutes>}/>
      <Route path='/admin/users' element={<ProtectedRoutes><Users/></ProtectedRoutes>}/>
      <Route path='/admin/doctors' element={<ProtectedRoutes><Doctor/></ProtectedRoutes>}/>
      <Route path="/doctor/profile/:id" element={<ProtectedRoutes><Profile/></ProtectedRoutes>} />
      <Route path='/doctor/book-appointment/:doctorId' element={<ProtectedRoutes><BookingPage/></ProtectedRoutes>}/>
      <Route path='/notification' element={<ProtectedRoutes><Notification/></ProtectedRoutes>}/>
      <Route path='/login' element={<PublicRoutes><Login/></PublicRoutes>}/>
      <Route path='/register' element={<PublicRoutes><Register/></PublicRoutes>}/>
     </Routes>
     )}
     </BrowserRouter>
    </>
  );
}

export default App;
