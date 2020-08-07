import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const Customer = React.lazy(() => import('./views/Customer/Customer'));
const Product = React.lazy(() => import('./views/Product/Product'));
const SalePre = React.lazy(() => import('./views/SalePre/Sale'));
const SalePrelist = React.lazy(() => import('./views/SalePre/Salelist'));
const LotList = React.lazy(() => import('./views/Report/LotList'));
const FlashExpressList = React.lazy(() => import('./views/Report/FlashExpressList'));
const CustomerSaleList = React.lazy(() => import('./views/Report/CustomerSaleList'));


const Catalog = React.lazy(() => import('./views/Catalog/Catalog'));



const Sale = React.lazy(() => import('./views/Sale/Sale'));
const Salelist = React.lazy(() => import('./views/Sale/Salelist'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/customer', name: 'ลูกค้า', component: Customer },
  { path: '/product', name: 'สินค้า', component: Product },
  { path: '/salepre', name: 'Per-Order', component: SalePre },
  { path: '/saleprelist', name: 'รายการสรุปยอด', component: SalePrelist },
  { path: '/sale', name: 'ขายพร้อมส่ง', component: Sale },
  { path: '/salelist', name: 'รายการสรุปยอดพร้อมส่ง', component: Salelist },
  { path: '/lotlist', name: 'สรุปยอด (Lot)', component: LotList },
  { path: '/flashexpresslist', name: 'FlashExpress', component: FlashExpressList },
  { path: '/customersalelist', name: 'ยอดซื้อรายคน', component: CustomerSaleList },
  { path: '/catalog', name: 'Catalog', component: Catalog },
  
  
];

export default routes;
