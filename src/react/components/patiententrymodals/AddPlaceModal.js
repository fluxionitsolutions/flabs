import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, POST_PLACE } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

const NewPlace = ({ setPlaceModal, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const formik = useFormik({
    initialValues: {
      name: '',
      discription: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Place Name is required'),
    }),
    onSubmit: async (values) => {
        console.log(values)
        try {
            const response = await axios.post(`${BASE_URL}${POST_PLACE}`, {}, {
            headers: {
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Name': values.name,
                'Authorization': `Bearer ${token}`,
            },
            });
            if (response.status === 200) {
                setPlaceModal(false);
                refreshData();
            }
        } catch (error) {
            console.error(error);
        }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
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
        <h2 className="text-2xl">Add New Place</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6 pl-10 pr-10 pt-5 pb-5">
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Place Name</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter Card Name"
                className={`w-full p-3 border ${
                  formik.touched.name && formik.errors.name ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className='flex justify-end gap-2 w-full'>
            <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
            <button type="button" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl" onClick={() => setPlaceModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPlace;
