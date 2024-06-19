const linkConversion = (object: string, objectId: number, lognoteId: any = null) => {
  let url = "";

  switch (object) {
    case "deals": {
      url = "/deals/" + objectId;
      break;
    }

    case "customers": {
      url = "/customer/" + objectId;
      break;
    }

    case "orders": {
      url = "/order/" + objectId;
      break;
    }

    case "invoices": {
      url = "/invoices/" + objectId;
      break;
    }

    case "tasks": {
      url = "/task?taskId=" + objectId;
      break;
    }

    case "payments": {
      url = "/payments?paymentId=" + objectId;
      break;
    }

    case "contacts": {
      url = "/contact/" + objectId;
      break;
    }

    case "payment_partner": {
      url = "/partner/partner-payment?paymentId=" + objectId;
      break;
    }

    case "invoice_partner": {
      url = "/partner/partner-invoice/" + objectId;
      break;
    }

    // case "user" : {
    //   return ()
    // }
  }

  if (lognoteId) {
    url += "?tab=lognote&view=" + lognoteId;
  }

  return url;
};

export default linkConversion;
