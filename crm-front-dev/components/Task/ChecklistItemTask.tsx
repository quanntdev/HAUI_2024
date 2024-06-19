import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import InputBase from "../Input/InputBase";

type DATA_CHECKLIST_ITEM = {
  title: string;
  checklistId: number | null;
  isDone: number | null;
}

const INIT_DATA = {
  title: "",
  checklistId: null,
  isDone: null,
}

const CheckListItem = (props: any) => {
  const {
    setDataChecklistItem,
    checklistId,
    dataCreateChecklistItem,
    dataChecklistItem,
  } = props;

  const [ formData, setFormData ] = useState<DATA_CHECKLIST_ITEM>(INIT_DATA);

  useEffect(() => {
    setFormData({
      ...INIT_DATA,
      checklistId: Number(checklistId),
    });
  }, [dataCreateChecklistItem])

  useEffect(() => {
    setFormData({
      ...INIT_DATA,
      checklistId: Number(checklistId),
    })
  }, [dataChecklistItem]);

  const handleChangeInput = (key: any, value: any) => {
    setFormData({ ...formData, [key]: value })
    setDataChecklistItem({ ...formData, [key]: value });
  }

  return (
    <Box id="checklistItem" className="arrow-icon ml-8">
      <InputBase
        keyword="title"
        handleChange={handleChangeInput}
        value={formData?.title}
        size="small"
        variant="standard"
        label="Title"
        id="standard-basic"
      />
    </Box>
  );
}

export default CheckListItem;
