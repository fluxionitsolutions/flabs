import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { AiOutlineShopping } from "react-icons/ai";
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import {
  IoHomeOutline, IoCalendarOutline, IoDocumentTextOutline, IoSettingsOutline, IoPersonOutline, IoLogInOutline
} from 'react-icons/io5';
import {
  BsFillCartFill, BsFillPersonPlusFill, BsTruck
} from 'react-icons/bs';
import { TbReportMoney } from 'react-icons/tb';
import { AiFillPrinter } from "react-icons/ai";
import { GrDocumentTest } from 'react-icons/gr';
import { FaRegAddressCard } from 'react-icons/fa';
import { MdOutlineSettingsInputComposite } from "react-icons/md";
import '../App.css';

const LeftMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('');
  const [activeSubMenuItem, setActiveSubMenuItem] = useState('');
  const [toggled, setToggled] = useState(true);
  const [rtl] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/purchase')) {
      setOpenSubmenu('purchase');
      if (path === '/purchase') {
        setActiveSubMenuItem('subpurchase');
      } else if (path === '/purchasereport') {
        setActiveSubMenuItem('subreport');
      } else if (path === '/purchasesupplierpayments') {
        setActiveSubMenuItem('subsupplierpay');
      }
    } else if (path.startsWith('/manage')) {
      setOpenSubmenu('manage');
      if (path === '/manageusers') {
        setActiveSubMenuItem('manageusers');
      } else if (path === '/manageitemsupplier') {
        setActiveSubMenuItem('manageitemsupplier');
      } else if (path === '/managesettings') {
        setActiveSubMenuItem('managesettings');
      }
    } else {
      setOpenSubmenu('');
      setActiveMenuItem(path);
      setActiveSubMenuItem('');
    }
  }, [location.pathname]);

  const handleToggle = () => {
    setToggled(!toggled);
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleMenuItemClick = (itemId, path, submenuId) => {
    if (submenuId) {
      setOpenSubmenu(submenuId);
      setActiveSubMenuItem(itemId);
    } else {
      setActiveMenuItem(itemId);
      setActiveSubMenuItem('');
      setOpenSubmenu('');
    }
    navigate(path);
  };

  return (
    <div className={`flex h-full ${rtl ? 'rtl' : 'ltr'}`}>
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        rtl={rtl}
      >
        <div className="flex py-2 px-2 mt-2 ml-4 items-center mb-6">
          <button onClick={handleToggle} className="focus:outline-none">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className={`h-8 w-8 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          {!toggled && (
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">FluxionLab</h2>
            </div>
          )}
        </div>
        <Menu>
          <MenuItem 
            icon={<IoHomeOutline size={18} />}
            onClick={() => handleMenuItemClick('/userdashboard', '/userdashboard')}
            className={activeMenuItem === '/userdashboard' ? 'bg-blue-500 text-white' : ''}
          >
            Dashboard
          </MenuItem>
          <MenuItem 
            icon={<IoCalendarOutline size={18} />}
            className={activeMenuItem === '/testentry' ? 'bg-blue-500 text-white' : ''}
            onClick={() => handleMenuItemClick('/testentry', '/testentry')}
          >
            Appointments
          </MenuItem>
          <MenuItem
            icon={<IoPersonOutline size={18} />}
            className={activeMenuItem === '/patients' ? 'bg-blue-500 text-white' : ''}
            onClick={() => handleMenuItemClick('/patients', '/patients')}
          >
            Patients
          </MenuItem>
          <SubMenu
            icon={<BsFillCartFill size={18} />}
            label="Purchase"
            open={openSubmenu === 'purchase'}
            onClick={() => setOpenSubmenu(openSubmenu === 'purchase' ? '' : 'purchase')}
          >
            <MenuItem
              icon={<TbReportMoney size={18} />}
              className={activeSubMenuItem === 'subpurchase' ? 'bg-blue-500 text-white' : ''}
              onClick={() => handleMenuItemClick('subpurchase', '/purchase', 'purchase')}
            >
              Purchase
            </MenuItem>
            <MenuItem
              icon={<AiOutlineShopping size={18} />}
              className={activeSubMenuItem === 'subreport' ? 'bg-blue-500 text-white' : ''}
              onClick={() => handleMenuItemClick('subreport', '/purchasereport', 'purchase')}
            >
              Purchase Report
            </MenuItem>
            <MenuItem
              icon={<IoDocumentTextOutline size={18} />}
              className={activeSubMenuItem === 'subsupplierpay' ? 'bg-blue-500 text-white' : ''}
              onClick={() => handleMenuItemClick('subsupplierpay', '/purchasesupplierpayments', 'purchase')}
            >
              Supplier Payments
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<IoDocumentTextOutline size={18} />}
            className={activeMenuItem === '/reports' ? 'bg-blue-500 text-white' : ''}
            onClick={() => handleMenuItemClick('/reports', '/reports')}
          >
            Reports
          </MenuItem>

          <MenuItem
            icon={<GrDocumentTest size={18} />}
            className={activeMenuItem === '/tests' ? 'bg-blue-500 text-white' : ''}
            onClick={() => handleMenuItemClick('/tests', '/tests')}
          >
            Test/Groups
          </MenuItem>
          <SubMenu
            icon={<MdOutlineSettingsInputComposite size={18} />}
            label="Settings"
            open={openSubmenu === 'manage'}
            onClick={() => setOpenSubmenu(openSubmenu === 'manage' ? '' : 'manage')}
          >
            <MenuItem
              icon={<BsFillPersonPlusFill size={18} />}
              className={activeSubMenuItem === 'manageusers' ? 'bg-blue-500 text-white' : ''}
              onClick={() => handleMenuItemClick('manageusers', '/manageusers', 'manage')}
            >
              Users
            </MenuItem>
            <MenuItem
              icon={<BsTruck size={18} />}
              className={activeSubMenuItem === 'manageitemsupplier' ? 'bg-blue-500 text-white' : ''}
              onClick={() => handleMenuItemClick('manageitemsupplier', '/manageitemsupplier', 'manage')}manage
            >
              Item Supplier
            </MenuItem>
            <MenuItem
              icon={<IoSettingsOutline size={18} />}
              className={activeSubMenuItem === 'managesettings' ? 'bg-blue-500 text-white' : ''}
              onClick={() => handleMenuItemClick('managesettings', '/managesettings', 'manage')}
            >
              App Settings
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<FaRegAddressCard size={18} />}
            className={activeMenuItem === '/privilegecard' ? 'bg-blue-500 text-white' : ''}
            onClick={() => handleMenuItemClick('/privilagecard', '/privilagecard')}
          >
            Privilege Card
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            className="mt-auto text-red-600 text-xl"
            icon={<IoLogInOutline size={25} />}
          >
            Logout
          </MenuItem>


          <MenuItem
            icon={<AiFillPrinter size={18} />}
            className={activeMenuItem === '/printt' ? 'bg-blue-500 text-white' : ''}
            onClick={() => handleMenuItemClick('/printt', '/printt')}
          >
            Printttt
          </MenuItem>
        </Menu>
      </Sidebar>
      <Tooltip className='ml-8' id="my-tooltip" />
    </div>
  );
};

export default LeftMenu;
