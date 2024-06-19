import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { PRIORITY_LIST, rowsPerPage, STATUS_TASK } from "../../constants";
import PaginationDefault from "../Pagination";
import getLinkAvatar from "../../utility/getLinkAvatar";
import ModalDetailTask from "../Task/ModalDetailTask";
import Link from "next/link";
import { getObjectTask, clearData, getTask } from "../../redux/actions/task";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";

const TabPanelTaskList = (props: any) => {
  const {
    dataTaskObject,
    setPageOrderItem,
    pageOrderItem,
    handleOpenFormTask,
    getTask,
    idObject,
    getObjectTask,
    paramObject,
    clearData,
  } = props;

  const hasParam = window.location.href.indexOf("?") !== -1;
  const { dataTaskDetail, dataUpdateTask, dataTaskDelete } = props.task;
  const router = useRouter();
  const [taskId, setTaskId] = useState<any>();
  const [querySearch, setQuerySearch] = useState<string>("");
  const [openModalDetailTask, setOpenModalDetailTask] =
    useState<boolean>(false);


  useEffect(() => {
    getObjectTask(
      `limit=${rowsPerPage}&offset=${
        (pageOrderItem - 1) * rowsPerPage
      }&${paramObject}=${idObject}`
    );
  }, [dataUpdateTask, dataTaskDelete]);

  useEffect(() => {
    clearData("dataTaskObject");
  }, [paramObject]);

  useEffect(() => {
    if (router.query?.taskId) {
      getTask(router.query?.taskId);
      setOpenModalDetailTask(true);
    }
  }, [router.query]);


  const trans = useTrans();

  return (
    <>
      <TableContainer sx={{marginTop:5}} component={Paper} className="p-24">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width="7%">ID#</TableCell>
              <TableCell width="25%" className="text-align-left">
                {trans.order.title}
              </TableCell>
              <TableCell className="text-align-center">{trans.customer_detail.assigned}</TableCell>
              <TableCell className="text-align-center">{trans.order.due_date_}</TableCell>
              <TableCell className="text-align-center">{trans.order.status}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody></TableBody>
          <TableBody>
            {dataTaskObject?.items?.map((item: any, index: any) => (
              <TableRow
                key={item?.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell className="">
                  {index + 1 + (pageOrderItem - 1) * rowsPerPage}
                </TableCell>
                <TableCell
                  className="text-cursor text-align-left"
                >
                  <Link
                    href={
                      window.location.href +
                      (hasParam ? "&" : "?") +
                      "taskId=" +
                      item?.id +
                      "&name=" +
                      item?.name
                    }
                    className="text-cursor"
                  >
                    {item?.name}
                  </Link>
                  <Chip
                    color="primary"
                    style={{
                      marginLeft: 4,
                      borderRadius: 8,
                      backgroundColor: PRIORITY_LIST.find(
                        (items) => items.id == item?.priorityId
                      )?.color,
                      height: "auto",
                      verticalAlign: "top",
                      fontSize: 10,
                    }}
                    label={item?.priorityName}
                  />
                </TableCell>
                <TableCell className="avart-list-task text-align-center">
                  {item.users?.map((user: any, index: number) => {
                    return (
                      <Tooltip
                        title={
                          user?.profile &&
                          user?.profile?.first_name +
                            " " +
                            user?.profile?.last_name
                        }
                        key={index}
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                        }}
                      >
                        <Avatar
                          src={
                            user?.profile?.profileImg
                              ? getLinkAvatar(user?.profile?.profileImg)
                              : ""
                          }
                          alt="Picture of the author"
                          sx={{ width: 24, height: 24 }}
                        />
                      </Tooltip>
                    );
                  })}
                </TableCell>
                <TableCell className="text-align-center">
                 {item?.dueDate ? fomatDate(item?.dueDate) : ""}
                </TableCell>
                <TableCell
                  className="text-align-center"
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {STATUS_TASK.find(
                    (status) => status.id == item?.statusId
                  )?.name.toUpperCase()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableRow>
          <TableCell style={{ borderBottom: "none" }}></TableCell>
          <TableCell style={{ borderBottom: "none" }}>
            <Button onClick={() => handleOpenFormTask(true)}>
              {trans.customer_detail.add_new_task}
            </Button>
          </TableCell>
        </TableRow>
      </TableContainer>
      {dataTaskObject?.total > rowsPerPage && (
        <PaginationDefault
          total={dataTaskObject?.total}
          setQuerySearch={setQuerySearch}
          paginateByParamUrl={false}
          setCustomPage={setPageOrderItem}
          customPage={pageOrderItem}
        />
      )}

      <ModalDetailTask
        openModalDetailTask={openModalDetailTask}
        setTaskId={setTaskId}
        taskId={taskId}
        setOpenModalDetailTask={setOpenModalDetailTask}
        taskDetail={dataTaskDetail?.data?.task}
        setQuerySearch={setQuerySearch}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  task: state?.task,
});

const mapDispatchToProps = {
  getTask,
  getObjectTask,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabPanelTaskList);
