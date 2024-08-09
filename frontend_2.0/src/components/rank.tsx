import * as React from "react";

import { arrayMoveImmutable } from "array-move";
import { Container, Draggable } from "react-smooth-dnd";

import DragHandleIcon from "@mui/icons-material/DragHandle";

import { styles } from "../styles";
import { itemType } from "../types";
import { COLORS } from "../constants";
import { StyledInput } from "../support";
import { List, ListItem, ListItemSecondaryAction, ListItemIcon } from "@mui/material";

export function Rank({...props}) {
    let {locked, edit, items, setItems, onRankChange, onInputChange, sid, isCoach, ...rest} = props;
    
    const onDrop = ({ removedIndex, addedIndex }: {removedIndex: number, addedIndex: number}) => {
        setItems((items: itemType[]) => arrayMoveImmutable(items, removedIndex, addedIndex))
    };

    React.useEffect(() => {
        if (locked) return
        if ((isCoach && !edit) || (isCoach && sid)) return
        if (onInputChange) onInputChange(items);
        if (onRankChange) onRankChange(items)
    }, [items])
    return (
        <List className="width-100" style={{padding: 0}}>
        <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop} className="width-100">
            {items?.map(({ id, text }: itemType, i: number) => (
                <Draggable key={id}>
                    <ListItem>
                        <StyledInput 
                            value={text}
                            disableTooltip
                            disabled={!edit} 
                            placeholder={`Statement ${i}`}
                            className={`${edit? "pointer" : ""}`}
                            style={{...styles.entryHeader(edit, sid && !isCoach? 1 : undefined), textAlign: "start", width: "calc(100% - 24px)", backgroundColor: COLORS.WHITE}} 
                            onChange={(value: string) => setItems(items.map((item: itemType) => item.id === id? {...item, text: value} : item))}
                        />
                        <ListItemSecondaryAction>
                            <ListItemIcon className={`drag-handle ${edit? "pointer" : ""} flex justify-end`}>
                                <DragHandleIcon />
                            </ListItemIcon>
                        </ListItemSecondaryAction>
                    </ListItem>
                </Draggable>
            ))}
        </Container>
        </List>
    );
};
