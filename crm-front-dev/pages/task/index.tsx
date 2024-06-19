import {
  Paper,
  Button,
  Grid,
  IconButton,
  Stack,
  TableContainer,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
  Tooltip,
  Box,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import styles from "../order/styles.module.scss";
import { NextPage } from "next";
import Breadcrumb from "../../components/Breadcumb";
import InputSearch from "../../components/Input/InputSearch";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaginationDefault from "../../components/Pagination";
import FormCreateTask from "../../components/Task/FormCreateTask";
import { IconChecklist } from "@tabler/icons";
import { connect } from "react-redux";
import FilterStatusButton from "../../components/Button/FilterStatusButton";
import {
  getListTask,
  getTask,
  archiveTask,
  deleteTask,
  updateTaskStatus,
} from "../../redux/actions/task";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getParamsToURL, getPageFromParams } from "../../helpers";
import ModalDelete from "../../components/Modal/ModalDelete";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  FOMAT_DATE_TIME,
  keyPage,
  PRIORITY_LIST,
  rowsPerPage,
  STATUS_TASK,
} from "../../constants";
import ModalDetailTask from "../../components/Task/ModalDetailTask";
import getLinkAvatar from "../../utility/getLinkAvatar";
import HeadMeta from "../../components/HeadMeta";
import setParamFilter from "../../utility/querySearch";
import { searchUser } from "../../redux/actions/user";
import FilterUserAssignedButton from "../../components/Button/FilterUserAssignedButton";
import moment from "moment";
import { clearData } from "../../redux/actions/auth";
import SortByDateBtn from "../../components/SortByDateBtn/SortByDateBtn";
import Link from "next/link";
import FilterDate from "../../components/Button/FilterDate";
import QueryListBar from "../../components/QueryListBar";
import useTrans from "../../utils/useTran";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "../../components/DnD/DraggableElement";
import { getDetailProfile } from "../../redux/actions/profile";

const Task: NextPage = (props: any) => {
  const trans = useTrans();
  const newClient = true;
  const {
    getListTask,
    getTask,
    archiveTask,
    deleteTask,
    searchUser,
    updateTaskStatus,
    getDetailProfile,
  } = props;
  const {
    dataListTask,
    dataTaskDetail,
    dataTaskArchive,
    dataTaskDelete,
    dataUpdateTaskStatus,
  } = props.task;
  const { dataUserList } = props.user;
  const { dataDetailProfile } = props?.profile;
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [querySearch, setQuerySearch] = useState<string>(
    `limit=${rowsPerPage}&offset=0`
  );
  const [typeList, setTypeList] = useState<boolean>(false);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [userAssignedId, setUserAssignedId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(0);
  const [taskId, setTaskId] = useState<any>();
  const [itemIndex, setItemIndex] = useState<number>(1);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [valueIcon, setValueIcon] = useState<string>("");
  const [isSorting, setIsSorting] = useState<boolean>(true);
  const [openModalDetailTask, setOpenModalDetailTask] =
    useState<boolean>(false);

  useEffect(() => {
    if (!router?.query.taskId) {
      const page = getPageFromParams(router.query[keyPage]);
      if (page) {
        setTypeList(false);
        setItemIndex(page * rowsPerPage + 1);
      }
      if (!page) {
        setItemIndex(1);
      }
      const querySearch = router.query.newClient
        ? "newClient=true"
        : setParamFilter(rowsPerPage, page, router);
      getListTask(querySearch);
    }
  }, [router, dataTaskArchive, dataTaskDelete, dataUpdateTaskStatus]);

  useEffect(() => {
    getDetailProfile();
  }, []);

  useEffect(() => {
    router.push({
      pathname: router.route,
      query: {
        ...router.query,
        userAssign: dataDetailProfile?.id,
      },
    });
    const stringQuery = `&userAssign=${dataDetailProfile?.id}`;
    getListTask(stringQuery);
  }, []);

  useEffect(() => {
    if (router.query?.taskId) {
      setTaskId(router.query?.taskId);
      setOpenModalDetailTask(true);
    }
  }, [router.query]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const hasParam = window.location.href.indexOf("?") !== -1;

  useEffect(() => {
    if (!anchorEl) {
      searchUser("");
    }
  }, [anchorEl]);

  useEffect(() => {
    if (taskId && openModalDetailTask) {
      getTask(taskId);
    }
  }, [taskId, openModalDetailTask]);

  useEffect(() => {
    if (!openModalDetailTask) {
      clearData("dataTaskDetail");
    }
  }, [openModalDetailTask]);

  const handleChangeFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilterStatus: string
  ) => {
    setFilterStatus(newFilterStatus);
  };

  const control = {
    value: filterStatus,
    onChange: handleChangeFilter,
    exclusive: true,
  };

  const handleOpenForm = useCallback(() => {
    setOpenFormModal(true);
  }, []);

  const formatDateTime = (date: string) => {
    return moment(date).format(FOMAT_DATE_TIME);
  };

  const handleShowMyTask = () => {
    const q = router.query;
    delete q["archived"];
    delete q["userAssign"];
    delete q["statusId"];
    if (router.query?.mytask) {
      router.push({
        pathname: router.route,
      });
    } else {
      router.push({
        pathname: router.route,
        query: {
          ...router.query,
          mytask: true,
        },
      });
    }
    setStatusId(null);
  };

  const handleShowArchirve = () => {
    const q = router.query;
    delete q["mytask"];
    delete q["statusId"];
    if (router.query?.archived) {
      router.push({
        pathname: router.route,
      });
    } else {
      router.push({
        pathname: router.route,
        query: getParamsToURL({
          archived: true,
        }),
      });
    }
    setStatusId(null);
    setUserAssignedId(null);
  };

  const handleArchive = (id: number) => {
    archiveTask(id);
  };
  useEffect(() => {
    if (Object.entries(router.query).length === 0) {
      setUserAssignedId(null);
      setStatusId(null);
    }
  }, [router.query]);

  useEffect(() => {
    if (router?.query?.mytask) {
      setValueIcon("filterAssign");
    } else if (router?.query?.archived) {
      setValueIcon("filterArchive");
    } else {
      setValueIcon("");
    }
  }, [router.query]);

  const handleDelete = (id: number) => {
    setOpenDeleteModal(true);
    setTaskId(id);
  };

  const lists = [
    { name: "New", id: "1" },
    { name: "In Progress", id: "2" },
    { name: "Done", id: "3" },
  ];

  const list_to_Id: any = {
    New: 1,
    "In Progress": 2,
    Done: 3,
  };
  const elements: any = {};
  lists.forEach((list) => {
    elements[list.id] = dataListTask?.items?.filter(
      (task: any) => task.statusId === lists.indexOf(list) + 1
    );
    elements[list.id]?.sort((a: any, b: any) => a.position - b.position);
  });

  const onDragEnd1 = useCallback(
    (result: any) => {
      updateTaskStatus(+result.draggableId, {
        statusId: list_to_Id[result?.destination?.droppableId]
          ? Number(list_to_Id[result?.destination?.droppableId])
          : +Number(list_to_Id[result?.draggableId]),
        position: result?.destination?.index
          ? +result?.destination?.index + 1
          : 1,
      });
    },
    [updateTaskStatus, list_to_Id]
  );

  return (
    <>
      <HeadMeta title={trans.menu.task} />
      <Breadcrumb
        title={trans.task.todo_list}
        icon={<IconChecklist className={styles["icons"]} />}
      />
      {newClient && (
        <>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ marginTop: 2 }}
          >
            <Grid item xs={8}>
              <InputSearch
                filter={true}
                placeholder={trans.order.title}
                notOnlySearch={true}
                type={"task"}
                dataUserList={dataUserList}
                dataFilter={STATUS_TASK}
              />
            </Grid>
            <Grid item xs={2.7}>
              <Box sx={{ textAlign: "center" }}>
                <ToggleButtonGroup
                  size="small"
                  {...control}
                  aria-label="Small sizes"
                  value={valueIcon}
                >
                  <ToggleButton
                    value="filterAssign"
                    key="filterAssign"
                    style={{ marginLeft: "10px", border: "none" }}
                    onClick={handleShowMyTask}
                  >
                    <Tooltip title={trans.task.my_task}>
                      <PersonOutlineOutlinedIcon />
                    </Tooltip>
                  </ToggleButton>

                  <ToggleButton
                    value="filterArchive"
                    key="filterArchive"
                    style={{ marginLeft: "10px", border: "none" }}
                    onClick={handleShowArchirve}
                  >
                    <Tooltip title={trans.task.archived_list}>
                      <Inventory2OutlinedIcon />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                className="btn_create"
                sx={{ whiteSpace: "no-wrap", minWidth: "max-content" }}
                onClick={handleOpenForm}
              >
                {trans.task.add_task}
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ marginTop: 2 }}
          >
            <Grid item xs={2.5}>
              <Box>
                <FilterStatusButton
                  setTypeList={setTypeList}
                  dataStatusList={STATUS_TASK}
                  setStatusId={setStatusId}
                  statusId={statusId}
                  setPage={setPage}
                  setQuerySearch={setQuerySearch}
                  //labelKey={"statusIdLabel"}
                />
              </Box>
            </Grid>

            <Grid item xs={2.5}>
              <Box>
                <FilterUserAssignedButton
                  disabled={!!router.query?.mytask}
                  setTypeList={setTypeList}
                  dataUserList={dataUserList}
                  setPage={setPage}
                  setQuerySearch={setQuerySearch}
                  setUserAssignedId={setUserAssignedId}
                  userAssignedId={userAssignedId}
                  //labelKey={"userAssignLabel"}
                />
              </Box>
            </Grid>

            <Grid item xs={2.5}>
              <Box>
                <FilterDate />
              </Box>
            </Grid>
          </Grid>

          <QueryListBar />
        </>
      )}

      {newClient && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ padding: 10 }}
                  width="5%"
                  className="list-index padding:10"
                >
                  #
                </TableCell>
                <TableCell
                  style={{ padding: 10 }}
                  width="35%"
                  className="text-align-left"
                >
                  {trans.order.title}
                </TableCell>
                <TableCell
                  style={{ padding: 10 }}
                  width="20%"
                  className="text-align-center"
                >
                  {trans.customer_detail.assigned}
                </TableCell>
                <TableCell
                  style={{ padding: 10 }}
                  width="15%"
                  className="text-align-center"
                >
                  {trans.order.start_date}
                  {!router.query.filterStartDate &&
                    !router.query.filterDueDate && (
                      <SortByDateBtn
                        keyword={"startDate"}
                        setIsSorting={setIsSorting}
                        isSorting={isSorting}
                      />
                    )}
                </TableCell>
                <TableCell
                  style={{ padding: 10 }}
                  width="15%"
                  className="text-align-center"
                >
                  {trans.order.due_date_}
                  {!router.query.filterDueDate &&
                    !router.query.filterStartDate && (
                      <SortByDateBtn
                        keyword={"dueDate"}
                        setIsSorting={setIsSorting}
                        isSorting={isSorting}
                      />
                    )}
                </TableCell>
                <TableCell
                  style={{ padding: 10 }}
                  width="10%"
                  className="text-align-center"
                >
                  {trans.order.status}
                </TableCell>
                <TableCell
                  style={{ padding: 10 }}
                  width="10%"
                  className="text-align-center"
                >
                  {trans.task.action}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataListTask?.items?.map((task: any, index: number) => {
                return (
                  <TableRow key={task?.id}>
                    <TableCell style={{ padding: 10 }}>
                      {dataListTask?.items.length > 0 && itemIndex + index}
                    </TableCell>
                    <TableCell style={{ padding: 10 }} className="text-cursor">
                      <Link
                        href={
                          window.location.href +
                          (hasParam ? "&" : "?") +
                          "taskId=" +
                          task?.id +
                          "&name=" +
                          task?.name
                        }
                        className="text-cursor"
                      >
                        {task?.name}
                      </Link>
                      <Chip
                        color="primary"
                        style={{
                          marginLeft: 4,
                          borderRadius: 8,
                          backgroundColor: PRIORITY_LIST.find(
                            (item) => item.id == task?.priorityId
                          )?.color,
                          height: "auto",
                          verticalAlign: "top",
                          fontSize: 10,
                        }}
                        label={task?.priorityName}
                      />
                    </TableCell>
                    <TableCell
                      style={{ padding: 10 }}
                      className="avart-list-task text-align-center"
                    >
                      {task.users?.map((user: any, index: number) => {
                        return (
                          <Tooltip
                            title={
                              user?.profile &&
                              user?.profile?.first_name +
                                " " +
                                user?.profile?.last_name
                            }
                            key={user?.id}
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
                    <TableCell
                      style={{ padding: 10 }}
                      className="text-align-center"
                    >
                      {task?.startDate ? formatDateTime(task?.startDate) : ""}
                    </TableCell>
                    <TableCell
                      style={{ padding: 10 }}
                      className="text-align-center"
                    >
                      {task?.dueDate ? formatDateTime(task?.dueDate) : ""}
                    </TableCell>
                    <TableCell
                      className="text-align-center"
                      style={{
                        fontWeight: 700,
                        padding: 10,
                      }}
                    >
                      {STATUS_TASK.find(
                        (items) => items.id == task?.statusId
                      )?.name.toUpperCase()}
                    </TableCell>
                    <TableCell style={{ padding: 10 }}>
                      <Stack direction="row" sx={{ justifyContent: "center" }}>
                        <IconButton size="small" color="error">
                          <Tooltip
                            title={trans.task.delete}
                            onClick={() => handleDelete(task?.id)}
                            style={{
                              display: "inline-block",
                              marginRight: "4px",
                            }}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Tooltip>
                        </IconButton>
                        {router?.query?.archived ? (
                          <IconButton size="small" color="primary">
                            <Tooltip
                              title={trans.task.re_archive}
                              onClick={() => handleArchive(task?.id)}
                              style={{
                                display: "inline-block",
                                marginRight: "4px",
                              }}
                            >
                              <RestoreIcon />
                            </Tooltip>
                          </IconButton>
                        ) : (
                          <IconButton size="small" color="primary">
                            <Tooltip
                              title={trans.task.archive}
                              onClick={() => handleArchive(task?.id)}
                              style={{
                                display: "inline-block",
                                marginRight: "4px",
                              }}
                            >
                              <Inventory2OutlinedIcon />
                            </Tooltip>
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!newClient && (
        <div className={styles["box-table-grid"]}>
          <div className={styles["table-grid"]}>
            <DragDropContext onDragEnd={onDragEnd1}>
              {lists.map((listKey: any, index: number) => (
                <div key={listKey?.id} className={styles["table-grid-items"]}>
                  <DraggableElement
                    elements={elements[listKey.id]}
                    key={listKey.id}
                    prefix={listKey.name}
                    indexKey={index}
                  />
                </div>
              ))}
            </DragDropContext>
          </div>
        </div>
      )}
      <ModalDelete
        openModal={openDeleteModal}
        action={() => deleteTask(taskId)}
        setOpenModal={setOpenDeleteModal}
        title={trans.task.about_delete_task}
        content={trans.task.about_delete_task_content}
      />
      {dataListTask?.total > rowsPerPage && newClient && (
        <PaginationDefault
          total={dataListTask?.total}
          setQuerySearch={setQuerySearch}
          setCustomPage={setPage}
          customPage={page}
          statusId={statusId}
        />
      )}
      <FormCreateTask
        openFormModal={openFormModal}
        setOpenFormModal={setOpenFormModal}
      />
      <ModalDetailTask
        taskDetail={dataTaskDetail?.data?.task}
        setTaskId={setTaskId}
        taskId={taskId}
        openModalDetailTask={openModalDetailTask}
        setOpenModalDetailTask={setOpenModalDetailTask}
        setQuerySearch={setQuerySearch}
        fileAttachment={dataTaskDetail?.data?.fileTask}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  task: state.task,
  user: state?.user,
  profile: state.profile,
});

const mapDispatchToProps = {
  getListTask,
  getTask,
  archiveTask,
  deleteTask,
  searchUser,
  updateTaskStatus,
  getDetailProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Task);
