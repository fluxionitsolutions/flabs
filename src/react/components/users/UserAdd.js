import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, POST_USER, UPLOAD_IMG } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import { useState } from 'react';

const AddUserModal = ({ setUserModal, getData }) => {
  const [loading, setLoading] = useState(false);
  const [signImage, setSignImage] = useState(null)
  const token = localStorage.getItem('accessToken');

  const formik = useFormik({
    initialValues: {
        UserCode: '',
        UserName: '',
        PasswordHash: '',
        Designation: '',
        JoiningDate: '',
        SinatureUrl: ''
    },
    validationSchema: Yup.object({
        UserCode:  Yup.string().required('User Code is required'),
        UserName: Yup.string().required('User Name is required'),
        PasswordHash: Yup.string().required('Password is required'),
        Designation: Yup.string().required('Designation is required'),
        JoiningDate: Yup.date().required('Joining Date is required'),
    }),
    onSubmit: async (values) => {
        console.log(values)

        if (signImage) {
            setLoading(true);
            let headerImageUrlLocal = '';
            const headerFormData = new FormData();
            headerFormData.append('file', signImage);
    
            const headerResponse = await axios.post(`${BASE_URL}${UPLOAD_IMG}`, headerFormData, {
              headers: {
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (headerResponse.status === 200) {
              console.log('Sign image uploaded:', headerResponse.data.url);
              headerImageUrlLocal = headerResponse.data.url;
              values.SinatureUrl = headerImageUrlLocal;
            } else {
              throw new Error('Failed to upload signature image');
            }

            const data = {
                UserCode: values.UserCode,
                UserName: values.UserName,
                PasswordHash: values.PasswordHash,
                Designation: values.Designation,
                JoiningDate: values.JoiningDate,
                SinatureUrl: values.SinatureUrl,
            };
    
            console.log('hereee final dataaa', data)
    
            try {
                const response = await axios.post(`${BASE_URL}${POST_USER}`, data, {
                headers: {
                    'XApiKey': process.env.REACT_APP_API_KEY,
                    'Authorization': `Bearer ${token}`,
                },
                });
                console.log(response.data)
                if (response.status === 200) {
                    setLoading(false);
                    setUserModal(false);
                    getData();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log('nooooo')
            setLoading(true);

            const data = {
                UserCode: values.UserCode,
                UserName: values.UserName,
                PasswordHash: values.PasswordHash,
                Designation: values.Designation,
                JoiningDate: values.JoiningDate,
                SinatureUrl: values.SinatureUrl,
            };
    
    
            console.log('hereee final dataaa', data)
    
            try {
                const response = await axios.post(`${BASE_URL}${POST_USER}`, data, {
                headers: {
                    'XApiKey': process.env.REACT_APP_API_KEY,
                    'Authorization': `Bearer ${token}`,
                },
                });
                console.log(response.data)
                if (response.status === 200) {
                    setLoading(false);
                    setUserModal(false);
                    getData();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

    },
  });


  // Handle image input and preview
  const handleInputImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSignImage(event.target.files[0]); // Set the file to state
      formik.setFieldValue('SinatureUrl', event.target.files[0].name); 
    }
  };

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
        <h2 className="text-2xl mb-4">Add/Edit User</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-10">
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>User Name</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="UserName"
                placeholder="Enter User Name"
                className={`w-full p-3 border ${
                  formik.touched.UserName && formik.errors.UserName ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.UserName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>User Code</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="UserCode"
                placeholder="Enter User Code"
                className={`w-full p-3 border ${
                  formik.touched.UserCode && formik.errors.UserCode ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.UserCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
                <div className='flex flex-row gap-1'>
                    <p className='text-sm pl-2'>Designation</p>
                    <p className='text-red-500'>*</p>
                </div>
                <select
                    name="Designation"
                    className={`w-full p-3 border ${
                    formik.touched.Designation && formik.errors.Designation ? 'border-red-400' : 'border-gray-100'
                    } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                    value={formik.values.Designation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value="" label="Select Designation" />
                    <option value="Staff" label="Staff" />
                    <option value="Admin" label="Admin" />
                    <option value="Trainee" label="Trainee" />
                    <option value="Intern" label="Intern" />
                    <option value="Incharge" label="Incharge" />
                </select>
            </div>

            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Joining Date</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="date"
                name="JoiningDate"
                className={`w-full p-3 border ${
                  formik.touched.JoiningDate && formik.errors.JoiningDate ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.JoiningDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className='flex justify-between gap-5 w-full'>
          <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Password</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="PasswordHash"
                placeholder="Enter Password"
                className={`w-full p-3 border ${
                  formik.touched.PasswordHash && formik.errors.PasswordHash ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.PasswordHash}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Signature</p>
                <p className='text-red-500'>*</p>
              </div>

              <input
                type="file"
                id="SinatureUrl"
                className={`w-full p-3 border ${formik.touched.SinatureUrl && formik.errors.SinatureUrl ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                onChange={(e) => handleInputImage(e)}
              />
            
              {/* <input
                type="file"
                name="SinatureUrl"
                className={`w-full p-3 border ${
                  formik.touched.SinatureUrl && formik.errors.SinatureUrl ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.SinatureUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              /> */}
            </div>
          </div>


          <div className='flex justify-end gap-2 w-full'>
            <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
            <button type="button" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl" onClick={() => setUserModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
