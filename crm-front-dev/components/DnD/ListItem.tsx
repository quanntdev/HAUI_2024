import { Draggable } from "react-beautiful-dnd";
import React, { useCallback } from "react";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { Avatar, Box, Tooltip } from "@mui/material";
import { PRIORITY_LIST } from "../../constants";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import getLinkAvatar from "../../utility/getLinkAvatar";
import moment from "moment";

const ListItem = ({ item, index }: any) => {
  const router = useRouter();

  const showTask = useCallback(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ["taskId"]: item.id,
        ["name"]: item.name,
      },
    });
  }, [router, item.id, item.name]);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided: any, snapshot: any) => {
        return (
          <Box
            className={styles["DragItem"]}
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={showTask}
          >
            <Box sx={{ background: "white", padding: "5px" }}>
              <div>
                <Box
                  sx={{
                    width: "20%",
                    background: PRIORITY_LIST.find(
                      (color) => color.id == item?.priorityId
                    )?.color,
                    height: "10px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                  }}
                ></Box>
                <span className={styles["item_id"]}>#{item?.id}</span>{" "}
                <span className={styles["item_name"]}>{item?.name}</span>{" "}
              </div>
              <div className={styles["footer"]}>
                <div className={styles["left"]}>
                  <span className={styles["icon"]}>
                    <FormatListBulletedIcon className={styles["icon-item"]} />
                  </span>
                  <span className={styles["icon"]}>
                    {moment(new Date(`${item?.dueDate}`)).format(
                      "YYYY/MM/DD HH:mm"
                    )}
                  </span>
                </div>
                <div className={styles["right"]}>
                  {item.users?.map((user: any, index: number) => {
                    return (
                      <Tooltip
                        title={
                          user?.profile &&
                          user?.profile?.first_name +
                            " " +
                            user?.profile?.last_name
                        }
                        key={user.id}
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                          float: "right",
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
                </div>
              </div>
            </Box>
          </Box>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
