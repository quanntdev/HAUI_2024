const checkChangeDataBeforeUpdate = (dataForm: any, dataDetail: any) => {
  for (const [key, value] of Object.entries(dataForm)) {
    if (dataDetail?.hasOwnProperty(key) && dataDetail[key] != value) return true;
  }
  return false;
};

export default checkChangeDataBeforeUpdate;
