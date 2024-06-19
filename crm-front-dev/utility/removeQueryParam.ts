const removeQueryParam = (router:any, paramList: any) => {
  const pathname = router.pathname;
  const query: any = router.query;
  const params = new URLSearchParams(query);
  paramList.forEach((param: any) => {
    params.delete(param);
  });
  router.replace({ pathname, query: params.toString() }, undefined, {
    shallow: true,
  });
};

export default removeQueryParam;
