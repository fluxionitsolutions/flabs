import { Route,Routes,useLocation} from 'react-router-dom'
import Dashboard from '../pages/Dashboard';
import UserDashboard from '../pages/UserDashboard';
import TestEntry from '../pages/TestEntry';
import Patients from '../pages/PatientList';
import Purchase from '../pages/Purchase';
import PurchaseReport from '../pages/PurchaseReport';
import PurchaseDetails from '../pages/PurchaseDetails';
import Tests from '../pages/Tests';
import NewGroup from '../pages/NewGroup';
import NewItem from '../pages/NewItem';
import LoginPage from '../pages/Login';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import NewSupplier from '../pages/NewSupplier';
import ItemSupplier from '../pages/ItemSupplier';
import BillPayment from '../components/BillPayment';
import BillComponent from '../components/Invoice';
import PrivilageEntrymodal from '../components/patiententrymodals/PrivilageEntrymodal';
import PrivilageCard from '../pages/PrivilageCard';
import PaymentSupplier from '../pages/PaymentSupplier';
import Report from '../pages/Report';
import ResultEntryPage from '../pages/ResultEntryPage';


import ResultView from '../components/Result';


function Proutes() {

    const location = useLocation();
    return (
      <Routes location={location} key={location.pathname}>
        <Route path='/' exact>
            <Route path='dashboard' exact element={<Dashboard/>}/>
            <Route path='userdashboard' exact element={<UserDashboard/>}/>
            <Route path='/' element={<LoginPage/>}/>
            <Route path='testentry' element={<TestEntry/>}/>
            <Route path='/testentry/:id/:edit/:sequence' element={<TestEntry />} />
            <Route path='patients' element={<Patients/>}/>
            <Route path='purchase' element={<Purchase/>}/>
            <Route path='purchasedetails' element={<PurchaseDetails/>}/>
            <Route path='purchasereport' element={<PurchaseReport/>}/>
            <Route path='purchasesupplierpayments' element={<PaymentSupplier/>}/>

            <Route path='tests' element={<Tests/>}/>
            <Route path='newgroup' element={<NewGroup/>}/>
            <Route path='newitem' element={<NewItem/>}/>
            <Route path='newsupplier' element={<NewSupplier/>}/>
            <Route path='manageitemsupplier' element={<ItemSupplier/>}/>
            <Route path='managesettings' element={<Settings/>}/>
            <Route path='newitem/:id' element={<NewItem/>}/>
            <Route path='itemsupplier/:string' element={<ItemSupplier/>}/>
            <Route path='newsupplier/:id' element={<NewSupplier/>}/>
           
            <Route path='manageusers' element={<Users/>}/>
            <Route path='payment' element={<BillPayment/>}/>
            <Route path='modals' element={< PrivilageEntrymodal/>}/>
            <Route path='printt' element={<BillComponent/>}/>
            <Route path='privilagecard' element={<PrivilageCard/>}/>
            <Route path='reports'  element={<Report/>}/>

            <Route path='/resultentry/:id/:edit/:sequence' element={<ResultEntryPage/>} />

            <Route path='/resultview' element={<ResultView/>} />

        </Route>
      </Routes>
  )
}

export default Proutes