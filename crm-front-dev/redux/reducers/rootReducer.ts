import { combineReducers } from "redux";
import auth from "./auth";
import customizationReducer from "./customizationReducer";
import contact from "./contact";
import user from "./user";
import customer from "./customer";
import deal from "./deal";
import tag from "./tag";
import industry from "./industry";
import country from "./country";
import employee from "./employee";
import category from "./category";
import city from "./city";
import status from "./status";
import order from "./order";
import billing from "./billing";
import orderItem from "./orderItem";
import orderStatus from "./orderStatus";
import currency from "./currency";
import invoiceCategory from "./invoiceCategory";
import invoice from "./invoice";
import paymentMethod from "./paymentMethod";
import payment from "./payment";
import task from "./task";
import profile from "./profile";
import checklist from "./checklist";
import checklistItem from "./checklistItem";
import comment from "./comment";
import customerLevel from "./customerLevel";
import notification from "./notification";
import lognote from "./lognote";
import saleChannel from "./saleChannel";
import system from "./system";
import partner from "./partner";
import partnerInvoice from "./partnerInvoice";
import partnerPayment from "./partnerPayment"

const rootReducer = combineReducers({
  auth,
  contact,
  user,
  customer,
  deal,
  tag,
  country,
  industry,
  employee,
  city,
  customization: customizationReducer,
  category,
  status,
  order,
  billing,
  orderItem,
  orderStatus,
  currency,
  invoiceCategory,
  invoice,
  paymentMethod,
  payment,
  task,
  profile,
  checklist,
  checklistItem,
  comment,
  customerLevel,
  notification,
  lognote,
  saleChannel,
  system,
  partner,
  partnerInvoice,
  partnerPayment
});

export default rootReducer;
