import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL, GET_TEST, GET_ITEM, POST_TEST, PUT_TEST } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import { IoMdClose } from "react-icons/io";
import Select from 'react-select';

const AddTestModal = ({ setShowModal, iD, refreshData }) => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#F3F4F6', // Match the background color
      borderColor: state.isFocused ? '#9CA3AF' : '#E5E7EB', // Match border color
      boxShadow: state.isFocused ? '0 0 0 1px #9CA3AF' : null, // Match box shadow on focus
      padding: '0.30rem', // Match padding
      borderRadius: '0.375rem', // Match border radius
      fontSize: '0.875rem', // Match font size
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 999,
      position: 'absolute',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [pageno, setPageno] = useState(1);
  const [pagesize, setPagesize] = useState(10000);
  const [test, setTest] = useState({});
  const [reagents, setReagents] = useState([]);


  useEffect(() => {
    getItemData();
  }, []);


  useEffect(() => {
    if (iD) {
      console.log('Editing test ID:', iD);
      getTestData();
    }
  }, [iD]);


  const getItemData = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${BASE_URL}${GET_ITEM}`, {
            headers: {
                'TenantName': 'Abcd',
                'PageNo': pageno,
                'PageSize': pagesize,
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Authorization': `Bearer ${token}`
            },
        })
        if (response.status === 200) {
            setLoading(false);
            setReagents(response?.data?.data?.masterData);
        } else {
          console.log('heree')
        }
    } catch (error) {
        setLoading(false);
    } finally {
        setLoading(false);
    }
  };


  const getTestData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_TEST}`, {
        headers: {
          'TenantName': 'Abcd',
          'PageNo': pageno,
          'PageSize': pagesize,
          'XApiKey': process.env.REACT_APP_API_KEY,
          'FilterText': parseInt(iD),
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        setLoading(false);
        setTest(response.data.data.masterData[0]);
        console.log(response.data.data.masterData[0])
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  const item_options = reagents.map(item => ({
    value: item.Item_No,
    label: item.ItemName,
  }));
  const formik = useFormik({
    initialValues: {
      testname: test.TestName || '',
      testcode: test.TestCode || '',
      testsection: test.SectionName || '',
      testrate: test.Rate || '',
      testunit: test.Unit || '',
      testnormalrange: test.NormalRange || '',
      method: test.Methord || '',
      specimen: test.Speciman || '',
      itemNo: test.ItemNo || null,
      lowvalue: test.LowValue || null,
      highvalue: test.HighValue || null,
      minreagentvalue: test.Min_ReAgentValue || null,
      reagentcostunit: test.MinReagentUnit || null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      testname: Yup.string().required('Test Name is required'),
      testcode: Yup.string().required('Test Code is required'),
      testsection: Yup.string().required('Test Section is required'),
      testrate: Yup.number().required('Test Rate is required').positive('Rate must be positive'),
      testunit: Yup.string().required('Test Unit is required'),
      testnormalrange: Yup.string().required('Test Normal Range is required')
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = {
          TestName: values.testname,
          Section: values.testsection,
          Rate: values.testrate,
          TestCode: values.testcode,
          Unit: values.testunit,
          NormalRange: values.testnormalrange,
          Method: values.method,
          Specimen: values.specimen,
          ItemNo: values.itemNo,
          LowValue: values.lowvalue,
          HighValue: values.highvalue,
          MinReagentValue: values.minreagentvalue,
          MinReagentUnit: values.reagentcostunit,
        };
        console.log(JSON.stringify(data));

        if(iD) {
          const response = await axios.put(`${BASE_URL}${PUT_TEST}`, data, {
            headers: {
              'TenantName': 'Abcd',
              'XApiKey': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${token}`,
              'ID': iD
            },
          });
          console.log(response);

          getItemData();
          refreshData();
          setShowModal(false);

        }  else {
          const response = await axios.post(`${BASE_URL}${POST_TEST}`, data, {
            headers: {
              'TenantName': 'Abcd',
              'XApiKey': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log(response);

          getItemData();
          refreshData();
          setShowModal(false);

        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  });


  const selectedReagent = item_options.find(option => option.value === formik.values.itemNo);

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
        <div className='flex justify-between'>
          <h2 className="text-2xl">Add Test</h2>
          <div className="rounded-md h-7 flex justify-center items-center content-center hover:bg-gray-100 p-1">
            <IoMdClose size={20} color="grey" className="cursor-pointer" onClick={() => setShowModal(false)} />
          </div>
        </div>
        <form className="space-y-6 p-5" onSubmit={formik.handleSubmit}>
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Test Name</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Enter Test Name"
                className={`w-full p-3 border ${formik.touched.testname && formik.errors.testname ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('testname')}
              />
              {formik.touched.testname && formik.errors.testname ? (
                <div className="text-red-500 text-sm">{formik.errors.testname}</div>
              ) : null}
            </div>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Test Code</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Enter Test Code"
                className={`w-full p-3 border ${formik.touched.testcode && formik.errors.testcode ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('testcode')}
              />
              {formik.touched.testcode && formik.errors.testcode ? (
                <div className="text-red-500 text-sm">{formik.errors.testcode}</div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Test Section</p>
                <p className='text-red-500'>*</p>
              </div>
              <select
                className={`w-full p-3 border ${formik.touched.testsection && formik.errors.testsection ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('testsection')}
              >
                <option disabled value="">Choose Section</option>
                <option value="Hematology">HAEMATOLOGY</option>
                <option value="BIOCHEMISTRY">BIOCHEMISTRY</option>
                <option value="Microbiology">MICROBIOLOGY</option>
                <option value="Urinalysis">URINE ANALYSIS</option>
                <option value="General">GENERAL</option>
                <option value="SYNOVIAL FLUID ANALYSIS">SYNOVIAL FLUID ANALYSIS</option>
                <option value="PLEURAL FLUID ANALYSIS">PLEURAL FLUID ANALYSIS</option>
                <option value="ENDOCRINOLOGY">ENDOCRINOLOGY</option>
                <option value="SEROLOGY">SEROLOGY</option>
              </select>
              {formik.touched.testsection && formik.errors.testsection ? (
                <div className="text-red-500 text-sm">{formik.errors.testsection}</div>
              ) : null}
            </div>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Test Rate</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="number"
                placeholder="Enter Rate"
                className={`w-full p-3 border ${formik.touched.testrate && formik.errors.testrate ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('testrate')}
              />
              {formik.touched.testrate && formik.errors.testrate ? (
                <div className="text-red-500 text-sm">{formik.errors.testrate}</div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Unit</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Enter Unit"
                className={`w-full p-3 border ${formik.touched.testunit && formik.errors.testunit ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('testunit')}
              />
              {formik.touched.testunit && formik.errors.testunit ? (
                <div className="text-red-500 text-sm">{formik.errors.testunit}</div>
              ) : null}
            </div>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Normal Range</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Enter Normal Range"
                className={`w-full p-3 border ${formik.touched.testnormalrange && formik.errors.testnormalrange ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('testnormalrange')}
              />
              {formik.touched.testnormalrange && formik.errors.testnormalrange ? (
                <div className="text-red-500 text-sm">{formik.errors.testnormalrange}</div>
              ) : null}
            </div>
          </div>

          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Reagent</p>
                <p className='text-red-500'>*</p>
              </div>

              <Select
                options={item_options}
                styles={customSelectStyles}
                placeholder="Select Reagent"
                className="w-full"
                isSearchable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                value={selectedReagent}
                onChange={(selectedOption) => formik.setFieldValue('itemNo', selectedOption.value)}
              />
              {formik.touched.itemNo && formik.errors.itemNo ? (
                <div className="text-red-500 text-sm">{formik.errors.itemNo}</div>
              ) : null}
            </div>
            <div className='flex justify-between gap-5 w-full'>
              <div className="w-full">
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Usage Per Test</p>
                  <p className='text-red-500'>*</p>
                </div>
                <input
                  type="number"
                  placeholder="Reagent Usage Per Test"
                  className={`w-full p-3 border ${formik.touched.minreagentvalue && formik.errors.minreagentvalue ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                  {...formik.getFieldProps('minreagentvalue')}
                />
              </div>

              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Usage Unit</p>
                  <p className='text-red-500'>*</p>
                </div>
                <select
                  className="w-full p-4 border border-gray-100 bg-gray-100 rounded text-sm"
                  {...formik.getFieldProps('reagentcostunit')}
                >
                  <option value=''>Unit</option>
                  <option value='ml'>ml</option>
                  <option value='l'>littre</option>
                  <option value='nos'>nos</option>
                </select>
              </div>
            </div>

          </div>
          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Method</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Enter Method"
                className={`w-full p-3 border ${formik.touched.method && formik.errors.method ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('method')}
              />
            </div>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Specimen</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Enter Specimen"
                className={`w-full p-3 border ${formik.touched.specimen && formik.errors.specimen ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('specimen')}
              />
              {formik.touched.specimen && formik.errors.specimen ? (
                <div className="text-red-500 text-sm">{formik.errors.specimen}</div>
              ) : null}
            </div>
          </div>

          <div className='flex justify-between gap-5 w-full'>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Low Value</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="number"
                placeholder="Enter Low Value"
                className={`w-full p-3 border ${formik.touched.lowvalue && formik.errors.lowvalue ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('lowvalue')}
              />
              {formik.touched.lowvalue && formik.errors.lowvalue ? (
                <div className="text-red-500 text-sm">{formik.errors.lowvalue}</div>
              ) : null}
            </div>
            <div className="w-full">
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>High Value</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="number"
                placeholder="Enter High Value"
                className={`w-full p-3 border ${formik.touched.highvalue && formik.errors.highvalue ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                {...formik.getFieldProps('highvalue')}
              />
              {formik.touched.highvalue && formik.errors.highvalue ? (
                <div className="text-red-500 text-sm">{formik.errors.highvalue}</div>
              ) : null}
            </div>
          </div>

          <div className='flex justify-end gap-2 w-full'>
            <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestModal;
