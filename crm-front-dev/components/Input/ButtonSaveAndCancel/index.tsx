import { Box, Button } from "@mui/material"
import useTrans from "../../../utils/useTran";

const ButtonSaveAndCancel = (props: any) => {
  const trans = useTrans();
  const {
    onClickSave,
    onClickCancel,
  } = props;
  return (
    <Box className="flex-end">
      <Button onClick={onClickCancel}>{trans.task.cancle}</Button>
      <Button onClick={onClickSave}>{trans.task.save}</Button>
    </Box>
  )
}

export default ButtonSaveAndCancel;
