import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, POST_LAB } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import { useState } from 'react';

const AddLabModal = ({ setLabModal, refreshData, onLabSaved }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const formik = useFormik({
    initialValues: {
      name: '',
      place: '',
      mobile: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Lab Name is required'),
      place: Yup.string().required('Lab Place is required'),
      mobile: Yup.string(), // Mobile is not required
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}${POST_LAB}`, {}, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Name': values.name,
            'Place': values.place,
            'Mobile': values.mobile,
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          
          setLabModal(false);
          refreshData();

          const newLab = response.data.data[0]; 

          if (onLabSaved) {
            onLabSaved(newLab);
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
        <h2 className="text-2xl mb-4">Add New Lab</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-10">
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Lab Name</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter Lab Name"
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
                <p className='text-sm pl-2'>Lab Place</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="place"
                placeholder="Enter Lab Place"
                className={`w-full p-3 border ${
                  formik.touched.place && formik.errors.place ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.place}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Lab Mobile Number</p>
              </div>
              <input
                type="text"
                name="mobile"
                placeholder="Enter Lab Mobile Number"
                className={`w-full p-3 border ${
                  formik.touched.mobile && formik.errors.mobile ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className='flex justify-end gap-2 w-full'>
            <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
            <button type="button" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl" onClick={() => setLabModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLabModal;
