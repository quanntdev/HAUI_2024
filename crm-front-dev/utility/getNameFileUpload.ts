const getNameFileUpload = function (str: string) {
   const typeOfFile = str.split(".").pop();
   const lastIndex = str.lastIndexOf("-")
   return  str.substring(0, lastIndex) + '.' + typeOfFile;
}

export default getNameFileUpload;
