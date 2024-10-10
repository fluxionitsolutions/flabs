import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, GET_GROUP, POST_GROUP } from '../../utlilities/config';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerStyles, overlayStyles } from '../../common/style';
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

const AddGroupModal = ({ setShowModal1, tests, groups = [], groupsID, getGroupData }) => {

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
  const [groupData, setGroupData] = useState([]);
  const [pageno, setPageno] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const token = localStorage.getItem('accessToken');


  console.log('insode grouop', tests)

  // useEffect(() => {
  //   getGroupData();
  // }, [pageno, pagesize, groupsID]);

  // const getGroupData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${BASE_URL}${GET_GROUP}`, {
  //       headers: {
  //         'TenantName': 'Abcd',
  //         'PageNo': pageno,
  //         'FilterText': groupsID,
  //         'PageSize': pagesize,
  //         'XApiKey': process.env.REACT_APP_API_KEY,
  //         'Authorization': `Bearer ${token}`
  //       },
  //     });
  //     if (response.status === 200) {
  //       const data = response.data.data.groups;
  //       setGroupData(data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching group data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const validationSchema = Yup.object().shape({
    groupname: Yup.string()
      .required('Group Name is required')
      .test('unique-groupname', 'Group Name is already taken', function (value) {
        return !groups.some(group => group.groupName === value);
      }),
    groupcode: Yup.string()
      .required('Group Code is required')
      .test('unique-groupcode', 'Group Code is already taken', function (value) {
        return !groups.some(group => group.groupCode === value);
      }),
    groupsection: Yup.string().required('Section is required'),
    grouprate: Yup.number().required('Rate is required').positive('Rate must be a positive number'),
    selectedTests: Yup.array().min(1, 'At least one test must be selected'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formattedTests = values.selectedTests.map(test => ({ TestId: parseInt(test.value, 10) }));
      const data = {
        GroupName: values.groupname,
        GroupCode: values.groupcode,
        Rate: parseInt(values.grouprate),
        Section: values.groupsection,
        ShowInReport: values.isShow,
        TestIDs: formattedTests,
      };

      const response = await axios.post(`${BASE_URL}${POST_GROUP}`, data, {
        headers: {
          'TenantName': 'Abcd',
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        getGroupData();
        setShowModal1(false);
      }

    } catch (error) {
      console.error('Error submitting group data:', error);
    } finally {
      setLoading(false);
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
      <div className="bg-white w-4/6 p-5 rounded-lg shadow-lg transform transition-transform duration-300 ease-out animate-zoom-in">
        <h2 className="text-2xl mb-4">Add Group</h2>
        <Formik
          initialValues={{
            groupname: '',
            groupcode: '',
            groupsection: '',
            grouprate: '',
            isShow: true,
            selectedTest: '',
            selectedTests: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="space-y-6">
              <div className='flex justify-between gap-5 w-full'>
                <div className="w-full">
                  <div className='flex flex-row gap-1'>
                    <p className='text-sm pl-2'>Group Name</p>
                    <p className='text-red-500'>*</p>
                  </div>
                  <Field
                    name="groupname"
                    placeholder="Enter Group Name"
                    className={`w-full p-3 border ${touched.groupname && errors.groupname ? 'border-red-500' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                  />
                </div>
                <div className="w-full">
                  <div className='flex flex-row gap-1'>
                    <p className='text-sm pl-2'>Group Code</p>
                    <p className='text-red-500'>*</p>
                  </div>
                  <Field
                    name="groupcode"
                    placeholder="Enter Group Code"
                    className={`w-full p-3 border ${touched.groupcode && errors.groupcode ? 'border-red-500' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                  />
                </div>
              </div>
              <div className='flex justify-between gap-5 w-full'>
                <Field as="select" name="groupsection" className={`w-full p-2 border ${touched.groupsection && errors.groupsection ? 'border-red-500' : 'border-gray-100'} bg-gray-100 rounded text-sm`}>
                  <option disabled value="">Choose Section</option>
                  <option value="BIOCHEMISTRY">BIOCHEMISTRY</option>
                  <option value="Hematology">HAEMATOLOGY</option>
                  <option value="Microbiology">MICROBIOLOGY</option>
                  <option value="Urinalysis">URINE ANALYSIS</option>
                  <option value="General">GENERAL</option>
                  <option value="SYNOVIAL FLUID ANALYSIS">SYNOVIAL FLUID ANALYSIS</option>
                  <option value="PLEURAL FLUID ANALYSIS">PLEURAL FLUID ANALYSIS</option>
                  <option value="ENDOCRINOLOGY">ENDOCRINOLOGY</option>
                  <option value="SEROLOGY">SEROLOGY</option>
                </Field>
                <Field
                  name="grouprate"
                  type="number"
                  placeholder="Rate"
                  className={`w-full p-3 border ${touched.grouprate && errors.grouprate ? 'border-red-500' : 'border-gray-100'} bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500`}
                />
                
              </div>
              <div className='flex items-center gap-2 pl-2'>
                <Field
                  name="isShow"
                  type="checkbox"
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Show In Result</label>
              </div>
              <div className='flex flex-col gap-2'>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg">Tests</h3>
                </div>
                <div className="flex justify-between items-center mr-2 gap-2">

                  {/* <Select
                    options={tests.map(test => ({ value: test.ID, label: test.TestName }))}
                    //styles={customSelectStyles}
                    placeholder="Select Test"
                    className="w-full"
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    value={values.selectedTest}
                    onChange={(option) => {
                      if (!values.selectedTests.some(test => test.value === option.value)) {
                        setFieldValue('selectedTests', [...values.selectedTests, option]);
                        setFieldValue('selectedTest', '');
                      }
                    }}
                  /> */}
                  <Select
                    options={tests.map(test => ({ value: test.ID, label: test.TestName }))}
                    placeholder="Select Test"
                    styles={customSelectStyles}
                    className={`w-full ${errors.selectedTests && touched.selectedTests ? 'border-red-500' : ''}`}
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    value={values.selectedTest}
                    onChange={(option) => {
                      if (!values.selectedTests.some(test => test.value === option.value)) {
                        setFieldValue('selectedTests', [...values.selectedTests, option]);
                        setFieldValue('selectedTest', '');
                      }
                    }}
                  />
                  <div className="p-2 rounded-lg bg-blue-600 cursor-pointer" onClick={() => setFieldValue('selectedTest', '')}>
                    <FiPlus size={15} color="white" />
                  </div>
                </div>
                <div className="rounded-lg shadow-md h-48 mt-2 overflow-y-auto hide-scrollbar">
                  <table className="w-full border-collapse">
                    <thead className='bg-gray-100 sticky top-0'>
                      <tr>
                        <th className="p-2 border-b text-left text-gray-500 font-normal text-sm">Name</th>
                        <th className="p-2 border-b text-left text-gray-500 font-normal text-xs">Section</th>
                        <th className="p-2 border-b text-left text-gray-500 font-normal text-xs">Rate</th>
                        <th className="p-2 border-b text-left text-gray-500 font-normal text-xs">Unit</th>
                        <th className="p-2 border-b text-left text-gray-500 font-normal text-xs">Normal Range</th>
                        <th className="p-2 border-b text-left text-gray-500 font-normal text-xs"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.selectedTests.map((test, index) => (
                        <tr key={index}>
                          <td className="font-normal text-sm p-2">{test.label}</td>
                          <td className="font-normal text-sm p-2">{tests.find(t => t.ID === parseInt(test.value, 10))?.Section}</td>
                          <td className="font-normal text-sm p-2">{tests.find(t => t.ID === parseInt(test.value, 10))?.Rate}</td>
                          <td className="font-normal text-sm p-2">{tests.find(t => t.ID === parseInt(test.value, 10))?.Unit}</td>
                          <td className="font-normal text-sm p-2">{tests.find(t => t.ID === parseInt(test.value, 10))?.NormalRange}</td>
                          <td>
                            <span
                              className="flex items-center justify-center w-6 h-6 bg-rose-100 rounded-lg cursor-pointer"
                              onClick={() => setFieldValue('selectedTests', values.selectedTests.filter(t => t.value !== test.value))}
                            >
                              <MdDelete size={15} color="red" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ErrorMessage name="selectedTests" component="p" className="text-red-500 text-sm pl-2" />
              </div>
              <div className='flex justify-end gap-2 w-full'>
                <button type="submit" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">Save</button>
                <button type="button" className="w-32 py-2 bg-btnblue text-white border border-gray-200 rounded-xl" onClick={() => setShowModal1(false)}>Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddGroupModal;
