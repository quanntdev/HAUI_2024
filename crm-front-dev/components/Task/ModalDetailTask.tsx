import {
  Close,
  Description,
  Delete,
  Inventory,
  AttachFile,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Table,
  TableCell,
  TableRow,
  Typography,
  Box,
  Checkbox,
  ToggleButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import { connect } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
  FILE_SIZE_MAX,
  LogNoteActions,
  PRIORITY_LIST,
  PUBLIC_STATUS_LIST,
  STATUS_TASK,
  rowsPerPage,
} from "../../constants";
import getLinkAvatar from "../../utility/getLinkAvatar";
import ButtonSaveAndCancel from "../Input/ButtonSaveAndCancel";
import InputFocusAndSave from "../Input/InputFocusAndSave";
import SelectDefault from "../Input/SelectDefault";
import PopperCreateChecklist from "../Popper/PopperCreateCheckList";
import LogNote from "../LogNote";
import {
  createChecklist,
  deleteChecklist,
} from "../../redux/actions/checklist";
import {
  createChecklistItem,
  deleteChecklistItem,
  updateChecklistItem,
  clearData as clearDataChecklistItem,
} from "../../redux/actions/checklistItem";
import {
  getTask,
  updateTask,
  archiveTask,
  deleteTask,
  clearData as clearDataTask,
} from "../../redux/actions/task";
import InputTiny from "../Input/InputTiny";

import styles from "./styles.module.scss";
import moment from "moment";
import CheckListItem from "./ChecklistItemTask";
import { useRouter } from "next/router";
import PopperAsignUser from "../Popper/PopperAsignUser";
import PopperDatePicker from "../Popper/PopperDatePicker";
import ModalDelete from "../../components/Modal/ModalDelete";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {
  clearData,
  deleteComment,
  postComment,
  uploadFileRaw,
} from "../../redux/actions/comment";
import { getDetailProfile } from "../../redux/actions/profile";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { errorToast } from "../../BaseAxios/toast";
import FormDetailFile from "./FormDetailsFile";
import useTrans from "../../utils/useTran";

type DATA_UPDATE_CHECKLIST_ITEM = {
  title: string;
  isDone: number | null;
};

const INIT_DATA_CHECKLIST_ITEM = {
  title: "",
  isDone: null,
};

type DATA_UPDATE_TASK = {
  name: string;
  priorityId: number | null;
  usersId: string;
  statusId: number | null;
  startDate: Date | null;
  dueDate: Date | null;
  description: string;
  isArchived: number | null;
  isPublic: number | null;
};

const INIT_DATA_UPDATE_TASK = {
  name: "",
  priorityId: null,
  usersId: "",
  statusId: null,
  startDate: null,
  dueDate: null,
  description: "",
  isArchived: null,
  isPublic: null,
};

const INIT_DATA_UPLOAD_FILE = {
  object: "",
  objectId: null,
  action: null,
  attachment: null,
  userId: null,
};

const ModalDetailTask = (props: any) => {
  const trans = useTrans();
  const {
    openModalDetailTask,
    setOpenModalDetailTask,
    createChecklist,
    deleteChecklist,
    createChecklistItem,
    deleteChecklistItem,
    updateChecklistItem,
    clearDataChecklistItem,
    clearDataTask,
    getTask,
    updateTask,
    archiveTask,
    deleteTask,
    getDetailProfile,
    taskDetail,
    setTaskId,
    taskId,
    uploadFileRaw,
    fileAttachment,
    deleteComment,
    errors
  } = props;
  const { dataCreateChecklist, dataDeleteChecklist } = props.checklist;
  const {
    dataCreateChecklistItem,
    dataDeleteChecklistItem,
    dataUpdateChecklistItem,
  } = props.checklistItem;
  const { dataUpdateTask, dataTaskDelete, dataTaskDetail } = props?.task;
  const { dataCommentDelete } = props?.comment;
  const { dataDetailProfile } = props?.profile;
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();

  const router = useRouter();

  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [idCheckAddInput, setIdCheckAddInput] = useState<any>(null);
  const [newChecklistItem, setNewChecklistItem] = useState<any>(null);
  const [dataChecklistItem, setDataChecklistItem] = useState<any>(null);
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const [pageOrderItem, setPageOrderItem] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [dataStatusTask, setDataStatusTask] = useState<any>(null);
  const [openDeleteTaskModal, setOpenDeleteTaskModal] =
    useState<boolean>(false);
  const [formUpdateTask, setFormUpdateTask] = useState<DATA_UPDATE_TASK>(
    INIT_DATA_UPDATE_TASK
  );
  const [formUpdateChecklistItem, setFormUpdateChecklistItem] =
    useState<DATA_UPDATE_CHECKLIST_ITEM>(INIT_DATA_CHECKLIST_ITEM);

  const [formUploadFile, setFormUploadFile] = useState<any>({
    ...INIT_DATA_UPLOAD_FILE,
    object: "tasks",
  });
  
  useEffect(() => {
    if (STATUS_TASK.length === 4) {
      const dataStatus = STATUS_TASK.filter((item) => item.name !== "All");
      setDataStatusTask(dataStatus);
    }
  }, []);

  useEffect(() => {
    if (taskDetail?.id) {
      getTask(
        taskDetail?.id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
    }

    if (
      dataUpdateTask ||
      dataDeleteChecklist ||
      dataCreateChecklist ||
      dataCreateChecklistItem ||
      dataDeleteChecklistItem ||
      dataUpdateChecklistItem ||
      dataCommentDelete
    ) {
      if (router?.query?.view) {
        removeQueryParam(["view"]);
      }
    }
  }, [
    dataUpdateTask,
    dataDeleteChecklist,
    dataCreateChecklist,
    dataCreateChecklistItem,
    dataDeleteChecklistItem,
    dataUpdateChecklistItem,
    dataCommentDelete,
  ]);

  useEffect(() => {
    if (!dataTaskDetail) {
      setOpenModalDetailTask(false);
    } else {
      setOpenModalDetailTask(true);
    }
  }, [dataTaskDetail]);

  useEffect(() => {
    if (!openModalDetailTask) {
      clearDataTask("dataTaskDetail");
    }
  }, [openModalDetailTask]);

  useEffect(() => {
    if (dataTaskDelete) {
      handleCloseModal();
    }
  }, [dataTaskDelete]);

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    setFormUpdateTask({
      ...formUpdateTask,
      name: taskDetail?.name,
      priorityId: taskDetail?.priorityId,
      usersId: taskDetail?.usersId,
      statusId: taskDetail?.statusId,
      startDate: taskDetail?.startDate,
      dueDate: taskDetail?.dueDate,
      description: taskDetail?.description,
      isArchived: taskDetail?.isArchived,
      isPublic: taskDetail?.isPublic,
    });
  }, [dataTaskDetail, editDescription]);

  const removeQueryParam = (paramList: any) => {
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

  const handleCloseModal = () => {
    removeQueryParam(["name", "taskId", "view"]);
    setOpenModalDetailTask(false);
  };

  const handleEditTitle = (e: any) => {
    setEditTitle(true);
  };

  const handleChangeInput = (key: any, value: any) => {
    setFormUpdateTask({
      ...formUpdateTask,
      [key]: value,
    });
  };
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = useCallback(() => {
    setOpen(true);
    const timer = setTimeout(() => {
      setOpen(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [setOpen]);

  const handleBlurInput = (e: any) => {
    if (formUpdateTask?.name !== taskDetail?.name) {
      updateTask(taskDetail?.id, formUpdateTask);
      clearDataTask("dataUpdateTask");
    }
    setEditTitle(false);
  };

  const handleChangeSelect = (key: any, value: any) => {
    if (
      taskDetail?.statusId !== value ||
      taskDetail?.priorityId !== value ||
      taskDetail?.isPublic !== value
    ) {
      updateTask(taskDetail?.id, {
        ...formUpdateTask,
        [key]: value,
      });
      clearDataTask("dataUpdateTask");
    }
  };

  const addCheckListItem = (checklistId: any) => {
    if (!newChecklistItem) {
      setIdCheckAddInput(checklistId);
      addFormNewCheckListItem(checklistId);
    } else {
      handleCreateChecklistItem(checklistId);
    }
  };

  const handleCreateChecklistItem = (checklistId: any) => {
    if (dataChecklistItem && checklistId === idCheckAddInput) {
      createChecklistItem(dataChecklistItem);
      addFormNewCheckListItem(checklistId);
      setDataChecklistItem(null);
      clearDataChecklistItem("dataChecklistItem");
    } else {
      setIdCheckAddInput(checklistId);
      addFormNewCheckListItem(checklistId);
    }
  };

  const removeChecklistItem = () => {
    setIdCheckAddInput(null);
    setNewChecklistItem(null);
    setDataChecklistItem(null);
  };

  const handleDeleteChecklistItem = (checklistItemId: any) => {
    deleteChecklistItem(checklistItemId);
  };

  const addFormNewCheckListItem = (checklistId: any) => {
    setNewChecklistItem(
      <CheckListItem
        checklistId={checklistId}
        dataChecklistItem={dataChecklistItem}
        setDataChecklistItem={setDataChecklistItem}
        dataCreateChecklistItem={dataCreateChecklistItem}
      />
    );
  };

  const handleEditDescription = () => {
    setEditDescription(true);
  };

  const handleUpdateDescriptionTask = () => {
    updateTask(taskDetail?.id, formUpdateTask);
    setEditDescription(false);
  };

  const handleClickCancel = () => {
    setEditDescription(false);
  };

  const handleRemoveAsigned = (id: any) => {
    const arrayId = taskDetail?.users?.map((item: any) => item?.id);
    const newArrayId = arrayId?.filter((item: any) => item !== id);
    updateTask(taskDetail?.id, {
      ...formUpdateTask,
      usersId: newArrayId?.toString(),
    });
    clearDataTask("dataUpdateTask");
  };

  const handleDeleteChecklist = (id: number) => {
    deleteChecklist(id);
  };

  const getChecklistItem = (checklistId: number, checklistItemId: number) => {
    const checklist = getChecklist(checklistId);
    const checklistItem = checklist[0]?.item?.filter(
      (item: any) => item?.id === Number(checklistItemId)
    );
    return checklistItem;
  };

  const handleDeleteTask = (id: number) => {
    setOpenDeleteTaskModal(true);
    setTaskId(id);
  };

  const copyToClipboard = () => {
    const url = document.createElement("textarea");
    url.value = window.location.href;
    document.body.appendChild(url);
    url.select();
    document.execCommand("copy");
    document.body.removeChild(url);
  };

  const handleCheckbox = (e: any, checklistId: number) => {
    const { id, checked } = e.target;
    const checklistItem = getChecklistItem(checklistId, id);
    updateChecklistItem(id, {
      ...formUpdateChecklistItem,
      isDone: Number(checked),
      title: checklistItem?.[0]?.title,
    });
    clearDataChecklistItem("dataUpdateChecklistItem");
  };

  const getChecklist = (checklistId: number) => {
    return taskDetail.checklist?.filter(
      (item: any) => item?.id === checklistId
    );
  };

  const totalAllChecklistItem = (checklistId: number) => {
    return getChecklist(checklistId)[0]?.item?.length;
  };

  const totalChecklistItemIsDone = (checklistId: number) => {
    const checklist = getChecklist(checklistId);
    const checklistItemIsDone = checklist?.[0]?.item?.filter(
      (item: any) => item?.isDone === true
    );
    return checklistItemIsDone?.length;
  };

  const handleToShowInvoice = (id: number) => {
    setOpenModalDetailTask(false);
    router.push(`/invoices/${id}/?tab=0`);
  };
  const handleToShowOrder = (id: number) => {
    setOpenModalDetailTask(false);
    router.push(`/order/${id}/?tab=0`);
  };
  const handleToShowCustomer = (id: number) => {
    setOpenModalDetailTask(false);
    router.push(`/customer/${id}/?tab=0`);
  };
  const handleToShowDeal = (id: number) => {
    setOpenModalDetailTask(false);
    router.push(`/deals/${id}/?tab=0`);
  };

  useEffect(() => {
    if (taskDetail) {
      setFormUploadFile({
        object: "tasks",
        objectId: Number(taskDetail?.id),
        action: LogNoteActions.UPLOAD_FILE,
        attachment: null,
        userId: isLoggedInUserId,
      });
    }
  }, [taskDetail]);

  function changeToSlug(str: string) {
    str = str.toLowerCase();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/[đĐ]/g, "d");
    str = str.replace(/([^0-9a-z-\s])/g, "");
    str = str.replace(/(\s+)/g, "-");
    str = str.replace(/-+/g, "-");
    return str;
  }

  function getNameFile(str: any) {
    const type = str.split(".").pop();
    return encodeURIComponent(str) + "." + type;
  }

  const handleUp = useCallback(
    (file: any) => {
      const newFile = new File([file], getNameFile(file.name));
      if (newFile.size > FILE_SIZE_MAX) {
        errorToast("file is too big");
      } else {
        let newData: any;
        if (file.type.startsWith("image/")) {
          newData = {
            ...formUploadFile,
            action: LogNoteActions.UPLOAD_FILE,
            attachment: newFile,
          };
        } else {
          newData = {
            ...formUploadFile,
            action: LogNoteActions.UPLOAD_FILE_RAW,
            attachment: newFile,
          };
        }
        uploadFileRaw(newData);
        clearData("dataUploadFile");
      }
    },
    [formUploadFile, uploadFileRaw]
  );

  useEffect(() => {
    const startDate = moment(formUpdateTask?.startDate);
    const dueDate = moment(formUpdateTask?.dueDate);

    if (startDate.isSameOrAfter(dueDate)) {
      setFormUpdateTask((prevFormUpdateTask: any) => ({
        ...prevFormUpdateTask,
        dueDate: moment(startDate).add(1, "days").format("YYYY-MM-DD HH:mm"),
      }));
    }
  }, [formUpdateTask?.startDate]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      className={`dialog-form ${styles["dialog"]}`}
      onClose={handleCloseModal}
      open={openModalDetailTask}
      disableEnforceFocus={true}
      disableAutoFocus={true}
    >
      {taskDetail && (
        <Box className={styles["box-task"]}>
          <Divider />
          <DialogContent className={styles["detail"]}>
            <Grid container>
              <Grid item sm={9} className={styles["detail-right"]}>
                <Box sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                  #{taskDetail?.id}
                </Box>
                <Box>
                  <Box className={styles["detail-right-box"]}>
                    <Box>
                      <InputFocusAndSave
                        size="small"
                        value={formUpdateTask.name}
                        keyword="name"
                        onChange={handleChangeInput}
                        onBlur={handleBlurInput}
                        onClick={handleEditTitle}
                        editTitle={editTitle}
                      />
                    </Box>
                    {(!!taskDetail?.order ||
                      !!taskDetail?.customer ||
                      !!taskDetail?.invoice ||
                      !!taskDetail?.deal) && (
                      <Box className={styles["detail-right-content"]}>
                        {(!!taskDetail?.order && (
                          <>
                            {trans.menu.order}:
                            <span
                              className="text-cursor text-link ml-8"
                              onClick={() =>
                                handleToShowOrder(taskDetail?.order?.id)
                              }
                            >
                              {taskDetail?.order?.name}
                            </span>
                          </>
                        )) ||
                          (!!taskDetail?.customer && (
                            <>
                              {trans.menu.customer}:
                              <span
                                className="text-cursor text-link ml-8"
                                onClick={() =>
                                  handleToShowCustomer(taskDetail?.customer?.id)
                                }
                              >
                                {taskDetail?.customer?.name}
                              </span>
                            </>
                          )) ||
                          (!!taskDetail?.invoice && (
                            <>
                              {trans.invoice.invoiceID}:
                              <span
                                className="text-cursor text-link ml-8"
                                onClick={() =>
                                  handleToShowInvoice(taskDetail?.invoice?.id)
                                }
                              >
                                {taskDetail?.invoice?.code}
                              </span>
                            </>
                          )) ||
                          (!!taskDetail?.deal && (
                            <>
                              {trans.menu.deal}:
                              <span
                                className="text-cursor text-link ml-8"
                                onClick={() =>
                                  handleToShowDeal(taskDetail?.deal?.id)
                                }
                              >
                                {taskDetail?.deal?.name}
                              </span>
                            </>
                          ))}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", marginBottom: "10px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ fontSize: "13px", fontWeight: "bold" }}>
                        {trans.order.status}
                      </Box>
                      <Box sx={{ marginLeft: "10px" }}>
                        <SelectDefault
                          keyValue="name"
                          keyMenuItem="id"
                          keyword="statusId"
                          handleChange={handleChangeSelect}
                          value={formUpdateTask?.statusId}
                          data={dataStatusTask}
                          size="small"
                          sx={{
                            boxShadow: "none",
                            ".MuiOutlinedInput-notchedOutline": {
                              border: 0,
                            },
                            backgroundColor: "#f7f7f7 !important",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "40px",
                      }}
                    >
                      <Box sx={{ fontSize: "13px", fontWeight: "bold" }}>
                        {trans.customer.priority}
                      </Box>
                      <Box sx={{ marginLeft: "10px" }}>
                        <SelectDefault
                          keyValue="name"
                          size="small"
                          sx={{
                            boxShadow: "none",
                            ".MuiOutlinedInput-notchedOutline": {
                              border: 0,
                            },
                            backgroundColor: "#f7f7f7 !important",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                          keyMenuItem="id"
                          keyword="priorityId"
                          handleChange={handleChangeSelect}
                          value={formUpdateTask?.priorityId}
                          data={PRIORITY_LIST}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "40px",
                      }}
                    >
                      <Box sx={{ fontSize: "13px", fontWeight: "bold" }}>
                        {trans.task.public}
                      </Box>
                      <Box sx={{ marginLeft: "10px" }}>
                        <SelectDefault
                          keyValue="name"
                          size="small"
                          sx={{
                            boxShadow: "none",
                            ".MuiOutlinedInput-notchedOutline": {
                              border: 0,
                            },
                            backgroundColor: "#f7f7f7 !important",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                          keyMenuItem="id"
                          keyword="isPublic"
                          handleChange={handleChangeSelect}
                          value={Number(formUpdateTask?.isPublic)}
                          data={PUBLIC_STATUS_LIST}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", marginTop: "20px" }}>
                    <Box>
                      <Box sx={{ marginBottom: "10px" }}>
                        <Typography sx={{ fontSize: "13px" }}>
                          {trans.task.assigned_user}
                        </Typography>
                      </Box>
                      <Box className={styles["detail-left-avatar"]}>
                        {taskDetail?.users?.map((item: any) => (
                          <>
                            <Tooltip
                              title={
                                item?.profile &&
                                item?.profile?.first_name +
                                  " " +
                                  item?.profile?.last_name
                              }
                              key={item?.id}
                              className="mr-8"
                            >
                              <Avatar
                                className={`${styles["button-click"]}`}
                                src={
                                  item?.profile?.profileImg
                                    ? getLinkAvatar(item?.profile?.profileImg)
                                    : ""
                                }
                                sx={{ width: 24, height: 24 }}
                                onClick={() => handleRemoveAsigned(item?.id)}
                              />
                            </Tooltip>
                          </>
                        ))}
                        <PopperAsignUser
                          userAsigned={taskDetail?.users}
                          formUpdateTask={formUpdateTask}
                          updateTask={updateTask}
                          task={taskDetail}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ marginLeft: "40px" }}>
                      <Grid item sx={{ fontSize: "14px" }}>
                        <Typography sx={{ fontSize: "13px" }}>
                          {trans.order.start_date}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          backgroundColor: "#f7f7f7",
                          padding: "2px",
                          borderRadius: "3px",
                        }}
                      >
                        <PopperDatePicker
                          formUpdateTask={formUpdateTask}
                          setFormUpdateTask={setFormUpdateTask}
                          handleChangeInput={handleChangeInput}
                          updateTask={updateTask}
                          task={taskDetail}
                          keyword="startDate"
                          title={trans.order.start_date}
                          value={
                            formUpdateTask?.startDate
                              ? moment(
                                  new Date(formUpdateTask?.startDate)
                                ).format("YYYY-MM-DD HH:mm")
                              : ""
                          }
                        />
                      </Grid>
                    </Box>
                    <Box sx={{ marginLeft: "40px" }}>
                      <Grid item sx={{ fontSize: "14px" }}>
                        <Typography sx={{ fontSize: "13px" }}>
                          {trans.order.due_date_}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          backgroundColor: "#f7f7f7",
                          padding: "2px",
                          borderRadius: "3px",
                        }}
                      >
                        <PopperDatePicker
                          formUpdateTask={formUpdateTask}
                          setFormUpdateTask={setFormUpdateTask}
                          handleChangeInput={handleChangeInput}
                          updateTask={updateTask}
                          task={taskDetail}
                          keyword="dueDate"
                          title={trans.order.due_date_}
                          value={moment(
                            new Date(`${formUpdateTask?.dueDate}`)
                          ).format("YYYY-MM-DD HH:mm")}
                          dataError={errors}
                          minDate={moment(formUpdateTask?.startDate).format("YYYY-MM-DD HH:mm")}
                        />
                      </Grid>
                    
                    </Box>
                  </Box>
                  <Box
                    sx={{ marginTop: "10px" }}
                    className={styles["detail-right-box"]}
                  >
                    <Box className={styles["detail-right-flex"]}>
                      <Typography className={styles["detail-title"]}>
                        <Description className={styles["detail-icon"]} />
                        {trans.task.description}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box className="mt-8">
                      {editDescription ? (
                        <>
                          <InputTiny
                            handleChange={handleChangeInput}
                            keyword="description"
                            value={formUpdateTask?.description}
                            handleUpload={handleUp}
                            object={taskDetail}
                            objectName={"tasks"}
                            isLoggedInUserId={isLoggedInUserId}
                            onEdit={true}
                          />
                          <ButtonSaveAndCancel
                            onClickSave={handleUpdateDescriptionTask}
                            onClickCancel={handleClickCancel}
                          />
                        </>
                      ) : (
                        <>
                          <Box className={styles["detail-right-content"]}>
                            <span
                              className={styles["detail-right-content-img"]}
                              dangerouslySetInnerHTML={{
                                __html: taskDetail?.description,
                              }}
                            />
                          </Box>
                          <span
                            className="text-cursor text-link ml-8"
                            onClick={handleEditDescription}
                          >
                            {trans.task.edit_description}
                          </span>
                        </>
                      )}
                    </Box>
                  </Box>
                  {!!taskDetail?.checklist?.length &&
                    taskDetail?.checklist?.map((item: any) => (
                      <Box
                        className={styles["detail-right-box"]}
                        key={item?.id}
                        id={item?.id}
                      >
                        <Box className={styles["detail-right-flex"]}>
                          <Typography className={styles["detail-title"]}>
                            <CheckBoxOutlinedIcon
                              className={styles["detail-checkbox"]}
                            />
                            {item?.title}
                            <span
                              className="text-cursor text-link ml-8"
                              onClick={(e) => handleDeleteChecklist(item?.id)}
                            >
                              {trans.task.delete}
                            </span>
                          </Typography>
                          <Box>
                            <span className="font-14">
                              {!!item?.item?.length &&
                                `${totalChecklistItemIsDone(
                                  item?.id
                                )} / ${totalAllChecklistItem(item?.id)}`}
                            </span>
                          </Box>
                        </Box>
                        <Divider />
                        <Box
                          className={`${styles["detail-right-content"]} mt-8`}
                        >
                          {!!item?.item?.length &&
                            item?.item?.map((checklistItem: any) => (
                              <Grid
                                container
                                spacing={2}
                                key={checklistItem?.id}
                              >
                                <Grid item xs={1}>
                                  <Checkbox
                                    name={checklistItem?.title}
                                    id={checklistItem?.id}
                                    checked={checklistItem?.isDone}
                                    size="small"
                                    onClick={(e) => handleCheckbox(e, item?.id)}
                                  />
                                </Grid>
                                <Grid item xs={10} className="flex-start">
                                  <Box
                                    className={
                                      checklistItem?.isDone &&
                                      `text-decoration-line-through`
                                    }
                                  >
                                    {checklistItem?.title}
                                  </Box>
                                </Grid>
                                <Grid item xs={1} className="flex-start">
                                  <Delete
                                    sx={{ width: 18, height: 18 }}
                                    onClick={() =>
                                      handleDeleteChecklistItem(
                                        checklistItem?.id
                                      )
                                    }
                                  />
                                </Grid>
                              </Grid>
                            ))}
                        </Box>
                        {idCheckAddInput == item?.id && newChecklistItem}
                        <Box className={styles["detail-right-content"]}>
                          {idCheckAddInput !== item?.id && (
                            <span
                              id={item?.id}
                              className="text-cursor text-link"
                              onClick={() => addCheckListItem(item?.id)}
                            >
                              {trans.task.add_checklist}
                            </span>
                          )}
                          {idCheckAddInput === item?.id && (
                            <Box className="flex-end mt-8">
                              <span
                                id={item?.id}
                                className={`${
                                  dataChecklistItem ? "text-cursor" : "disable"
                                } text-link mr-8`}
                                onClick={() => addCheckListItem(item?.id)}
                              >
                                {trans.task.add}
                              </span>
                              <span
                                className="text-cursor text-link ml-8"
                                onClick={removeChecklistItem}
                              >
                                {trans.task.remove}
                              </span>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  <Box className={styles["detail-right-box"]}>
                    <Box className={styles["detail-right-flex"]}>
                      <Typography className={styles["detail-title"]}>
                        <AttachFile className={styles["detail-icon"]} />
                        {trans.task.attachments}
                      </Typography>
                    </Box>
                    <Divider />
                    {fileAttachment?.map((item: any) => (
                      <FormDetailFile
                        key={item?.id}
                        file={item}
                        deleteComment={deleteComment}
                      />
                    ))}
                  </Box>
                  <LogNote
                    isLoggedInUserId={isLoggedInUserId}
                    title={trans.home.activity}
                    object={taskDetail}
                    logNotes={dataTaskDetail?.data?.logNote}
                    objectName="tasks"
                    getObject={getTask}
                    onEditDes={editDescription}
                  />
                </Box>
              </Grid>
              <Grid item sm={3} className={styles["detail-left"]}>
                <Box>
                  <Box className={styles["detail-left-box"]}>
                    <Box>
                      <Typography className={styles["detail-left-title"]}>
                        {trans.task.actions}
                      </Typography>
                    </Box>
                    <Box className={styles["detail-left-content"]}>
                      <PopperCreateChecklist
                        createChecklist={createChecklist}
                        taskId={taskDetail?.id}
                        dataCreateChecklist={dataCreateChecklist}
                      />
                      <Box
                        className={`${styles["detail-title"]} ${styles["detail-left-info"]} ${styles["button-click"]}`}
                        onClick={() => {
                          archiveTask(taskDetail?.id);
                          handleCloseModal();
                        }}
                      >
                        <Inventory className={styles["detail-icon-left"]} />
                        <span> {trans.task.archive}</span>
                      </Box>
                      <Box
                        className={`${styles["detail-title"]} ${styles["detail-left-info"]} ${styles["button-click"]}`}
                        onClick={() => {
                          handleDeleteTask(taskDetail?.id);
                        }}
                      >
                        <Delete className={styles["detail-icon-left"]} />
                        <span>{trans.task.delete}</span>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontSize: "14px" }}>
                        {trans.task.share}
                      </Typography>
                    </Box>
                    <Box>
                      <Table style={{ height: "50px" }}>
                        <TableRow>
                          <TableCell
                            style={{ position: "relative" }}
                            className={styles["detail-left-table-row"]}
                          >
                            <input
                              type="text"
                              style={{ width: "85%" }}
                              value={window.location.href.substring(0, 45)}
                              disabled={true}
                            />
                            <ClickAwayListener onClickAway={handleTooltipClose}>
                              <Tooltip
                                PopperProps={{
                                  disablePortal: true,
                                }}
                                onClose={handleTooltipClose}
                                open={open}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={trans.task.copied}
                              >
                                <ToggleButton
                                  value="Copy"
                                  key="Copy"
                                  size="small"
                                  disableFocusRipple={true}
                                  disableRipple={true}
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    border: "none",
                                  }}
                                  onClick={copyToClipboard}
                                >
                                  <ContentCopyIcon
                                    onClick={handleTooltipOpen}
                                  />
                                </ToggleButton>
                              </Tooltip>
                            </ClickAwayListener>
                          </TableCell>
                        </TableRow>
                      </Table>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <ModalDelete
            openModal={openDeleteTaskModal}
            action={() => deleteTask(taskId)}
            setOpenModal={setOpenDeleteTaskModal}
            title={trans.task.about_delete_task}
            content={trans.task.about_delete_task_content}
          />
          <Button onClick={handleCloseModal} className={styles["button-close"]}>
            <Close />
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

const mapStateToProps = (state: any) => ({
  checklist: state?.checklist,
  checklistItem: state?.checklistItem,
  task: state?.task,
  comment: state?.comment,
  profile: state?.profile,
  errors: state.task?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createChecklist,
  deleteChecklist,
  createChecklistItem,
  deleteChecklistItem,
  updateChecklistItem,
  getTask,
  updateTask,
  clearDataChecklistItem,
  clearDataTask,
  archiveTask,
  deleteTask,
  postComment,
  deleteComment,
  clearData,
  uploadFileRaw,
  getDetailProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailTask);
