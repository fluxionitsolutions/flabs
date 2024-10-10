import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import axios from 'axios';
import { BASE_URL, SAVE_PRINTER, GET_DEVICE_CONFIG } from '../../utlilities/config'; 
import FadeLoader from 'react-spinners/FadeLoader';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { spinnerStyles, overlayStyles } from '../../common/style';
import 'react-toastify/dist/ReactToastify.css';

const Applicationsettings = () => {

  const token = localStorage.getItem('accessToken');
  const [printers, setPrinters] = useState([]);
  const [systemName, setSystemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemId, setSystemId] = useState()

  const [initialFormValues, setInitialFormValues] = useState({
    billPrinter: '',
    resultPrinter: '',
    barcodePrinter: '',
  });

  const isElectron = () => {
    return typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
  };
  
  const getPrinters = async () => {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      try {
        const printers = await ipcRenderer.invoke('get-printers');
        console.log(printers)
        setPrinters(printers);
      } catch (error) {
        console.error('Error fetching printers:', error);
      }
    } else {
      console.log('Not running in Electron');
    }
  };

  const getSystem = async () => {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      try {
        const systemname = await ipcRenderer.invoke('get-system');
        setSystemName(systemname);
        return systemname;
      } catch (error) {
        console.error('Error fetching system name:', error);
        return null;
      }
    } else {
      console.log('Not running in Electron');
      return null;
    }
  };

  const getData = async (sysName) => {
    if (!sysName) return;

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_DEVICE_CONFIG}`, {
        headers: {
          'TenantName': 'Abcd',
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        const data = response.data.data;

        const matchedSystem = data.find(item => item.SystemName === sysName);

        if (matchedSystem) {
          setSystemId(matchedSystem?.SystemID)
          setInitialFormValues({
            billPrinter: matchedSystem.BillPrinter,
            resultPrinter: matchedSystem.ResultPrinter,
            barcodePrinter: matchedSystem.BarcodePrinter,
          });
        } else {
          console.log('No matching system found');
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await getPrinters();
      const sysName = await getSystem();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (systemName) {
      getData(systemName);
    }
  }, [systemName]);

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,  
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);

        const data = {
          sysID: systemId,
          sysName: systemName,
          billPrinter: values.billPrinter,
          resultPrinter: values.resultPrinter,
          barcodePrinter: values.barcodePrinter,
        };

        console.log('Final data:', data);

        const response = await axios.post(`${BASE_URL}${SAVE_PRINTER}`, data, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success('Item Saved Successfully', { duration: 3000 });
          resetForm();
          getData(systemName);
        } else {
          toast.error('Something Gone Wrong !', { duration: 3000 });
        }
      } catch (error) {
        toast.error(error.response.data.message, { duration: 3000 });
      } finally {
        setSubmitting(false);
      }
    },
  });

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
      {formik.isSubmitting && (
        <div style={overlayStyles}>
          <FadeLoader
            color={"#123abc"}
            loading={formik.isSubmitting}
            cssOverride={spinnerStyles}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className="flex w-full flex-col overflow-hidden">
        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar" style={{ height: 'calc(100%)' }}>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-10">
            <div className='flex justify-between gap-20 w-full'>
              <div className='w-full'>
                <label htmlFor="sysName" className="text-sm font-semibold text-gray-900 dark:text-white">System Name</label>
                <input
                  type="text"
                  placeholder="System Name"
                  value={systemName || ''}
                  className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  readOnly
                />
              </div>

              <div className="w-full">
                <label htmlFor="barcodePrinter" className="text-sm font-semibold text-gray-900 dark:text-white">Barcode Printer</label>
                <select
                  className={`w-full p-3 border ${formik.touched.barcodePrinter && formik.errors.barcodePrinter ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded`}
                  {...formik.getFieldProps('barcodePrinter')}
                >
                  <option value="">Choose Printer</option>
                  {printers.map((row, index) => (
                    <option value={row?.displayName} key={index}>{row?.displayName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex justify-between gap-20 w-full'>
              <div className="w-full">
                <label htmlFor="billPrinter" className="text-sm font-semibold text-gray-900 dark:text-white">Bill Printer</label>
                <select
                  className={`w-full p-3 border ${formik.touched.billPrinter && formik.errors.billPrinter ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded`}
                  {...formik.getFieldProps('billPrinter')}
                >
                  <option value="">Choose Printer</option>
                  {printers.map((row, index) => (
                    <option value={row?.displayName} key={index}>{row?.displayName}</option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label htmlFor="resultPrinter" className="text-sm font-semibold text-gray-900 dark:text-white">Result Printer</label>
                <select
                  className={`w-full p-3 border ${formik.touched.resultPrinter && formik.errors.resultPrinter ? 'border-red-400' : 'border-gray-100'} bg-gray-100 rounded`}
                  {...formik.getFieldProps('resultPrinter')}
                >
                  <option value="">Choose Printer</option>
                  {printers.map((row, index) => (
                    <option value={row?.displayName} key={index}>{row?.displayName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex w-full justify-end'>
              <button type="submit" className="w-40 py-2 mt-6 bg-btnblue text-white cursor-pointer border border-gray-200 rounded-xl">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Applicationsettings;
