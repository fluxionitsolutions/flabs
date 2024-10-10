import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import FadeLoader from 'react-spinners/FadeLoader';
import { BASE_URL, POST_SUPPLIER,GET_SUPPLIER, PUT_SUPPLER } from '../utlilities/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { spinnerStyles, overlayStyles } from '../common/style';
import { IoMdClose } from "react-icons/io";

const validationSchema = Yup.object({
  suppliercode: Yup.string().required('Supplier Code is Required'),
  suppliername: Yup.string().required('Supplier Name is Required'),
  address: Yup.string().required('Address is Required'),
  mobile: Yup.number().required('Mobile Number is Required'),
  gstNo: Yup.string().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/i, 'Invalid GST code  format'),
  place: Yup.string().required('Place is Required'),
});


const NewSupplierEntry = ({ setShowModal1, id, setSelectedSupplierId }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageno, setPageno] = useState(1);
  const [supplier, setSuppliers] = useState([]);
  const [pagesize, setPagesize] = useState(10);


  useEffect(() => {
    if(id){
      getData();
    }
  },[]);

  useEffect(() => {
    formik.setValues({
      suppliercode: supplier?.SupplierCode || '',
      suppliername: supplier?.SupplierName || '',
      address: supplier?.Address || '',
      mobile: supplier?.MobileNo || '',
      gstNo: supplier?.GstNo || '',
      place: supplier?.Place || '',
    
    });
  }, [supplier]);
  
  const getData = async () => {
    try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}${GET_SUPPLIER}`, {
            headers: {
                'TenantName': 'Abcd',
                'PageNo': pageno,
                'PageSize': pagesize,
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Authorization': `Bearer ${token}`,
                'FilterText':id
            },
        });
      
        if (response.status === 200 ) {
            setLoading(false);       
            setSuppliers(response.data.data[0])
            console.log(response.data.data[0])
        }
    } catch (error) {
        setLoading(false);
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const token = localStorage.getItem('accessToken');

  const formik = useFormik({
    initialValues: {
        suppliercode: '',
        suppliername: '',
        address: '',
        mobile: '',
        gstNo: '',
        place: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        setLoading(true)

        const data = {
            SupplierCode: values.suppliercode,
            SupplierName: values.suppliername,
            Address: values.address,
            MobileNo: values.mobile,
            GstNo: values.gstNo,
            Place: values.place,
        };
        if(id){
          const response = await axios.put(`${BASE_URL}${PUT_SUPPLER}`, data, {
            headers: {
              'XApiKey': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${token}`,
              'supplierID':id
            },
          });
  
          if (response.status === 200) {
            setSubmitting(false);
            setLoading(false)
            toast.success('Supplier Saved Successfully', {
              duration: 5000 // Duration in milliseconds
            });
            resetForm();
            const vale = 'suppliers'
            navigate(`/itemsupplier/${vale}`);       
          }
        }else{
          const response = await axios.post(`${BASE_URL}${POST_SUPPLIER}`, data, {
            headers: {
              'XApiKey': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${token}`,          
            },
          });
          if (response.status === 200) {
            setSubmitting(false);
            setLoading(false)
            toast.success('Supplier Saved Successfully', {
              duration: 5000 // Duration in milliseconds
            });
            resetForm();
          }
        }
      } catch (error) {
        setSubmitting(false);
        setLoading(false);  
        toast.error(error.response.data.message, {
          duration: 5000 // Duration in milliseconds
        });
      } finally {
        setSubmitting(false);
        setLoading(false);  
      }     
    },
  });

  const handleClose = () => {
    setSelectedSupplierId(null);
    setShowModal1(false)
  }

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
          transition={Slide} // Corrected prop assignment
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
      <div className="bg-white w-3/2 p-5 rounded-lg shadow-lg transform transition-transform duration-300 ease-out animate-zoom-in">
        <div className='flex justify-between'>
          <h2 className="text-2xl mb-4">Add/Edit Supplier</h2>
          <div className="rounded-md h-7 flex justify-center items-center content-center hover:bg-gray-100 p-1">
            <IoMdClose size={20} color="grey" className="cursor-pointer" onClick={handleClose} />
          </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-10">
          <div className='flex justify-between gap-5 w-full'>
            <div className='w-full'>
            <label htmlFor="Supplier Code">Supplier Code</label>
              <input
                type="text"
                placeholder="Supplier Code"
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                {...formik.getFieldProps('suppliercode')}
              />
              {formik.touched.suppliercode && formik.errors.suppliercode ? (
                <div className="text-red-500 pl-2 pt-1">{formik.errors.suppliercode}</div>
              ) : null}
            </div>        
            <div className='w-full'>
              <label htmlFor="Supplier Name">Supplier Name</label>
              <input
                type="text"
                placeholder="Supplier Name"
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                {...formik.getFieldProps('suppliername')}
              />
              {formik.touched.suppliername && formik.errors.suppliername ? (
                <div className="text-red-500  pl-2 pt-1">{formik.errors.suppliername}</div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-between gap-5 w-full'>
            <div className='w-full'>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                {...formik.getFieldProps('address')}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-red-500 pl-2 pt-1">{formik.errors.address}</div>
              ) : null}
            </div>        
            <div className='w-full'>
              <label htmlFor="mobile">Mobile No</label>
              <input
                type="text"
                placeholder="Mobile"
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                {...formik.getFieldProps('mobile')}
              />
              {formik.touched.mobile && formik.errors.mobile ? (
                <div className="text-red-500  pl-2 pt-1">{formik.errors.mobile}</div>
              ) : null}
            </div>       
          </div>
          <div className='flex justify-between gap-5 w-full'>
            <div className='w-full'>
              <label htmlFor="GST No">GST No</label>
              <input
                type="text"
                placeholder="GST No"
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                {...formik.getFieldProps('gstNo')}
              />
              {formik.touched.gstNo && formik.errors.gstNo ? (
                <div className="text-red-500 pl-2 pt-1">{formik.errors.gstNo}</div>
              ) : null}
            </div>         
            <div className='w-full'>
              <label htmlFor="Place">Place</label>
              <input
                type="text"
                placeholder="Place"
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                {...formik.getFieldProps('place')}
              />
              {formik.touched.place && formik.errors.place ? (
                <div className="text-red-500  pl-2 pt-1">{formik.errors.place}</div>
              ) : null}
          </div>         
          </div>
          <div className='flex gap-5 w-full justify-end'>
            <button type="submit" className="w-40 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewSupplierEntry;
