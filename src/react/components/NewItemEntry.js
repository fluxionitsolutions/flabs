import React,{useState,useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import FadeLoader from 'react-spinners/FadeLoader';
import { BASE_URL,GET_ITEM, POST_ITEM, PUT_ITEM } from '../utlilities/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { spinnerStyles, overlayStyles } from '../common/style';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";

const validationSchema = Yup.object({
  itemName: Yup.string().required('Item Name Required'),
  company: Yup.string().required('Company is Required'),
  ItemType: Yup.string().required('Item Type is Required'),
  category: Yup.string(),
  PackageSize: Yup.number().required('Package SizeRequired'),
  PackageUnit: Yup.string().required('Unit is Required'),
  costpertest: Yup.number().required('Cost Per TestRequired'),
  CostpertestUnit: Yup.string().required('Unit is Required'),
  reorderlevel: Yup.number().required('Reorder Level Required'),
  reorderlevelunit: Yup.string().required('Unit is Required'),
});


const NewItemEntry = ({ setShowModal, id, setSelectedItemId, getItemData }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageno, setPageno] = useState(1);
  const [items, setItems] = useState([]);
  const [pagesize, setPagesize] = useState(100000);


  useEffect(() => {
    if(id){
      console.log('hereee', id)
      getData()
    }  
  },[]);


  useEffect(() => {
    formik.setValues({
      itemName: items?.ItemName || '',
      company: items?.Company || '',
      category: items?.Category || '',
      ItemType: items?.ItemType || '',
      PackageSize: items?.Package || '',
      PackageUnit: items?.Unit || '',
      costpertest: items?.CostPerTest || '',
      CostpertestUnit: items?.CostPerTestUnit || '',
      reorderlevel: items?.ReorderLevel || '',
      reorderlevelunit: items?.ReorderLevelUnit || '',
    });
  }, [items]);

  const getData = async () => {
    console.log('insid ecallll')
    setLoading(true);
    try {
        const response = await axios.get(`${BASE_URL}${GET_ITEM}`, {
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
            console.log(response.data.data.masterData[0])
            setItems(response.data.data.masterData[0])          
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
      itemName: '',
      company: '',
      ItemType: '',
      category: '',
      PackageSize: '',
      PackageUnit: '',
      costpertest: '',
      CostpertestUnit: '',
      reorderlevel: '',
      reorderlevelunit: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        setLoading(true)
        const data = {
          Item_Name: values.itemName,
          Company: values.company,
          ItemType: values.ItemType,
          Category: values.category,
          Package: parseInt(values.PackageSize),
          Unit: values.PackageUnit,
          CostPerTest: parseInt(values.costpertest),
          CostPerTestUnit: values.CostpertestUnit,
          ReorderLevel: parseInt(values.reorderlevel),
          ReorderLevelunit: values.reorderlevelunit,
        };
        if (id) {
          const response = await axios.put(`${BASE_URL}${PUT_ITEM}`, data, {
            headers: {
              'XApiKey': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${token}`,
              'ItemNo':id
            },
          });
          if (response.status === 200) {
            setLoading(false)
            toast.success('Item Saved Successfully', {
              duration: 3000,
            });
            resetForm();
            navigate('/itemsupplier')
          } else {
            setLoading(false)
            toast.error('Something Went Wrong !', {
              duration: 3000,
            });
          }
        } else {
         const response = await axios.post(`${BASE_URL}${POST_ITEM}`, data, {
            headers: {
              'XApiKey': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            setLoading(false)
            toast.success('Item Saved Successfully', {
              duration: 3000, // Duration in milliseconds
            });
            resetForm();
          } else {
            setLoading(false)
            toast.error('Something Went Wrong !', {
              duration: 5000, // Duration in milliseconds
            });
          }
        }    
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        toast.error(errorMessage, {
          duration: 5000, // Duration in milliseconds
        });
      } finally {
        setSubmitting(false);
        setLoading(false)
      }
    }
  });

  const handleClose = () => {
    setSelectedItemId(null);
    setShowModal(false)
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
          <h2 className="text-2xl mb-4">Add/Edit Item</h2>
          <div className="rounded-md h-7 flex justify-center items-center content-center hover:bg-gray-100 p-1">
            <IoMdClose size={20} color="grey" className="cursor-pointer" onClick={handleClose} />
          </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-10">
          <div className='flex justify-between gap-5 w-full'>
            <div className='w-full'>
            <label htmlFor="itemName" className='t'>Item Name</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                placeholder="Name"
                autoComplete='off'
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"

                {...formik.getFieldProps('itemName')}
              />
              {formik.touched.itemName && formik.errors.itemName ? (
                <div className="text-red-500 pl-2 pt-1">{formik.errors.itemName}</div>
              ) : null}
            </div>

            <div className='w-full'>
            <label htmlFor="Company">Company</label>
              <input
                type="text"
                placeholder="Company"
                autoComplete='off'
                className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
            
                {...formik.getFieldProps('company')}
              />
              {formik.touched.company && formik.errors.company ? (
                <div className="text-red-500  pl-2 pt-1">{formik.errors.company}</div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-between gap-5 w-full'>
            <div className='flex justify-between gap-5 w-full'>
              <div className='w-full'>
            
                <label htmlFor="Categoryt">Item Type</label>
                <select
                  className="w-full p-4 border border-gray-100 bg-gray-100 rounded text-sm"
                  {...formik.getFieldProps('ItemType')}
                >
                  <option value=''>Type</option>
                  <option value='syringe'>Syring</option>
                  <option value='reagent'>Reagent</option>
                  <option value='others'>Others</option>
                </select>
                {formik.touched.ItemType && formik.errors.ItemType ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.ItemType}</div>
                ) : null}
              </div>
              <div className='w-full'>
          
                <label htmlFor="Categoryt">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  autoComplete='off'
                  className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  {...formik.getFieldProps('category')}
                />
                {formik.touched.category && formik.errors.category ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.category}</div>
                ) : null}
              </div>
            </div>
            
            <div className='flex justify-between gap-5 w-full'>
              <div className='w-full'>
                <label htmlFor="Cost Per Test">Cost/Test</label>
                <input
                  type="number"
                  placeholder="Cost Per Test"
                  className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  {...formik.getFieldProps('costpertest')}
                />
                {formik.touched.costpertest && formik.errors.costpertest ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.costpertest}</div>
                ) : null}
              </div>
              <div className='w-full'>
                <label htmlFor="CostpertestUnit">Cost/testUnit</label>
          
                <select
                  className="w-full p-4 border border-gray-100 bg-gray-100 rounded text-sm"
                  {...formik.getFieldProps('CostpertestUnit')}
                >
                  <option value=''>Unit</option>
                  <option value='ml'>ml</option>
                  <option value='l'>littre</option>
                  <option value='nos'>nos</option>
                </select>
                {formik.touched.CostpertestUnit && formik.errors.CostpertestUnit ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.CostpertestUnit}</div>
                ) : null}
              </div>
            </div>
          </div>
          <div className='flex justify-between gap-5 w-full'>
            <div className='flex justify-between gap-5 w-full'>
              <div className='w-full'>
              <label htmlFor="PackageSize">Package Size</label>
                <input
                  type="number"
                  placeholder="Package Size"            
                  className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  {...formik.getFieldProps('PackageSize')}
                />
                {formik.touched.PackageSize && formik.errors.PackageSize ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.PackageSize}</div>
                ) : null}
              </div>
              <div className='w-full'>
              <label htmlFor="CostpertestUnit">Cost/testUnit</label>
                <select
                  className="w-full p-4 border border-gray-100 bg-gray-100 rounded text-sm"
                  {...formik.getFieldProps('PackageUnit')}
                >
                  <option value=''>Unit</option>
                  <option value='ml'>ml</option>
                  <option value='l'>littre</option>
                  <option value='nos'>nos</option>
                </select>
                {formik.touched.PackageUnit && formik.errors.PackageUnit ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.PackageUnit}</div>
                ) : null}
              </div>
            </div>
            <div className='flex justify-between gap-5 w-full'>
              <div className='w-full'>
                <label htmlFor="reorderlevel">Reorder Level</label>
                <input
                  type="number"
                  placeholder="Reorder Level"
                  className="w-full p-3 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  {...formik.getFieldProps('reorderlevel')}
                />
                {formik.touched.reorderlevel && formik.errors.reorderlevel ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.reorderlevel}</div>
                ) : null}
              </div>
              <div className='w-full'>
                <label htmlFor="reorderlevelunit">  Reorder Level Unit</label>
                <select
                  className="w-full p-4 border border-gray-100 bg-gray-100 rounded text-sm"
                  {...formik.getFieldProps('reorderlevelunit')}
                >
                  <option value=''>Unit</option>
                  <option value='ml'>ml</option>
                  <option value='l'>littre</option>
                  <option value='nos'>nos</option>
                </select>
                {formik.touched.reorderlevelunit && formik.errors.reorderlevelunit ? (
                  <div className="text-red-500 pl-2 pt-1">{formik.errors.reorderlevelunit}</div>
                ) : null}
              </div>
            </div>
          </div>
          <div className='flex gap-5 w-full justify-end'>
            <button onClick={onsubmit} type="submit" className="w-40 py-2 bg-btnblue text-white border border-gray-200 rounded-xl">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewItemEntry;
