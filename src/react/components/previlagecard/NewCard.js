
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, POST_PRIVILAGE_CARD } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

const NewCard = ({ setCardModal, fetchData, fetchData1 }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Card Name is required'),
    description: Yup.string().required('Description is required')
    .min(6, 'Description must be at least 6 characters'),
    amount: Yup.number().required('Amount is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      amount: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}${POST_PRIVILAGE_CARD}`, {}, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'cardName': values.name,
            'description': values.place,
            'amount': values.mobile,
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          toast.success('Card added successfully!');
          fetchData();
          fetchData1();
          setCardModal(false)
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        toast.error('Failed to add card. Please try again.');
      } finally {
        setLoading(false);
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
        <h2 className="text-2xl mb-4">Add New Card</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-10">
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Card Name</p>
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
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm ">{formik.errors.name}</div>
              ) : null}
            </div>

            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Card Description</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="description"
                placeholder="Enter Card Description"
                className={`w-full p-3 border ${
                  formik.touched.description && formik.errors.description ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm ">{formik.errors.description}</div>
              ) : null}
            
            </div>

          </div>


          <div className='flex gap-5 w-1/2'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Card Amount</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="number"
                name="amount"
                placeholder="Enter Card Amount"
                className={`w-full p-3 border ${
                  formik.touched.amount && formik.errors.amount ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.amount && formik.errors.amount ? (
                <div className="text-red-500 text-sm ">{formik.errors.amount}</div>
              ) : null}
            </div>

          </div>
            
          <div className='flex justify-end gap-2 w-full'>
            <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
            <button type="button" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl" onClick={() => setCardModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCard;
