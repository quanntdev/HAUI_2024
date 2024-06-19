import { Avatar, Button, ListItem, ListItemText, Tooltip } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { connect } from "react-redux";
import { searchUser } from "../../../redux/actions/user";
import getLinkAvatar from "../../../utility/getLinkAvatar";
import InputSearchReal from "../InputSearchReal";
import useTrans from "../../../utils/useTran";
import { URL_API_FILE_ATTACHMENT } from "../../../constants";
import getNameFileUpload from "../../../utility/getNameFileUpload";
import { errorToast } from "../../../BaseAxios/toast";

const CommentBox = (props: any) => {
  const {
    value,
    handleChange,
    keyword,
    searchUser,
    handleCancelPostNewComment,
    handlePostNewComment,
    handleUpload,
  } = props;

  const { dataUserList } = props.user;
  const { dataUploadFile } = props?.comment;

  const trans = useTrans();

  const editorRef = useRef<any>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [positionPop, setPositionPop] = useState<any>({ x: 0, y: 0 });

  const handleChangeTiny = useCallback(() => {
    if (editorRef.current) {
      handleChange(keyword, editorRef?.current?.getContent());
    }
  }, [editorRef, keyword, handleChange]);

  const handleChangeKeyPress = useCallback(
    (event: any) => {
      if (event.key === "@") {
        const editor = editorRef.current;
        if (editor) {
          const range: any = editor.selection.getRng();
          const rect = range.getBoundingClientRect();
          setPositionPop(rect);
        }
        setOpenPopup(true);
      } else {
        setOpenPopup(false);
      }
    },
    [editorRef, setPositionPop, setOpenPopup]
  );

  useEffect(() => {
    if (openPopup) {
      if (!dataUserList) searchUser();
    }
  }, [openPopup]);

  const handleClose = useCallback(() => {
    setOpenPopup(false);
  }, [setOpenPopup]);

  const handleMentionUser = (item: any) => {
    const user = item?.profile?.first_name + " " + item?.profile?.last_name;
    let newContent = editorRef?.current?.getContent().slice(0, -5);
    editorRef?.current?.setContent(
      `${newContent} <span id="${item?.id}" style="background:#091e4214; padding:5px; border-radius:5px; font-weight:700">@ ${user}</span> &nbsp;`
    );
    handleChange(keyword, editorRef?.current?.getContent());
    handleClose();
  };

  const handleOnDrop = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!e?.dataTransfer?.files[0]) {
        errorToast(trans.task.upload_file_false);
      } else {
        handleUpload(e?.dataTransfer?.files[0]);
      }
    },
    [handleUpload]
  );

  const handleLinkFile = (url: any) => {
    return URL_API_FILE_ATTACHMENT + url;
  };

  const handlePasteImage = (e: any) => {
    if (e.clipboardData?.files[0]) {
      handleUpload(e?.clipboardData?.files[0]);
    }
  };

  useEffect(() => {
    if (!dataUploadFile) {
      return;
    }

    const attachment = dataUploadFile.data.dataUpdate.attachment;
    const extension = attachment.split(".").pop()?.toLowerCase();

    const typeListImage = ["png", "jpeg", "jpg", "webp"];
    const isImage = typeListImage.includes(extension);

    const linkFile = handleLinkFile(attachment);
    const content = isImage
      ? `<img src="${linkFile}">`
      : `<a href="${linkFile}" style="background:#091e4214; padding:5px; border-radius:5px; font-weight:700">📁 ${getNameFileUpload(
          attachment
        )}</a> &nbsp;`;

    editorRef?.current?.insertContent(content);
    handleChange(keyword, editorRef?.current?.getContent());
  }, [dataUploadFile]);

  const handleDragOver = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const handleEditorInit = useCallback((evt: any, editor: any) => {
    editorRef.current = editor;
  }, []);

  return (
    <div className="tinyCus">
      <Editor
        tinymceScriptSrc={
          "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.3.1/tinymce.min.js"
        }
        onEditorChange={handleChangeTiny}
        onKeyPress={handleChangeKeyPress}
        onDrop={handleOnDrop}
        onDragOver={handleDragOver}
        key={keyword}
        onInit={handleEditorInit}
        init={{
          height: 50,
          menubar: false,
          plugins: "autoresize",
          autoresize_bottom_margin: 0,
          default_link_target: "_blank",
          extended_valid_elements:
            "a[href|target=_blank|style=color: blue; text-decoration: revert]",
          toolbar: `bold italic forecolor ${
            handleUpload ? "customLinkButton" : ""
          } customSaveButton  customCancelButton`,
          toolbar_location: "bottom",
          content_style:
            "body { -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size:14px } img { max-width: 100%; max-height: 370px; }",
          directionality: "ltr",
          init_instance_callback: (editor) => {
            editor.setContent(value);
          },
          setup: function (editor) {
            editor.on("paste cut", function (e) {
              handlePasteImage(e);
            });

            editor.ui.registry.addButton("customLinkButton", {
              tooltip: "Insert file",
              icon: "upload",
              onAction: function () {
                let input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute(
                  "accept",
                  ".doc,.docx, .pdf, .xls, .pptx, .xlsx , .jpeg, .png, .jpg"
                );
                input.onchange = function (event: Event) {
                  const target = event.target as HTMLInputElement;
                  const file = target?.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                      const img = document.createElement("img");
                      img.src = reader.result as string;
                      handleUpload(file);
                    };
                  }
                };
                input.click();
              },
            });

            editor.ui.registry.addButton("customSaveButton", {
              text: trans.task.save,
              onAction: handlePostNewComment,
            });

            editor.ui.registry.addButton("customCancelButton", {
              text: trans.task.cancle,
              onAction: handleCancelPostNewComment,
            });
          },
        }}
      />
      <div className={styles["real"]}>
        <div
          className={openPopup ? styles["popup"] : styles["none"]}
          style={{
            left: positionPop.x + 100 > 850 ? 800 : positionPop.x + 100,
            top: positionPop.y - 100,
          }}
        >
          <div className={styles["title"]}>Mention</div>
          <Button className={styles["close-btn"]} onClick={handleClose}>
            <CloseIcon />
          </Button>
          <InputSearchReal handleSearch={searchUser} />
          <div className={styles["body"]}>
            {dataUserList?.items?.map((item: any) => (
              <>
                <ListItem sx={{ cursor: "pointer" }}>
                  <div onClick={(e) => handleMentionUser(item)}>
                    <ListItemText>
                      <div className={styles["items"]}>
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
                            src={
                              item?.profile?.profileImg
                                ? getLinkAvatar(item?.profile?.profileImg)
                                : ""
                            }
                            sx={{ width: 24, height: 24 }}
                          />
                        </Tooltip>

                        <div className={styles["name"]}>
                          {item?.profile &&
                            item.profile.first_name +
                              " " +
                              item.profile.last_name}
                        </div>
                      </div>{" "}
                    </ListItemText>
                  </div>
                </ListItem>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  comment: state?.comment,
});

const mapDispatchToProps = {
  searchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentBox);
