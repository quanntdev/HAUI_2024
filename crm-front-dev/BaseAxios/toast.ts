import { toast } from "react-toastify";

const options: any = {
  theme: "colored",
  autoClose: 2000,
  pauseOnFocusLoss: false,
};

export const successToast = (message: string) => {
  toast.success(message, options);
};

export const errorToast = (message: string) => {
  toast.error(message, options);
};
