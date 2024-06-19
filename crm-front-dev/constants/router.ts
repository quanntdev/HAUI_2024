import BasicLayout from "../components/Layout";
import CustomerLayout from "../components/Layout/CustomerLayout";
import NoLayout from "../components/Layout/NoLayout";

interface Router {
  pathName: string;
  role?: string[];
  layout: any;
  redirect?: string;
  title?: string
}

export const publishRouter: Array<Router> = [
  {
    pathName: "/signup",
    layout: NoLayout,
  },
  {
    pathName: "/login",
    layout: NoLayout,
  },
  {
    pathName: "/forgot-password",
    layout: NoLayout,
  },
  {
    pathName: "/change-password",
    layout: NoLayout,
  }
];

export const privateRouter: Array<Router> = [
  {
    pathName: "/",
    layout: BasicLayout,
    title: 'pageTitle'
  },
  {
    pathName: "/contact",
    layout: BasicLayout,
    title: 'contact'
  },
  {
    pathName: "/contact/[id]",
    layout: BasicLayout,
    title: 'contact'
  },
  {
    pathName: "/customer",
    layout: BasicLayout,
    title: 'customer'
  },
  {
    pathName: "/customer/[id]",
    layout: BasicLayout,
    title: 'customer'
  },
  {
    pathName: "/order",
    layout: BasicLayout,
    title: 'order'
  },
  {
    pathName: "/invoices/[id]",
    layout: BasicLayout,
    title: 'invoice'
  },
  {
    pathName: "/order/[id]",
    layout: BasicLayout,
    title: 'pageTitle'
  },
  {
    pathName: "/invoices",
    layout: BasicLayout,
    title: 'invoices'
  },
  {
    pathName: "/payments",
    layout: BasicLayout,
    title: 'payments'
  },
  {
    pathName: "/task",
    layout: BasicLayout,
    title: 'task'
  },
  {
    pathName: "/profile",
    layout: BasicLayout,
    title: 'profile'
  },
  {
    pathName: "/partner/partner-list",
    layout: BasicLayout,
    title: 'partner'
  },
  {
    pathName: "/partner/partner-list/[id]",
    layout: BasicLayout,
    title: 'partner'
  },
  {
    pathName: "/partner/partner-invoice",
    layout: BasicLayout,
    title: 'partner-invoice'
  },
  {
    pathName: "/partner/partner-invoice/[id]",
    layout: BasicLayout,
    title: 'partner-invoice'
  },
  {
    pathName: "/partner/partner-payment",
    layout: BasicLayout,
    title: 'partner-payment'
  },
];

export const routerAdminAuthouz: Array<Router> = [
  {
    pathName: "/user",
    layout: BasicLayout,
  },
  {
    pathName: "/country",
    layout: BasicLayout,
  },
  {
    pathName: "/salechannel",
    layout: BasicLayout,
  },

  {
    pathName: "/setting",
    layout: BasicLayout,
    title: "Setting"
  },

  {
    pathName: "/level",
    layout: BasicLayout,
    title: "Level"
  },
  {
    pathName: "/industry",
    layout: BasicLayout,
    title: "Industry"
  }
]

export const routerNotLogin: Array<Router> = [
  {
    pathName: "/deals",
    layout: BasicLayout,
    title: 'pageTitle'
  },
  {
    pathName: "/continue",
    layout: NoLayout,
    title: 'pageTitle'
  },
  {
    pathName: "/invoice-customer/[id]",
    layout: CustomerLayout,
    title: 'pageTitle'
  },
  {
    pathName: "/payment-success",
    layout: CustomerLayout,
    title: 'pageTitle'
  },
  {
    pathName: "/deals/[id]",
    layout: BasicLayout,
    title: 'pageTitle'
  },
  {
    pathName: "/404",
    layout: NoLayout,
    title: 'notFound'
  },
];
