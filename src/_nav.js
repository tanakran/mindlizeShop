export default {
  items: [
    {
      name: 'หน้าแรก',
      url: '/dashboard',
      icon: 'fa fa-line-chart',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      name: 'ขาย Per-Order',
      url: '/salepre',
      icon: 'fa fa-balance-scale',
    },
    {
      name: 'ขายพร้อมส่ง',
      url: '/sale',
      icon: 'fa fa-barcode',
    },
    
    {
      name: 'Pre-Order List',
      icon: 'fa fa-list-alt',
      children: [
        {
          name: 'สรุปยอดขายรวม',
          url: '/saleprelist',
          icon: 'fa fa-tasks',
        },
        {
          name: 'สรุปแยก Lot',
          url: '/lotlist',
          icon: 'fa fa-tasks',
        },
        {
          name: 'ยอดขายรายคน',
          url: '/customersalelist',
          icon: 'fa fa-id-card-o',
        },
        {
          name: 'FlashExpress',
          url: '/flashexpresslist',
          icon: 'fa fa-truck',
        },
      ],
    },

    {
      name: 'พร้อมส่ง List',
      icon: 'fa fa-list-alt',
      children: [
        {
          name: 'สรุปยอดขายรวม',
          url: '/salelist',
          icon: 'fa fa-tasks',
        },
      ],
    },

    {
      name: 'แค็ตตาล็อก',
      url: '/catalog',
      icon: 'fa fa-diamond',
    },
    
    {
      name: 'สินค้า',
      url: '/product',
      icon: 'fa fa-diamond',
    },
    {
      name: 'ลูกค้า',
      url: '/customer',
      icon: 'fa fa-users',
    },
    
  ],
};
