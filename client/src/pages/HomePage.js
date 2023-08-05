import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import DoctorList from '../components/DoctorList';
import { Row } from 'antd';

function HomePage() {
  const [doctors, setDoctors] = useState([]);

  const getUserData = async () => {
    try {
      const response = await axios.get('/api/v1/user/getAllDoctors', {
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h1 className='text-center'>HomePage</h1>
      <Row>
        {doctors.map((doctor) => (
          <DoctorList doctor={doctor} key={doctor.id} />
        ))}
      </Row>
    </Layout>
  );
}

export default HomePage;
