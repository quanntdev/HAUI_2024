export const checkLinkComment = (text: any) => {
     const regexP = /<p>(.*?)<\/p>/;
     const match = regexP?.exec(text);
     const extractedText = match ? match[1] : "";
 
     const regex = /(https?:\/\/[^\s<]+)|(\b\w+\.(?:com|vn|net|co|jp|co\.jp|ne\.jp|or\.jp|ac\.jp|go\.jp|ed\.jp|lg\.jp)\b)/g;
     const matches = text?.match(regex);
 
     if (matches && matches.length > 0) {
       const extractedText = text?.replace(
         regex,
         '<a href="$&" style="color: blue;" target="_blank">$&</a>'
       );
       return extractedText;
     } else {
       return extractedText;
     }
   };


   

   

   