import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React from "react";
import { IconCirclePlus } from "@tabler/icons";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";

const listColors = [
  "103,117,124",
  "255,92,108",
  "32,174,227",
  "255,144,65",
  "205,220,57",
  "36,210,181",
];
const DraggableElement = ({ prefix, elements, indexKey }: any) => (
  <div className={styles['DroppableStyles']} style={{ borderTopColor: listColors[indexKey] }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: `rgba(${listColors[indexKey]}, 0.4)`, borderRadius: "4px", marginBottom: "10px"}}>
      <div className={styles['column-header']}>{prefix}</div>
      <IconCirclePlus
        stroke={1.5}
        size="1.5rem"
        style={{ margin: "0.5rem 0.5rem 0 0.5rem" }}
      />
    </Box>
    <Droppable droppableId={`${prefix}`}>
      {(provided: any) => (
        <div {...provided?.droppableProps} ref={provided?.innerRef} className={styles['column-body']}>
          {elements.map((item: any, index: number) => (
            <ListItem key={item?.id} item={item} index={item?.id} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default DraggableElement;
