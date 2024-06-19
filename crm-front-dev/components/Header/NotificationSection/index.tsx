import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Button, ButtonBase, Tooltip } from "@mui/material";

import { IconBell } from "@tabler/icons";
import { connect } from "react-redux";

import {
  getListNotification,
  updateSeenAllNotification,
} from "../../../redux/actions/notification";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import getLinkAvatar from "../../../utility/getLinkAvatar";
import useTrans from "../../../utils/useTran";

const NotificationSection = (props: any) => {
  const trans = useTrans();
  const { getListNotification, updateSeenAllNotification } = props;
  const { dataNotificationList, dataUpdateSeenAll } = props.notification;
  const theme: any = useTheme();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const anchorRef: any = useRef(null);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
    if (dataNotificationList?.totalNotSeen > 0) {
      updateSeenAllNotification();
    }
  }, [setOpen, dataNotificationList, updateSeenAllNotification]);

  useEffect(() => {
    setOpen(false);
  }, [router.query]);

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    getListNotification();
  }, [router.query, dataUpdateSeenAll, open]);

  const changeLink = (object: string, objectId: number, lognoteId: any) => {
    switch (object) {
      case "deals": {
        window.location.href = `/deals/${objectId}?tab=lognote&view=${lognoteId}`;
        break;
      }

      case "customers": {
        window.location.href = `/customer/${objectId}?tab=lognote&view=${lognoteId}`;
        break;
      }

      case "orders": {
        window.location.href = `/order/${objectId}?tab=lognote&view=${lognoteId}`;
        break;
      }

      case "invoices": {
        window.location.href = `/invoices/${objectId}?tab=lognote&view=${lognoteId}`;
        break;
      }

      case "tasks": {
        window.location.href = `/task?taskId=${objectId}&view=${lognoteId}`;
        break;
      }
    }
  };


  const notificalList = (
    <>
      <div className={styles["notification-list"]}>
        <div className={styles["notification-header"]}>
          {trans.home.notification}
        </div>
        <div className={styles["notification-body"]}>
          <div className={styles["notification-body-content"]}>
            {dataNotificationList?.data?.map((item: any, index: any) => {
              return (
                <div
                  style={
                    item?.seen == 1
                      ? { background: "white" }
                      : { background: "rgb(228, 228, 228)" }
                  }
                  key={item.id}
                  className={styles["notification-body-content-item"]}
                  onClick={
                    item?.lognote_title &&
                    (() =>
                      changeLink(
                        item?.logNote?.object,
                        item?.logNote?.objectId,
                        item?.logNote?.id
                      ))
                  }
                >
                  <div className={styles["user"]}>
                    <Tooltip
                      title={item?.formUser?.name}
                      key={1}
                      style={{
                        marginRight: "4px",
                      }}
                    >
                      <Avatar
                        src={
                          item?.formUser?.avatar
                            ? getLinkAvatar(item?.formUser?.avatar)
                            : ""
                        }
                        alt={trans.home.picture_of_the_author}
                        sx={{ width: 40, height: 40 }}
                      />
                    </Tooltip>
                  </div>
                  <div className={styles["content"]}>
                    <div className={styles["head"]}>
                      <span className={styles["name"]}>
                        {item?.formUser?.name
                          ? item?.formUser?.name
                          : trans.customer.delete_user}
                      </span>
                      <span className={styles["time"]}>{item?.time}</span>

                      {item?.lognote_title ? (
                        <div
                          className={styles["notification"]}
                          dangerouslySetInnerHTML={{
                            __html: item?.notification,
                          }}
                        ></div>
                      ) : (
                        <div className={styles["notification"]}>
                          <p style={{ color: "red", marginLeft: "5px" }}>
                            {trans.customer.delete_data}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={styles["bot"]}>
                      {/* <span
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: 100
                      }}
                        dangerouslySetInnerHTML={{
                          __html:
                          stripHTML(item?.logNote?.content),
                        }}
                      /> */}
                    </div>
                  </div>
                  <div className={styles["seen"]}>
                    {item?.seen == 1 && (
                      <Button
                        variant="contained"
                        className={styles["seen-btn"]}
                      ></Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down("md")]: {
            mr: 2,
          },
        }}
      >
        <ButtonBase sx={{ borderRadius: "12px" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all 0.2s ease-in-out 0s",
              background: "rgb(237, 231, 246)",
              color: "rgb(94, 53, 177)",
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: "rgb(94, 53, 177)",
                color: "rgb(237, 231, 246)",
              },
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="1.3rem" />
          </Avatar>
          {dataNotificationList?.totalNotSeen > 0 && (
            <div className="notification-number">
              {dataNotificationList?.totalNotSeen > 9
                ? "9+"
                : dataNotificationList?.totalNotSeen}
            </div>
          )}
        </ButtonBase>
      </Box>
      {open ? notificalList : ""}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  notification: state.notification,
});

const mapDispatchToProps = {
  getListNotification,
  updateSeenAllNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSection);
