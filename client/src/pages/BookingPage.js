import React, { useState,useEffect } from 'react'
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DatePicker, TimePicker, message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice'
function BookingPage() {
  const {user} = useSelector(state => state.user)
  const params = useParams()
  const [doctors, setDoctors] = useState([]);
  const [date,setDate] = useState()
  const [time,setTime] = useState()
  const [isAvailable,setIsAvailable] = useState()
  const dispatch = useDispatch()
  const getUserData = async () => {
    try {
      const response = await axios.post('/api/v1/doctor/getDoctorById',{doctorId:params.doctorId}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
 const handleBooking = async () => {
  try {
    dispatch(showLoading())
    const res = await axios.post('/api/v1/user/book-appointment',{
      doctorId: params.doctorId,
      userId:user._id,
      doctorInfo:doctors,
      data:date,
      userInfo: user,
      time:time,
    },{
    headers:{
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    }
    )
    dispatch(hideLoading())
    if(res.data.success){
      message.success(res.data.message)
    }
  } catch (error) {
    dispatch(hideLoading())
    console.log(error);
  }
 }
 const handleAvailability = async () => {
  try {
    dispatch(showLoading())
    const res = await axios.post('/api/v1/user/booking-availbility',
    {doctorId:params.doctorId,date,time},
    {
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
    )
    dispatch(hideLoading());
    if(res.data.success){
      setIsAvailable(true)
      message.success(res.data.message)
    }else{
      message.error(res.data.message)
    }
  } catch (error) {
    dispatch(hideLoading())
    console.log(error);
  }
 }
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h1>BookingPage</h1>
      <div className="container">
      {doctors && (  
      <div>
      <h4>
            Dr. {doctors.firstName} {doctors.lastName}
      </h4>
          <h4>Fees : {doctors.feesPerConsultation}</h4>
          {doctors.timings && doctors.timings.length >= 2 && (
  <h4>
    Timings: {doctors.timings[0]} - {doctors.timings[1]}
  </h4>
)}
          <div id="d-flex flex-column w-50">
             <DatePicker className='m-2' format="DD-MM-YYYY" onChange={(value) => {
              setIsAvailable(false)  
              setDate(moment(value).format('DD-MM-YYYY'))}}/>
             <TimePicker className='m-2' format="HH:mm" onChange={(values) => {
             setIsAvailable(false)
            setTime(moment(values).format('HH:mm'))}
            }/>
             <button className='btn btn-primary mt-2' onClick={handleAvailability}>
              Check Availability
             </button>
             {isAvailable && (<button className='btn btn-dark mt-3' onClick={handleBooking}>
              Book Now 
             </button>
             )}
          </div>
          </div>
      )}
      </div>
      </Layout>
  )
}

export default BookingPage