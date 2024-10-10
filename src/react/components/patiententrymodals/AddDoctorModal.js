import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, POST_DOCTOR } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import { useState } from 'react';

const AddDoctorModal = ({ setDoctorModal, refreshData, onDoctorSaved }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const formik = useFormik({
    initialValues: {
      name: '',
      designation: '',
      department: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Doctor Name is required'),
      designation: Yup.string().required('Doctor Designation is required'),
      department: Yup.string().required('Doctor Department is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}${POST_DOCTOR}`, {}, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Name': values.name,
            'Designation': values.designation,
            'Department': values.department,
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log('hereee', response.data.data[0])
          setDoctorModal(false);

          refreshData();

          const newDoctor = response.data.data[0];
          
          if (onDoctorSaved) {
            onDoctorSaved(newDoctor);
          }

        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {loading && (
        <div style={overlayStyles}>
          <FadeLoader
            color={"#123abc"}
            loading={loading}
            cssOverride={spinnerStyles}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className="bg-white w-3/5 p-5 rounded-lg shadow-lg transform transition-transform duration-300 ease-out animate-zoom-in">
        <h2 className="text-2xl mb-4">Add New Doctor</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-10">
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Doctor Name</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter Doctor Name"
                className={`w-full p-3 border ${
                  formik.touched.name && formik.errors.name ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Doctor Department</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="department"
                placeholder="Enter Doctor Department"
                className={`w-full p-3 border ${
                  formik.touched.department && formik.errors.department ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Doctor Designation</p>
                  <p className='text-red-500'>*</p>
                </div>
              <input
                type="text"
                name="designation"
                placeholder="Enter Doctor Designation"
                className={`w-full p-3 border ${
                  formik.touched.designation && formik.errors.designation ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className='flex justify-end gap-2 w-full'>
            <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
            <button type="button" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl" onClick={() => setDoctorModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
