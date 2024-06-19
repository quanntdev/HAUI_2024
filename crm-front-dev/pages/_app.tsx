import React, { useMemo } from "react";
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { useRouter } from "next/router";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "react-toastify/dist/ReactToastify.css";
import createEmotionCache from '../utility/createEmotionCache';
import { ToastContainer } from "react-toastify";
import { publishRouter, routerNotLogin, privateRouter, routerAdminAuthouz } from '../constants/router';
import { wrapper } from "../redux/store";
import lightThemeOptions from '../styles/theme/lightThemeOptions';
import BasicLayout from '../components/Layout';
import '../styles/globals.scss';
import moment from 'moment-timezone';
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  moment.tz.setDefault(process.env.NEXT_PUBLIC_TIME_ZONE ?? 'Asia/Ho_Chi_Minh');

  const currentRouter: any = useMemo(() => [...publishRouter, ...routerNotLogin, ...privateRouter, ...routerAdminAuthouz].find(x => x.pathName === router.pathname), [router])

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <>
            {currentRouter?.layout ? (
              <currentRouter.layout>
                <Component {...pageProps} />
                <ToastContainer />
              </currentRouter.layout>
            ) : (
              <BasicLayout>
                <Component {...pageProps} />
                <ToastContainer />
              </BasicLayout>
            )}
          </>
        </ThemeProvider>
      </CacheProvider>
    );
  }
};

export default wrapper.withRedux(MyApp);
