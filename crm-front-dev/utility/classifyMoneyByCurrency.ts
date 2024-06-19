const classifyMoneyByCurrency = (value: any) => {
  const curencyList = value?.map((item: any) => item.invoice?.currency_sign);

  const dataCurrency = curencyList?.filter(
    (item: any, index: any) => curencyList.indexOf(item) === index
  );

  return dataCurrency
    ?.map((item: any, index: any) => {
      if (dataCurrency[index + 1]) {
        return `${find(value, item)} | `;
      } else {
        return `${find(value, item)}`;
      }
    })
    .join("");
};

const find = (arr: any, currency: string) => {
  const newList = arr?.filter(
    (item: any) => item?.invoice?.currency_sign === currency
  );
  const total = newList?.reduce((arr: any, curr: any) => {
    return arr + Number(curr?.amount);
  }, 0);
  return `${currency} ${new Intl.NumberFormat("en-US").format(total)}`;
};

export default classifyMoneyByCurrency;
