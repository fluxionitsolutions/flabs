import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import axios from 'axios';
import FadeLoader from 'react-spinners/FadeLoader';
import { BASE_URL, UPLOAD_URL, UPLOAD_IMG, GET_IMAGES } from '../../utlilities/config'; 
import { ToastContainer, toast, Slide } from 'react-toastify';
import { spinnerStyles, overlayStyles } from '../../common/style';
import 'react-toastify/dist/ReactToastify.css';


const Labdetails = () => {
    const [loading, setLoading] = useState(false);

    const [headerImage, setHeaderImage] = useState(null)
    const [footerImage, setFooterImage] = useState(null)
    
    const [selectedheader, setSelectedHeader] = useState(null);
    const [selectedFooter, setSelectedFooter] = useState(null);

    const [headerImageUrl, setHeaderImageUrl] = useState(null);
    const [footerImageUrl, setFooterImageUrl] = useState(null)


    const token = localStorage.getItem('accessToken');


    useEffect(() => {
      getData();
    }, []);


    const getData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BASE_URL}${GET_IMAGES}`, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`
          },
        });
        if (response.status === 200) {
          setLoading(false)
          setSelectedHeader(response.data.data[0].HeaderImageUrl)
          setSelectedFooter(response.data.data[0].FooterImageUrl)
          setHeaderImageUrl(response.data.data[0].HeaderImageUrl)
          setFooterImageUrl(response.data.data[0].FooterImageUrl)
        }
      } catch (error) {
        setLoading(false)
        console.error('Error fetching header data:', error);
      }
    };
    
    const formik = useFormik({
      initialValues: {
        headerImage: headerImage,
        footerImage: footerImage,
      },
      onSubmit: async (values, { setSubmitting, resetForm }) => {
        try {
          setLoading(true);
          let headerImageUrlLocal = headerImageUrl;
          let footerImageUrlLocal = footerImageUrl;
    
          if (headerImage) {
            const headerFormData = new FormData();
            headerFormData.append('file', headerImage);
    
            const headerResponse = await axios.post(`${BASE_URL}${UPLOAD_IMG}`, headerFormData, {
              headers: {
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (headerResponse.status === 200) {
              console.log('Header image uploaded:', headerResponse.data.url);
              headerImageUrlLocal = headerResponse.data.url;
            } else {
              throw new Error('Failed to upload header image');
            }
          }
    
          if (footerImage) {
            const footerFormData = new FormData();
            footerFormData.append('file', footerImage);
    
            const footerResponse = await axios.post(`${BASE_URL}${UPLOAD_IMG}`, footerFormData, {
              headers: {
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (footerResponse.status === 200) {
              console.log('Footer image uploaded:', footerResponse.data.url);
              footerImageUrlLocal = footerResponse.data.url;
            } else {
              throw new Error('Failed to upload footer image');
            }
          }
    
          if (headerImageUrlLocal && footerImageUrlLocal) {
            console.log('Both images uploaded:', headerImageUrlLocal, footerImageUrlLocal);
    
            const finalPayload = {
              headerImage: headerImageUrlLocal,
              footerImage: footerImageUrlLocal,
              signature: '',
            };
    
            console.log('Final payload:', finalPayload);
    
            const finalResponse = await axios.put(`${BASE_URL}${UPLOAD_URL}`, finalPayload, {
              headers: {
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (finalResponse.status === 200) {
              toast.success('Saved successfully!', { autoClose: 3000 });
              resetForm();
              getData();
            } else {
              throw new Error('Failed to submit final data');
            }
          }
    
        } catch (error) {
          setLoading(false);
          toast.error(error.response?.data?.message || 'An error occurred', {
            autoClose: 5000,
          });
          console.log(error);
        } finally {
          setLoading(false);
          setSubmitting(false);
        }
      },
    });
    

    const handleInputImage = (event, type) => {
      if (event.target.files && event.target.files[0]) {
          const imageUrl = URL.createObjectURL(event.target.files[0]);
          if (type === 'header') {
              setSelectedHeader(imageUrl);
              setHeaderImage(event.target.files[0])
          } else if (type === 'footer') {
              setSelectedFooter(imageUrl);
              setFooterImage(event.target.files[0])
          }
      }
    }

    return (
      <div className="flex h-screen bg-background">
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
        <div className="flex w-full flex-col overflow-hidden">
            <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar" style={{ height: 'calc(100%)' }}>
                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

                  <div className='flex justify-between gap-5 w-full'>
                    <div className='w-full'>
                      <label htmlFor="Username" className="text-sm font-semibold text-gray-900 dark:text-white">Firm Name</label>
                      <input
                          type="text"
                          placeholder="System Name"
                          className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                          {...formik.getFieldProps('Username')}
                      />
                      {formik.touched.Username && formik.errors.Username ? (
                        <div className="text-red-500 pl-2 pt-1">{formik.errors.Username}</div>
                      ) : null}
                    </div>

                    <div className='w-full'>
                        <label htmlFor="Email" className="text-sm font-semibold text-gray-900 dark:text-white">Email</label>
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                            {...formik.getFieldProps('Email')}
                        />
                        {formik.touched.Email && formik.errors.Email ? (
                          <div className="text-red-500 pl-2 pt-1">{formik.errors.Email}</div>
                        ) : null}
                    </div>
                  </div>

                  <div className='flex justify-between gap-5 w-full'>
                    <div className='w-full'>
                      <label htmlFor="Username" className="text-sm font-semibold text-gray-900 dark:text-white">Phone Number</label>
                      <input
                          type="text"
                          placeholder="System Name"
                          className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                          {...formik.getFieldProps('Username')}
                      />
                      {formik.touched.Username && formik.errors.Username ? (
                        <div className="text-red-500 pl-2 pt-1">{formik.errors.Username}</div>
                      ) : null}
                    </div>

                    <div className='w-full'>
                        <label htmlFor="Email" className="text-sm font-semibold text-gray-900 dark:text-white">Country</label>
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                            {...formik.getFieldProps('Email')}
                        />
                        {formik.touched.Email && formik.errors.Email ? (
                          <div className="text-red-500 pl-2 pt-1">{formik.errors.Email}</div>
                        ) : null}
                    </div>
                  </div>

                  <div className='flex justify-between gap-5 w-full'>
                    <div className='w-full'>
                      <label htmlFor="Username" className="text-sm font-semibold text-gray-900 dark:text-white">Address</label>
                      <input
                          type="text"
                          placeholder="System Name"
                          className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                          {...formik.getFieldProps('Username')}
                      />
                      {formik.touched.Username && formik.errors.Username ? (
                        <div className="text-red-500 pl-2 pt-1">{formik.errors.Username}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className='flex justify-between gap-5 w-full'>
                    <div className='w-full'>
                      <label htmlFor="Username" className="text-sm font-semibold text-gray-900 dark:text-white">Place</label>
                      <input
                          type="text"
                          placeholder="System Name"
                          className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                          {...formik.getFieldProps('Username')}
                      />
                      {formik.touched.Username && formik.errors.Username ? (
                        <div className="text-red-500 pl-2 pt-1">{formik.errors.Username}</div>
                      ) : null}
                    </div>

                    <div className='w-full'>
                        <label htmlFor="Email" className="text-sm font-semibold text-gray-900 dark:text-white">District</label>
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                            {...formik.getFieldProps('Email')}
                        />
                        {formik.touched.Email && formik.errors.Email ? (
                          <div className="text-red-500 pl-2 pt-1">{formik.errors.Email}</div>
                        ) : null}
                    </div>
                  </div>

                  <div className='flex justify-between gap-5 w-full'>
                    <div className='w-full'>
                      <label htmlFor="Username" className="text-sm font-semibold text-gray-900 dark:text-white">State</label>
                      <input
                          type="text"
                          placeholder="System Name"
                          className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                          {...formik.getFieldProps('Username')}
                      />
                      {formik.touched.Username && formik.errors.Username ? (
                        <div className="text-red-500 pl-2 pt-1">{formik.errors.Username}</div>
                      ) : null}
                    </div>

                    <div className='w-full'>
                        <label htmlFor="Email" className="text-sm font-semibold text-gray-900 dark:text-white">Zip Code</label>
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                            {...formik.getFieldProps('Email')}
                        />
                        {formik.touched.Email && formik.errors.Email ? (
                          <div className="text-red-500 pl-2 pt-1">{formik.errors.Email}</div>
                        ) : null}
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-5">

                    <div className="flex flex-col md:flex-row justify-between gap-5">
                      <div className="flex flex-col h-44 w-full  rounded-lg gap-5">
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">Header Image</label>
                          <div className="bg-gray-100 h-20 w-full rounded-lg flex items-center justify-center">
                              {selectedheader ? <img src={selectedheader} alt="Header Preview" className="h-40 w-80 object-contain"/> : "No Image"}
                          </div>
                          <div className="flex flex-row gap-5 w-full justify-end">
                              <label htmlFor="signature-upload" className="lg:w-24 cursor-pointer p-2 bg-gray-100 text-gray-700 text-center border border-gray-200 rounded-lg">
                                  Change
                              </label>
                              <input
                                  type="file"
                                  id="signature-upload"
                                  className="hidden"
                                  onChange={(e) => handleInputImage(e, 'header')}
                              />
                              <label onClick={() => setSelectedHeader(null)} className="w-24 py-2 bg-pink-400 text-gray-700 text-center border border-gray-200 rounded-lg cursor-pointer">
                                  Remove
                              </label>
                          </div>
                      </div>

                      <div className="flex flex-col h-44 w-full rounded-lg gap-5">
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">Footer Image</label>
                          <div className="bg-gray-100 h-20 w-full rounded-lg flex items-center justify-center">

                              {selectedFooter ? <img src={selectedFooter} alt="Footer Preview" className="h-40 w-80 object-contain"/> : "No Image"}
                          </div>
                          <div className="flex flex-row gap-5 w-full justify-end">
                              <label htmlFor="header-upload" className="lg:w-24 cursor-pointer p-2 bg-gray-100 text-gray-700 text-center border border-gray-200 rounded-lg">
                                  Change
                              </label>
                              <input
                                  type="file"
                                  id="header-upload"
                                  className="hidden"
                                  onChange={(e) => handleInputImage(e, 'footer')}
                              />
                              <label onClick={() => setSelectedFooter(null)} className="w-24 py-2 bg-pink-400 text-gray-700 text-center border border-gray-200 rounded-lg cursor-pointer">
                                  Remove
                              </label>
                          </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex w-full justify-end mt-10'>
                      <button type="submit" className="w-40 py-2 mt-6 bg-btnblue text-white cursor-pointer border border-gray-200 rounded-xl">
                          Save
                      </button>
                  </div>
                </form>
            </div>
        </div>
      </div>
    )
}

export default Labdetails;
