import { URL_API_IMAGE_AVATAR } from "../constants";

const getLinkAvatar = function (src: string) {
   if(src) {
    return URL_API_IMAGE_AVATAR + src;
   }

   return '';
}

export default getLinkAvatar;
