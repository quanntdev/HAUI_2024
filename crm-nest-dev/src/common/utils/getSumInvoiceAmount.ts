export function getSumInvoice(value: any, keyword: string, currency:any) {
  const find = (arr: any, currency: string) => {
    const newList = arr?.filter(
      (item: any) => item?.currency_sign === currency
    );
    const total = newList?.reduce((arr: any, curr: any) => {
      return arr + Number(curr?.[keyword]);
    }, 0);
    const totalFormat = new Intl.NumberFormat("en-US").format(total);
    const data = {
      totalFormat, currency
    }
    return data;
};

  return find(value, currency)
}

