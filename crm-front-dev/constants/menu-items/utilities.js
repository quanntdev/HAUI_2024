// assets
import {
  IconTypography,
  IconChecklist,
  IconPackage,
  IconReportAnalytics,
  IconBuildingCommunity,
  IconReceipt,
  IconAddressBook,
  IconLayoutDashboard,
  IconFileInvoice,
  IconReportMoney,
  IconFriends,
  PeopleIcon,
  IconList,
  IconFile,
  IconFileDescription
} from "@tabler/icons";

// constant
const icons = {
  IconTypography,
  IconChecklist,
  IconPackage,
  IconBuildingCommunity,
  IconReceipt,
  IconAddressBook,
  IconReportAnalytics,
  IconLayoutDashboard,
  IconFileInvoice,
  IconReportMoney,
  PeopleIcon,
  IconFriends,
  IconList,
  IconFile,
  IconFileDescription,
};

const utilities = {
  id: "utilities",
  title: `main`,
  type: "group",
  children: [
    {
      id: "",
      title: `dashboard`,
      // type: "collapse",
      type: "item",
      url: "/",
      breadcrumbs: false,
      icon: icons.IconLayoutDashboard,
      //children: [
        // {
        //   id: "tabler-icons",
        //   title: "Deals",
        //   type: "item",
        //   url: "/icons/tabler-icons",
        //   breadcrumbs: false,
        // },
        // {
        //   id: "material-icons",
        //   title: "Order",
        //   type: "item",
        //   url: "/icons/material-icons",
        //   breadcrumbs: false,
        // },
        // {
        //   id: 'material-icons',
        //   title: 'Leads',
        //   type: 'item',
        //   url: '/icons/material-icons',
        //   breadcrumbs: false
        // }
      //],
    },
    {
      id: "customer",
      title: `customer`,
      type: "item",
      url: "/customer",
      icon: icons.IconBuildingCommunity,
      breadcrumbs: false,
    },
    {
      id: "contact",
      title: `contact`,
      type: "item",
      url: "/contact",
      icon: icons.IconAddressBook,
      breadcrumbs: false,
    },
    {
      id: "deals",
      title: `deal`,
      type: "item",
      url: "/deals",
      icon: icons.IconReceipt,
      breadcrumbs: false,
    },
    {
      id: "order",
      title: `order`,
      type: "item",
      url: "/order",
      icon: icons.IconPackage,
      breadcrumbs: false,
    },
    {
      id: "invoices",
      title: `invoice`,
      type: "item",
      url: "/invoices",
      icon: icons.IconFileInvoice,
      breadcrumbs: false,
    },
    {
      id: "payments",
      title: `payment`,
      type: "item",
      url: "/payments",
      icon: icons.IconReportMoney,
      breadcrumbs: false,
    },
    {
      id: "task",
      title: `task`,
      type: "item",
      url: "/task",
      icon: icons.IconChecklist,
      breadcrumbs: false,
    },
    // {
    //   id: "util-report",
    //   title: "Reports",
    //   type: "item",
    //   url: "/utils/util-shadow",
    //   icon: icons.IconReportAnalytics,
    //   breadcrumbs: false,
    // },
    // {
    //   id: "partner",
    //   title: `partner`,
    //   type: "collapse",
    //   breadcrumbs: true,
    //   icon: icons.IconFriends,
    //   children: [
    //     {
    //       id: "tabler-icons",
    //       title: `partner_list`,
    //       type: "item",
    //       url: "/partner/partner-list",
    //       breadcrumbs: false,
    //       icon: icons.IconList,
    //     },
    //     {
    //       id: "tabler-icons",
    //       icon: icons.IconFileDescription,
    //       title: `invoice`,
    //       type: "item",
    //       url: "/partner/partner-invoice",
    //       breadcrumbs: false,
    //     },
    //     {
    //       id: "tabler-icons",
    //       title: `payment`,
    //       type: 'item',
    //       url: "/partner/partner-payment",
    //       breadcrumbs: false,
    //       icon: icons.IconReportMoney,
    //     }
    //   ],
    // },
  ],
};

export default utilities;
