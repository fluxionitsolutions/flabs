// import {IS_DEVELOPER, ANDROID_URL_HEAD, IOS_URL_HEAD, PRODUCTION_URL_HEAD} from '@env';

const IS_DEVELOPER = true;
//const DEV_URL_HEAD = 'https://fluxion-cdfpcve0h5hdakc7.eastus-01.azurewebsites.net/';
const DEV_URL_HEAD = 'http://myapi.local:5010/'
//const DEV_URL_HEAD = 'https://fluxion-cdfpcve0h5hdakc7.eastus-01.azurewebsites.net/'
const PRODUCTION_URL_HEAD = '';

const development = IS_DEVELOPER;
let urls;

if (development) {
  urls = {
    BASE_URL: DEV_URL_HEAD, 
  };
} else {
  // Production urls
  urls = {
    BASE_URL: PRODUCTION_URL_HEAD,
  };
}

export const {BASE_URL} = urls;


export const LOGIN = 'api/0102/getAuthenticated';
export const GET_TEST = 'api/0202/getTestMaster';
export const POST_TEST = 'api/0202/postTestMaster';
export const PUT_TEST = 'api/0202/putTestMaster'
export const GET_GROUP = 'api/0202/getTestGroupMaster';
export const POST_GROUP = 'api/0202/postTestGroupMaster';
export const PUT_GROUP = 'api/0202/putTestGroupMaster';
export const POST_ITEM = 'api/0202/postItemMaster';
export const GET_ITEM = 'api/0202/getItemMaster';
export const POST_SUPPLIER = 'api/0202/postSupplierMaster';
export const GET_SUPPLIER = 'api/0202/getSupplierMaster';
export const GET_BASE_DATA = 'api/0203/getPurchasePageLoadDataset';
export const PUT_ITEM = 'api/0202/putItemMaster';
export const PUT_SUPPLER = 'api/0202/putSupplierMaster';

export const GET_PATIENTS = 'api/0202/getPatientMaster';
export const POST_PATIENT = 'api/0202/postPatientMaster';
export const POST_PURCHASE = 'api/0203/postPurchaseTransaction';
export const TEST_ENTRY_LOAD = 'api/0203/getTestEtryPageLoadDataset';
export const POST_TEST_ENTRY ='api/0203/postTestEntryTransaction';
export const GET_DOCTORS = 'api/0202/getDoctorMaster';
export const POST_DOCTOR = 'api/0202/postDoctorMaster';
export const GET_LABS = 'api/0202/getLabMaster';
export const PRINT_HEAD = 'http://myapi.local:5010/print';
export const POST_LAB = 'api/0202/postLabMaster';


export const GET_PATIENT_HISTORY = 'api/0203/getPatientRecords';
export const GET_BILLS_BYDATE = 'api/0203/getPatientRecordsByDate';
export const GET_BILL_DETAILS = 'api/0203/getInvoiceDetailsByID';
export const POST_RECIEPTS = 'api/0203/postReceiptTestEntry';
export const GET_BILL = 'api/0203/getInvoiceDetails';
 

export const GET_PURCHASE_HEADER = 'api/0203/getPurchaseListCombo';
export const GET_PURCHASE_DATA = 'api/0203/getPurchaseList';
export const GET_PURCHASE_DETAILS = 'api/0203/getPurchaseDetailsByID'

export const POST_PLACE = 'api/0202/postPlaceMaster';
export const GET_PLACE = 'api/0202/getPlaceMaster'


export const POST_PRIVILAGE_CARD_DATA ='api/0202/postPrivilegeCardpatietMapping';
export const POST_PRIVILAGE_CARD_PRICING = 'api/0202/postPrivilegeCardPricing';
export const GET_PRIVILAGE_CARD='api/0202/getPrivilegeCardPricing';
export const POST_PRIVILAGE_CARD='api/0202/postPrivilegeCard';
export const GET_PRIVILAGE_HEAD='api/0202/getPrivilegeCard';

export const GET_SUPPLIER_DUEBILLS = 'api/0203/getSupplierOverDueBills';
export const POST_SUPPLIER_PAYMENT = 'api/0203/postPaymentEntry';

export const INVOICE_TEST_DETAILS = 'api/0203/getInvoiceTestDetailsByID';
export const POST_INVOICE_RERSULT = 'api/0203/postTestEntryResult';


export const UPLOAD_IMG = 'api/0303/upload-image';
export const UPLOAD_URL = 'api/0202/putClientMaster';
export const GET_IMAGES = 'api/0202/getClientMaster';
export const SAVE_PRINTER = 'api/0202/postDeviceConfig';
export const GET_DEVICE_CONFIG = 'api/0202/getDeviceConfig';


export const POST_USER = 'api/0202/postUserMaster';
export const GET_USER = 'api/0202/getUserMaster';
export const PUT_USER = 'api/0202/putUserMaster';


export const GET_REPORT_HEADER = 'api/8978/getsalesReportDataSets';
export const GET_SALES_REPORT = 'api/8978/getSalesReport';