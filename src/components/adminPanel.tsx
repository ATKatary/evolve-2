import * as React from "react";

import { IconButton, Typography } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import "../assets/utils.css";
import { styles } from "../styles";
import { fieldType } from "../types";
import { COLORS, THEME } from "../constants";
import CustomTable from "../components/table";
import { camelize, useCustomState } from "../utils";
import { CheckBoxField, FormField, SelectField } from "../forms/fields";


function AdminPanel<T>({...props}) {
    const {style, className, rows, fields, show} = props;

    const [newRow, setNewRow] = useCustomState<T>({} as T);
    const [addRow, setAddRow] = React.useState<boolean>(false);

    const saveRow = async (id: string, data: T) => {
    }

    const createRow = async () => {
    }

    const deleteRow = async (id: string) => {
    }

    return (
        <div className={`width-100 flex align-center column justify-start ${className || ""}`} style={{...style}}>
            <div 
                className="flex justify-between align-center" 
                style={{...styles.adminHeaderStyle}}
            >
                <IconButton style={{height: 40, width: 40}} onClick={() => setAddRow(true)}>
                    <AddIcon sx={{color: COLORS.LIGHT_GRAY}}/>
                </IconButton>
                {fields?.map((field: fieldType, i: number) => 
                    <Typography style={{...field.style, fontSize: THEME.FONT.PARAGRAPH}} className="text-center" key={`field-header-${i}`}>{field.type === "total"? "No. " : ""}{field.name}</Typography>
                )}
                <Typography fontSize={12} style={{width: 90}} className="text-center">Actions</Typography>

            </div>
            {rows? 
            <>
                {addRow?
                    <AdminPanelRow 
                        editAll
                        id="newRow"
                        row={newRow}
                        fields={fields}
                        saveRow={createRow}
                        style={{width: "80%"}}
                        fieldStyle={{border: `1px solid ${THEME.ACTIVE_ACCENT}`}}
                        deleteRow={(id: string) => {setNewRow(null); setAddRow(false)}}
                    /> 
                : <></>}
                <CustomTable 
                    rows={rows || []}
                    cells={([id, row]: [string, T], i: number) => 
                        <AdminPanelRow 
                            i={i}
                            id={id}
                            key={id}
                            row={row}
                            fields={fields}
                            saveRow={saveRow}
                            deleteRow={deleteRow}
                        />
                    }
                    backgroundColor={THEME.BACKGROUND_ACCENT}
                    style={{...styles.adminTable()}}                
                />
            </>
            : <></>}
        </div>
    )
}

export default AdminPanel;

function AdminPanelRow<T>({...props}) {
    let {i, id, row, style, className, fieldStyle, deleteRow, saveRow, fields, editAll, ...rest} = props;
    
    row = row as T;
    fields = fields as fieldType[]
    const [edit, setEdit] = React.useState<boolean>(false);

    return (
        <div
            {...rest}
            style={{...style}}
            key={id || "newRow"}
            className={`flex align-center justify-between ${className || ""}`}
        >
            <Typography fontSize={THEME.FONT.PARAGRAPH} style={{width: 40, display: "flex", justifyContent: "center"}}>{typeof i === "number"? i + 1 : 0}</Typography>
            {fields?.map((field: fieldType, i: number) => 
                getField(field, {
                    disabled: !edit,
                    id: `${id}-${i}`,
                    key: `${id}-${i}`, 
                    options: field.options,
                    editAll: editAll || false,
                    value: row[camelize(field.name)],
                    inputStyle: {fontSize: 12, height: 40},
                    fieldStyle: {...fieldStyle, ...field.style},
                })
            )}
            <div>
                {editAll || edit?
                    <IconButton style={{height: 40, width: 40}} onClick={() => {setEdit(false); saveRow(id, row)}}>
                        <SaveIcon sx={{color: COLORS.LIGHT_GRAY}}/>
                    </IconButton>
                    :
                    <IconButton style={{height: 40, width: 40}} onClick={() => {setEdit(true)}}>
                        <EditIcon sx={{color: COLORS.LIGHT_GRAY}}/>
                    </IconButton>
                }
                <IconButton style={{height: 40, width: 40, marginLeft: 10}} onClick={() => {setEdit(false); deleteRow(id)}}>
                    <DeleteIcon sx={{color: THEME.ERROR}}/>
                </IconButton>
            </div>
        </div>
    )
}

function getField(field: fieldType, {...props}) {
    let {key, disabled, fieldStyle, multiple, className, options, editAll, value, ...rest} = props;
    
    switch (field.type) {
        case "text": 
            return (
                <FormField 
                    {...rest} 
                    key={key}
                    value={value}
                    variant="outlined" 
                    placeholder={field.name}
                    className={`${className || ""}`}
                    style={{...styles.formField, ...fieldStyle}}
                    disabled={editAll? false : (field.editable? disabled : true)}
                    inputStyle={{fontSize: THEME.FONT.PARAGRAPH, borderRadius: "5px"}}
                />
            )
        case "select":
            return (
                <SelectField 
                    key={key}
                    value={value}
                    options={options}
                    disabled={editAll? false : (field.editable? disabled : true)}
                    style={{...styles.formField, ...styles.adminSelect, width: 275, ...fieldStyle}}
                />
            )
        case "total":
            return (
                <div 
                    key={key}
                    style={{...styles.formField, ...fieldStyle, textAlign: "center", opacity: 0.5, border: "none"}}
                >
                    {value?.length || 0}
                </div>
            )
        case "checkbox":
            return (
                <CheckBoxField 
                    key={key}
                    checked={value} 
                    disabled={editAll? false : (field.editable? disabled : true)}
                    style={{...styles.formField, ...styles.adminSelect, ...fieldStyle, border: "none"}}
                />
            )
        default: return <></>
    }
}
