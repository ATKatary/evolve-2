import * as React from "react";
import { arrayMoveImmutable } from "array-move";
import { Container, Draggable } from "react-smooth-dnd";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon } from "@mui/material";
import { COLORS, THEME } from "../constants";
import { styles } from "../styles";
import { StyledInput } from "../support";

type itemType = {id: string, text: string}
export function Rank({...props}) {
    let {edit, data, onRankChange, onInputChange, ...rest} = props;
    
    const [items, setItems] = React.useState<itemType[]>(data);

    const onDrop = ({ removedIndex, addedIndex }: {removedIndex: number, addedIndex: number}) => {
        setItems(items => arrayMoveImmutable(items, removedIndex, addedIndex))
    };

    React.useEffect(() => {
        if (!edit) return
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
                            disabled={!edit} 
                            placeholder={`Statement ${i}`}
                            className={`${edit? "pointer" : ""}`}
                            style={{...styles.entryHeader(edit), textAlign: "start", width: "calc(100% - 24px)", backgroundColor: COLORS.WHITE}} 
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
