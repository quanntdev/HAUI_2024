import { useRouter } from "next/router";
import { publishRouter, routerNotLogin, privateRouter , routerAdminAuthouz} from '../constants/router';
import { useSelector } from 'react-redux';
interface Router {
  pathName: string,
  role?: string[],
  layout?: string
}
const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const access_token = localStorage.getItem("access_token");
      const userLogin = useSelector((state: any) => state?.profile?.dataDetailProfile);
      if (Router.pathname === '/404' || routerNotLogin.map(x => x.pathName).includes(Router.pathname)) return <WrappedComponent {...props} />;
      else if (privateRouter.find((x: Router) => Router.pathname === x.pathName)) {
        if (access_token || userLogin) return <WrappedComponent {...props} />;
        else Router.push('/login');
      } else if (publishRouter.map(x => x.pathName).includes(Router.pathname)) {
        if (access_token) Router.push('/');
        else return <WrappedComponent {...props} />;
      } else if(routerAdminAuthouz.find((x: Router) => Router.pathname === x.pathName)) {
        if(userLogin?.role === 1) {
          return <WrappedComponent {...props} />
        } else {
          Router.push('/')
        }
      }
      else if (!(
        routerNotLogin.map(x => x.pathName).includes(Router.pathname) ||
        privateRouter.findIndex((x: any) => Router.pathname === x.pathName) !== -1 ||
        publishRouter.map(x => x.pathName).includes(Router.pathname) ||
        Router.pathname === '/'
      )) Router.push('/404');
    }
    return null;
  };
};

export default withAuth;
