const setParamFilter = (rowsPerPage: any, page: any, router: any) => {
  return (
     (rowsPerPage ? `limit=${rowsPerPage}&offset=${page * rowsPerPage}` : "" )+
    (router.query?.keyword ? `&keyword=${router.query?.keyword}` : "") +
    (router.query?.customerId
      ? `&customerId=${router.query?.customerId}`
      : "") +
    (router.query?.mytask ? `&mytask=${router.query?.mytask}` : "") +
    (router.query?.archived ? `&archived=${router.query?.archived}` : "") +
    (router.query?.statusId ? `&statusId=${router.query?.statusId}` : "") +
    (router.query?.currencyId
      ? `&currencyId=${router.query?.currencyId}`
      : "") +
    (router.query?.categoryId
      ? `&categoryId=${router.query?.categoryId}`
      : "") +
    (router.query?.valueFrom ? `&valueFrom=${router.query?.valueFrom}` : "") +
    (router.query?.userAssign
      ? `&userAssign=${router.query?.userAssign}`
      : "") +
    (router.query?.valueTo ? `&valueTo=${router.query?.valueTo}` : "") +
    (router.query?.methodId ? `&methodId=${router.query?.methodId}` : "") +
    (router.query?.startTime ? `&startTime=${router.query?.startTime}` : "") +
    (router.query?.endTime ? `&endTime=${router.query?.endTime}` : "")+
    (router.query?.listStatus ? `&listStatus=${router.query?.listStatus}` : "")+
    (router.query?.sortBy? `&sortBy=${router.query?.sortBy}` : "") +
    (router.query?.typeSort? `&typeSort=${router.query?.typeSort}` : "") +
    (router.query?.filterStartDate ? `&filterStartDate=${router.query?.filterStartDate}` : "") +
    (router.query?.filterDueDate ? `&filterDueDate=${router.query?.filterDueDate}` : "")+
    (router.query?.phoneNumber ? `&phoneNumber=${router.query?.phoneNumber}` : "")+
    (router.query?.genderId ? `&genderId=${router.query?.genderId}` : "")+
    (router.query?.email ? `&email=${router.query?.email}` : "")+
    (router.query?.cid ? `&cid=${router.query?.cid}` : "")+
    (router.query?.contactName ? `&contactName=${router.query?.contactName}` : "") +
    (router.query?.taskName ? `&taskName=${router.query?.taskName}` : "")+
    (router.query?.listPriority ? `&listPriority=${router.query?.listPriority}` : "")
  );
};
export default setParamFilter;
