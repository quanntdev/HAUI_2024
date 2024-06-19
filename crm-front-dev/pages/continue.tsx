import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userLogin } from '../redux/actions/auth';

const ContinuePage = (props: any) => {
  const { dataLogin } = props.auth;
  const { userLogin } = props;
  const router = useRouter();
  const { query } = router;
  useEffect(() => {
    if (query?.code) userLogin('', '', 0, query?.code)
  }, [query])

  useEffect(() => {
    if (dataLogin && localStorage.getItem('access_token')) router.push('/')
  }, [dataLogin])
  return <div></div>;
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});
const mapDispatchToProps = { userLogin };
export default connect(mapStateToProps, mapDispatchToProps)(ContinuePage);
