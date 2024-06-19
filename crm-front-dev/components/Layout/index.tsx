import { ReactNode, useEffect } from "react";
import withAuth from "../../utils/withAuth";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  AppBar,
  Box,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTheme, styled } from "@mui/material/styles";
import { SET_MENU } from "../../redux/constants";

interface Props {
  children?: ReactNode;
  title?: string;
}

const drawerWidth = 260;

const Main: any = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }: any) => ({
  ...theme.typography.mainContent,
  backgroundColor: 'rgb(227, 242, 253)',
  background:'linear-gradient(68deg, rgba(237,237,237,0.5269279586834734) 0%, rgba(208,208,208,0.5241268382352942) 35%, rgba(237,237,237,0.5969559698879552) 87%)',
  width: 'calc(100% - 260px)',
  padding: 20,
  marginRight: 20,
  marginTop: 80,
  borderRadius: '18px 18px 0px 0px',
  transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
      }),
      [theme.breakpoints.up('md')]: {
          marginLeft: -(drawerWidth - 20),
          width: "100%"
      },
      [theme.breakpoints.down('md')]: {
          marginLeft: '20px',
          width: "100%",
          padding: '16px'
      },
      [theme.breakpoints.down('sm')]: {
          marginLeft: '10px',
          width: "100%",
          padding: '16px',
          marginRight: '10px'
      }
  }),
  ...(open && {
      transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: "100%",
      [theme.breakpoints.down('md')]: {
          marginLeft: '20px'
      },
      [theme.breakpoints.down('sm')]: {
          marginLeft: '10px'
      }
  })
}));

const Layout = ({ children }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const theme: any = useTheme();
  const matchDownMd: any = useMediaQuery(theme.breakpoints.down("lg"));
  const leftDrawerOpened: any = useSelector(
    (state: any) => state.customization.opened
  );
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };
  useEffect(() => {
    dispatch({ type: SET_MENU, opened: !matchDownMd });
  }, [matchDownMd, dispatch]);
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.default,
          transition: leftDrawerOpened
            ? theme.transitions.create("width")
            : "none",
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar
        drawerOpen={leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
      />
      <Main theme={theme} open={leftDrawerOpened}>
        {children}
      </Main>
    </Box>
  );
};

export default withAuth(Layout);
