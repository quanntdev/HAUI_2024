const formatInvoiceMoney = function (value: any) {
    return value?.map((item: any, index: any) => {
        if(index === (value.length - 1)){
            return `${item?.currency} ${item?.totalFormat}`
        }else{
            return `${item?.currency} ${item?.totalFormat} | `
        }
    })
  };
  export default formatInvoiceMoney;
