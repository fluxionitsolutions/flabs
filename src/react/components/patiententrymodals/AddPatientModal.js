import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, GET_PLACE, POST_PATIENT } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import NewPlace from './AddPlaceModal';
import Select from 'react-select';


const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: '200px',
    height: '52px',
    backgroundColor: '#f7f7f7',
    boxShadow: state.isFocused ? '0 0 0 1px #000000' : 'none',
    borderRadius: '6px',
    paddingLeft: '12px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'rgba(38, 132, 255, 0.1)'
      : state.isFocused
      ? 'rgba(38, 132, 255, 0.1)'
      : '#ffffff',
    color: state.isSelected ? '#000000' : state.isFocused ? '#000000' : 'black',
    '&:hover': {
      backgroundColor: 'rgba(38, 132, 255, 0.1)',
      color: '#000000',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 999,
    position: 'absolute',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const calculateAgeFromDOB = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  console.log('heree agee', years, months, days)

  return { years, months, days };
};

const calculateDOBFromAge = (years, months, days) => {
  const today = new Date();
  const birthDate = new Date(today.setFullYear(today.getFullYear() - years, today.getMonth() - months, today.getDate() - days));
  return birthDate.toISOString().split('T')[0];
};

const AddPatientModal = ({ setPatientModal, refreshData, mobileNumber, onPatientSaved }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const [places, setPlaces] = useState([]);
  const [placeModal, setPlaceModal] = useState(false)

  useEffect(() => {
    getPlaces();
  }, []);


  const getPlaces = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${GET_PLACE}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        setPlaces(response.data.data);
      }
    } catch (error) {
      console.log('something got error')
    }
  };

  const formik = useFormik({
    initialValues: {
      mobileNumber: mobileNumber || '', // Prefill with the passed mobile number
      patientName: '',
      dob: '',
      patientPlace: '',
      patientAge: '',
      patientMonths: 0,
      patientDays: 0,
      patientGender: 0,
    },
    validationSchema: Yup.object().shape({
      mobileNumber: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Mobile number must be exactly 10 digits and start with 9, 8, 7, or 6')
        .required('Mobile Number is required'),
      patientName: Yup.string().required('Patient Name is required'),
      dob: Yup.date(),
      patientPlace: Yup.string().required('Patient Place is required'),
      patientAge: Yup.number().positive().integer(),
      patientMonths: Yup.number(),
      patientDays: Yup.number(),
      patientGender: Yup.string().required('Patient Gender is required'),
    }).test('dob-or-age-required', 'Either Date of Birth or Age is required', function (values) {
      const { dob, patientAge } = values;
      if (!dob && (!patientAge)) {
        return this.createError({ path: 'dob', message: 'Either Date of Birth or Age is required' });
      }
      return true;
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (!values.dob) {
          const new_dob = calculateDOBFromAge(values.patientAge, values.patientMonths, values.patientDays);
          values.dob = new_dob;
        } else {
          const ageDetails = calculateAgeFromDOB(values.dob);
          values.patientAge = ageDetails.years;
          values.patientMonths = ageDetails.months;
          values.patientDays = ageDetails.days;
        }

        const data = {
          PatientName: values.patientName,
          MobileNo: values.mobileNumber,
          Gender: values.patientGender,
          Age: values.patientAge,
          DOB: values.dob,
          Place: values.patientPlace,
          Months: values.patientMonths,
          Days: values.patientDays,
        };


        console.log('patioent dataaa', data)


        const response = await axios.post(`${BASE_URL}${POST_PATIENT}`, data, {
          headers: {
            'TenantName': 'Abcd',
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log(response.data.data)
          console.log(response.data.data[0].PatientID)
          setPatientModal(false);
          refreshData();

          const newPatient = response.data.data[0]; 

          if (onPatientSaved) {
            onPatientSaved(newPatient);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const place_options = places.map(item => ({
    value: item.PlaceName,
    label: item.PlaceName,
  }));

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
        <h2 className="text-2xl mb-4">Add New Patient</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-10">
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Mobile Number</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                name="mobileNumber"
                placeholder="Enter Patient Mobile Number"
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
                <p className='text-sm pl-2'>Date Of Birth</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="date"
                name="dob"
                className={`w-full p-3 border ${
                  formik.touched.dob && formik.errors.dob ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dob && formik.errors.dob && (
                <p className="text-red-500 text-xs">{formik.errors.dob}</p>
              )}
            </div>
            <div className="w-full">
            <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Patient Place</p>
                <p className='text-red-500'>*</p>
                </div>
                <Select
                  options={place_options}
                  placeholder="Select Place"
                  className="w-full"
                  isSearchable
                  name="patientPlace"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  value={place_options.find(option => option.value === formik.values.patientPlace)}
                  onChange={(selectedOption) => formik.setFieldValue('patientPlace', selectedOption ? selectedOption.value : '')}
                  styles={customSelectStyles}
                />
                <div className='flex justify-between'>
                  {formik.touched.patientPlace && formik.errors.patientPlace && (
                      <p className="text-red-500 text-xs">{formik.errors.patientPlace}</p>
                  )}
                  <span className='text-sm underline text-blue-500 cursor-pointer pl-2' onClick={() => setPlaceModal(true)}>Add New</span>
                  
                </div>
                
            </div>
          </div>

          <div className='flex justify-between gap-5 w-full'>
            
            <div className='flex justify-between gap-5'>

                <div className="w-full">
                    <div className='flex flex-row gap-1'>
                        <p className='text-sm pl-2'>Patient Age</p>
                        <p className='text-red-500'>*</p>
                    </div>
                    <input
                        type="number"
                        name="patientAge"
                        placeholder="Year"
                        className={`w-full p-3 border ${
                        formik.touched.patientAge && formik.errors.patientAge ? 'border-red-400' : 'border-gray-100'
                        } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                        value={formik.values.patientAge}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                <div className="w-full">
                <div className='flex flex-row gap-1'>
                    <p className='text-sm pl-2'>Months</p>
                </div>

                    <input
                        type="number"
                        name="patientMonths"
                        placeholder="Months"
                        className={`w-full p-3 border ${
                        formik.touched.patientMonths && formik.errors.patientMonths ? 'border-red-400' : 'border-gray-100'
                        } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                        value={formik.values.patientMonths}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                <div className="w-full">
                <div className='flex flex-row gap-1'>
                    <p className='text-sm pl-2'>Days</p>
                </div>

                    <input
                        type="number"
                        name="patientDays"
                        placeholder="Days"
                        className={`w-full p-3 border ${
                        formik.touched.patientDays && formik.errors.patientDays ? 'border-red-400' : 'border-gray-100'
                        } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                        value={formik.values.patientDays}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </div>
            
            {formik.touched.patientAge && formik.errors.patientAge && (
            <p className="text-red-500 text-xs">{formik.errors.patientAge}</p>
            )}


            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Patient Gender</p>
                <p className='text-red-500'>*</p>
              </div>
              <select
                name="patientGender"
                className={`w-full p-3 border ${
                  formik.touched.patientGender && formik.errors.patientGender ? 'border-red-400' : 'border-gray-100'
                } bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                value={formik.values.patientGender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.patientGender && formik.errors.patientGender && (
                <p className="text-red-500 text-xs">{formik.errors.patientGender}</p>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-2 w-full'>
            <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
            <button type="button" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl" onClick={() => setPatientModal(false)}>Cancel</button>
          </div>
        </form>


        {placeModal &&
          <NewPlace setPlaceModal={setPlaceModal} refreshData={getPlaces} />
        }
      </div>
    </div>
  );
};

export default AddPatientModal;
