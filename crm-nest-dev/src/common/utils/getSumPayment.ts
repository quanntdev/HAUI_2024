export function getSumPayment(value: any, sign:any, currencyId: any) {
  return find(value, currencyId, sign);
}

const find = (arr: any, currency: number , sign: any) => {
  const newList = arr?.filter((item: any) =>
    (item?.invoice?.currency_sign
      ? (item?.invoice.currency_sign === sign)
      : (item?.currency.sign === sign)),
  );

  const total = newList?.reduce((arr: any, curr: any) => {
    return arr + Number(curr?.amount);
  }, 0);

  const totalFormat = new Intl.NumberFormat('en-US').format(total);
  const data = {
    totalFormat,
    sign,
  };
  return data;
};
