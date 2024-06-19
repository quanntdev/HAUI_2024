import { Avatar, Button, ListItem, ListItemText, Tooltip } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { connect } from "react-redux";
import { searchUser } from "../../../redux/actions/user";
import getLinkAvatar from "../../../utility/getLinkAvatar";
import InputSearchReal from "../InputSearchReal";
import fileBackground from "../../../assets/images/file.png";
import { uploadFileRaw, clearData } from "../../../redux/actions/comment";
import {
  FILE_SIZE_MAX,
  LogNoteActions,
  URL_API_FILE_ATTACHMENT,
} from "../../../constants";
import { errorToast } from "../../../BaseAxios/toast";
import getNameFileUpload from "../../../utility/getNameFileUpload";
const path = require("path");

const InputTiny = (props: any) => {
  const {
    value,
    handleChange,
    keyword,
    searchUser,
    setDataForm,
    dataForm,
    canDrop,
    uploadFileRaw,
    object,
    objectName,
    isLoggedInUserId,
    onEdit,
    clearData,
    heightScreen = 300,
  } = props;
  const { dataUploadFile } = props?.comment;
  const [file, setFile] = useState<any>([]);
  const [listFile, setListFile] = useState<any>([]);
  const [textFail, setTextFail] = useState<any>();

  const { dataUserList } = props.user;

  const editorRef = useRef<any>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleChangeTiny = () => {
    if (editorRef.current) {
      handleChange(keyword, editorRef?.current?.getContent());
    }
  };

  const handleChangeKeyPress = (event: any) => {
    if (event.key === "@") {
      setOpenPopup(true);
    } else {
      setOpenPopup(false);
    }
  };

  useEffect(() => {
    if (openPopup) {
      if (!dataUserList) searchUser();
    }
  }, [openPopup]);

  const handleClose = () => {
    setOpenPopup(false);
  };

  const handleMentionUser = (item: any) => {
    const user = item?.profile?.first_name + " " + item?.profile?.last_name;
    editorRef?.current?.insertContent(
      `<span id="${item?.id}" style="background:#091e4214; padding:5px; border-radius:5px; font-weight:700">${user}</span> &nbsp;`
    );
    handleChange(keyword, editorRef?.current?.getContent());
    handleClose();
  };

  const handleUploadFile = (fileUpload: any) => {
    if (fileUpload) {
      const typeList = [
        "docx",
        "xlsx",
        "doc",
        "png",
        "pdf",
        "xls",
        "pptx",
        "jpeg",
        "jpg",
      ];

      const extension = path.extname(fileUpload?.name).substring(1);
      if (typeList.includes(extension)) {
        if (fileUpload?.type?.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            const imgLink = reader.result as any;
            const newObj = {
              linkImg: imgLink,
              id: Number(listFile.length + 1),
              type: "image",
              name: fileUpload.name,
            };
            setListFile([...listFile, newObj]);
          };
          reader.readAsDataURL(fileUpload);
        } else {
          const newObj = {
            linkImg: fileUpload?.name,
            id: Number(listFile.length + 1),
            type: "files",
            name: fileUpload.name,
          };
          editorRef?.current?.insertContent(
            `<a href='#' style="background:#091e4214; padding:5px; border-radius:5px; font-weight:700">📁 ${fileUpload?.name}</a> &nbsp;`
          );
          handleChangeTiny();
          setListFile([...listFile, newObj]);
        }

        const newFile = {
          fileName: fileUpload,
          id: Number(listFile.length + 1),
        };
        file.push(newFile);
        setFile([...file]);
        const dataToUploadFile = file.map(function (obj: any) {
          return obj.fileName;
        });
        setDataForm({ ...dataForm, ["attachment"]: dataToUploadFile });
        setTextFail("");
      } else {
        setTextFail(`* Oops, Drop file cannot support [ ${extension} ] type `);
      }
    } else {
      setTextFail("* Oops, my Bad , please Upload again ! ! !");
    }
  };

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

  const handleUploadAttacmentLog = (file: any) => {
    if (file) {
      const typeList = [
        "docx",
        "xlsx",
        "doc",
        "png",
        "pdf",
        "xls",
        "pptx",
        "jpeg",
        "jpg",
      ];

      const extension: any = path?.extname(file?.name).substring(1);
      if (typeList.includes(extension)) {
        const newFile = new File([file], getNameFile(file.name));
        if (newFile.size > FILE_SIZE_MAX) {
          errorToast("file is too big");
        } else {
          let newData: any;
          if (file.type.startsWith("image/")) {
            newData = {
              object: objectName,
              objectId: Number(object?.id),
              userId: isLoggedInUserId,
              action: LogNoteActions.UPLOAD_FILE,
              attachment: newFile,
            };
          } else {
            newData = {
              object: objectName,
              objectId: Number(object?.id),
              userId: isLoggedInUserId,
              action: LogNoteActions.UPLOAD_FILE_RAW,
              attachment: newFile,
            };
          }
          uploadFileRaw(newData);
          clearData("dataUploadFile");
          setTextFail("");
        }
      } else {
        setTextFail(`* Oops, Drop file cannot support [ ${extension} ] type `);
      }
    } else {
      setTextFail("* Oops, my Bad , please Upload again ! ! !");
    }
  };

  const handleLinkFile = (url: any) => {
    return URL_API_FILE_ATTACHMENT + url;
  };

  useEffect(() => {
    if (dataUploadFile) {
      const extension: any =
        (dataUploadFile?.data?.dataUpdate?.attachment).split(".")[1];
      const typeListImage = ["png", "jpeg", "jpg", "webp"];
      if (typeListImage.includes(extension)) {
        editorRef?.current?.insertContent(
          `<img src="${handleLinkFile(
            dataUploadFile?.data?.dataUpdate?.attachment
          )}">`
        );
        handleChange(keyword, editorRef?.current?.getContent());
      } else {
        editorRef?.current?.insertContent(
          `<a  href="${handleLinkFile(
            dataUploadFile?.data?.dataUpdate?.attachment
          )}" style="background:#091e4214; padding:5px; border-radius:5px; font-weight:700">📁 ${getNameFileUpload(
            dataUploadFile?.data?.dataUpdate?.attachment
          )}</a> &nbsp;`
        );
        handleChange(keyword, editorRef?.current?.getContent());
      }
    }
  }, [dataUploadFile]);

  const handleOnDrop = useCallback(
    (e: any) => {
      if (canDrop) {
        handleUploadFile(e?.dataTransfer?.files[0]);
      }

      if (onEdit) {
        handleUploadAttacmentLog(e?.dataTransfer?.files[0]);
      }
    },
    [handleUploadFile, handleUploadAttacmentLog]
  );

  const handlePasteImage = useCallback(
    (e: any) => {
      if (e.clipboardData?.files[0] && canDrop) {
        handleUploadFile(e?.clipboardData?.files[0]);
      }
      if (e.clipboardData?.files[0] && onEdit) {
        e.preventDefault();
        handleUploadAttacmentLog(e?.clipboardData?.files[0]);
      }
    },
    [handleUploadFile, handleUploadAttacmentLog]
  );

  const removeImage = (id: any, link: any, type: any) => {
    setListFile(listFile.filter((item: any) => item?.id !== id));
    if (type === "image") {
      editorRef?.current?.setContent(
        editorRef?.current?.getContent().replace(`<img src="${link}">`, "")
      );
    } else {
      editorRef?.current?.setContent(
        editorRef?.current
          ?.getContent()
          .replace(
            `<a href='#' style="background: #091e4214; padding: 5px; border-radius: 5px; font-weight: bold;">📁 ${getNameFileUpload(
              link
            )}</=>`,
            ""
          )
      );
    }

    const fileAfterDelete = file.filter((item: any) => item?.id !== id);
    const dataToUploadFile = fileAfterDelete.map(function (obj: any) {
      return obj.fileName;
    });

    setFile([...dataToUploadFile]);
    setDataForm({ ...dataForm, ["attachment"]: dataToUploadFile });
  };

  const handleDragOver = useCallback((e: any) => {
    e.preventDefault();
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
        onInit={(evt, editor: any) => (editorRef.current = editor)}
        init={{
          height: heightScreen,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "dropfile",
          ],
          default_link_target: "_blank",
          contextmenu: "dropfile",
          extended_valid_elements:
            "a[href|target=_blank|style=color: blue; text-decoration: revert]",
          toolbar:
            `bold italic forecolor ${
              onEdit || canDrop ? "customLinkButton" : ""
            } | alignleft aligncenter ` +
            "alignright alignjustify | bullist numlist outdent indent | ",
          content_style:
            "body { -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size:14px } img { max-width: 100%; max-height: 370px;}",
          directionality: "ltr",
          paste_data_images: true,
          init_instance_callback: (editor) => {
            editor.setContent(value);
          },
          setup: function (editor) {
            editor.on("Drop", function (e) {
              if (
                !e?.dataTransfer?.files[0]?.type?.startsWith("image/") &&
                canDrop
              ) {
                e.preventDefault();
              }

              if (onEdit) {
                e.preventDefault();
              }
            });

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
                      onEdit
                        ? handleUploadAttacmentLog(file)
                        : handleUploadFile(file);
                    };
                  }
                };
                input.click();
              },
            });
          },
        }}
      />
      <div className={styles["real"]}>
        <div
          className={openPopup ? styles["popup"] : styles["none"]}
          style={{ left: 300 }}
        >
          <div className={styles["title"]}>Mention</div>
          <Button className={styles["close-btn"]} onClick={handleClose}>
            <CloseIcon />
          </Button>
          <InputSearchReal handleSearch={searchUser} />
          <div className={styles["body"]}>
            {dataUserList?.items?.map((item: any) => (
              <>
                <ListItem button>
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
                            item.profile.last_name +
                              " " +
                              item.profile.first_name}
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
      {textFail && <div className={styles["text-fails"]}>{textFail}</div>}
      {listFile?.map((pic: any, index: any) => (
        <div
          className={styles["img-preview"]}
          onClick={(e: any) => removeImage(pic?.id, pic.linkImg, pic.type)}
          key={pic?.id}
        >
          <p>{pic.name}</p>
          <img src={pic.type === "image" ? pic.linkImg : fileBackground.src} />
          <div className={styles["img-hover"]}>Click here to delete</div>
        </div>
      ))}
      <div className="clear"></div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  comment: state?.comment,
});

const mapDispatchToProps = {
  searchUser,
  uploadFileRaw,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(InputTiny);
