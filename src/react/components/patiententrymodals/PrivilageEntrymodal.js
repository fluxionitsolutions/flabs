import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, GET_PRIVILAGE_HEAD, POST_PRIVILAGE_CARD_DATA } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';

const PrivilageEntrymodal = ({ setCardModal, patientId, PatientName, patientMobile, onSave }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [cardHeaders, setCardHeaders] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const fetchHeaderData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${GET_PRIVILAGE_HEAD}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        setCardHeaders(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching header data:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      mobileNumber: patientMobile || '',
      patientName: PatientName || '',
      cardnumber: '',
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string().required('Mobile Number is required'),
      patientName: Yup.string().required('Patient Name is required'),
      cardnumber: Yup.string().required('Card Number is required'),
      selectedCard: Yup.string().required('Please select a privilege card'),
    }),

    onSubmit: async (values) => {
      console.log('patientID', patientId,'cardNumber', values.cardnumber,'cardID', values.selectedCard,)

      setLoading(true);

      const data = {
        patientID: patientId.toString(),
        cardNumber: values.cardnumber,
        cardID: values.selectedCard.toString(),
      };

      try {
        const response = await axios.post(`${BASE_URL}${POST_PRIVILAGE_CARD_DATA}`, data,{
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          onSave(values.selectedCard, values.cardnumber);
          setCardModal(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCardSelection = (cardId) => {
    setSelectedCardId(cardId);
    formik.setFieldValue('selectedCard', cardId);
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
        <h2 className="text-2xl">Create Privilege Card</h2>
        <form className="space-y-6 p-10" onSubmit={formik.handleSubmit}>
          <h2 className="text-lg mb-4">Select Card</h2>
          <div className='flex gap-3 w-full'>
            {cardHeaders.map(card => (
              <button
                key={card?.CardID}
                type="button"
                className={`w-32 py-2 text-black border border-gray-200 rounded-xl ${
                  selectedCardId === card?.CardID ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={() => handleCardSelection(card?.CardID)}
              >
                {card?.CardName}
              </button>
            ))}
          </div>
          {formik.errors.selectedCard && (
            <p className="text-red-500 text-xs">{formik.errors.selectedCard}</p>
          )}

          <h2 className="text-lg mb-4">Personal Details</h2>

          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Mobile Number</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="mobileNumber"
                readOnly
                placeholder="Enter Mobile Number"
                className={`w-full p-3 border ${
                  formik.touched.mobileNumber && formik.errors.mobileNumber ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                <p className="text-red-500 text-xs">{formik.errors.mobileNumber}</p>
              )}
            </div>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Patient Name</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="patientName"
                readOnly
                placeholder="Enter Patient Name"
                className={`w-full p-3 border ${
                  formik.touched.patientName && formik.errors.patientName ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.patientName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.patientName && formik.errors.patientName && (
                <p className="text-red-500 text-xs">{formik.errors.patientName}</p>
              )}
            </div>
          </div>

          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Card Number</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="cardnumber"
                placeholder="Enter Privilege Card Number"
                className={`w-full p-3 border ${
                  formik.touched.cardnumber && formik.errors.cardnumber ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.cardnumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.cardnumber && formik.errors.cardnumber && (
                <p className="text-red-500 text-xs">{formik.errors.cardnumber}</p>
              )}
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

export default PrivilageEntrymodal;
