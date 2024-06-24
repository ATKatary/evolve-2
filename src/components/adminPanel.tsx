import * as React from "react";

import { IconButton, Typography } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import "../assets/utils.css";
import { styles } from "../styles";
import { fieldType, selectMenuOptionType } from "../types";
import { COLORS, THEME } from "../constants";
import CustomTable from "../components/table";
import { camelize, nullify, useCustomState } from "../utils";
import { CheckBoxField, FormField, SelectField } from "../forms/fields";


function AdminPanel<T>({...props}) {
    const {style, className, rows, fields, saveRow, createRow, show} = props;

    const [newRow, setNewRow] = useCustomState<T>({} as T);
    const [addRow, setAddRow] = React.useState<boolean>(false);

    const deleteRow = async (id: string) => {
    }

    return (
        <div className={`width-100 flex align-center column justify-start ${className || ""}`} style={{...style}}>
            <div 
                className="flex justify-between align-center" 
                style={{...styles.adminHeaderStyle() as React.CSSProperties}}
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
                        data={newRow}
                        fields={fields}
                        style={{width: "80%"}}
                        fieldStyle={{border: `1px solid ${THEME.ACTIVE_ACCENT}`}}
                        deleteRow={(id: string) => {setNewRow(null); setAddRow(false)}}
                        saveRow={(data: T) => {createRow(data); setNewRow({} as T); setAddRow(false)}}
                    /> 
                : <></>}
                <CustomTable 
                    rows={rows || []}
                    cells={([id, row]: [string, T], i: number) => 
                        <AdminPanelRow 
                            i={i}
                            id={id}
                            key={id}
                            data={row}
                            fields={fields}
                            deleteRow={deleteRow}
                            saveRow={(data: T) => saveRow? saveRow(id, data) : null}
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
    let {i, id, data, style, className, fieldStyle, deleteRow, saveRow, fields, editAll, ...rest} = props;
    
    data = data as T;
    fields = fields as fieldType[]
    const [row, setRow] = useCustomState<any>(data)
    const [edit, setEdit] = React.useState<boolean>(false);

    return (
        <div
            {...rest}
            style={{...style}}
            key={id || "newRow"}
            className={`flex align-center justify-between ${className || ""}`}
        >
            <Typography fontSize={THEME.FONT.PARAGRAPH} style={{width: 40, display: "flex", justifyContent: "center"}}>{typeof i === "number"? i + 1 : 0}</Typography>
            {fields?.map((field: fieldType, i: number) => {
                return getField(field, {
                    rowId: id,
                    setRow: async (data: any) => {
                        const updatedRow = row;
                        updatedRow[camelize(field.name)] = field.onChange? await field.onChange(row, data) : data;

                        setRow(updatedRow)
                    },
                    disabled: !edit,
                    id: `${id}-${i}`,
                    key: `${id}-${i}`, 
                    options: field.options,
                    editAll: editAll || false,
                    multiple: field.type === "multiSelect",
                    inputStyle: {fontSize: 12, height: 40},
                    fieldStyle: {...fieldStyle, ...field.style},
                    value: row? row[camelize(field.name)] : undefined,
                })
            })}
            <div>
                {editAll || edit?
                    <IconButton style={{height: 40, width: 40}} onClick={() => {setEdit(false); saveRow(row)}}>
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
    let {rowId, setRow, key, disabled, fieldStyle, multiple, className, options, editAll, value, ...rest} = props;
    
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
                    style={{...styles.formField(), ...fieldStyle}}
                    onChange={async (event: any) => setRow(event.target.value)}
                    disabled={editAll? false : (field.editable? disabled : true)}
                    inputStyle={{fontSize: THEME.FONT.PARAGRAPH, borderRadius: "5px"}}
                />
            )
        case "multiSelect":
        case "select":
            return (
                <SelectField 
                    key={key}
                    options={options}
                    multiple={multiple}
                    value={value? value : (multiple? [] : "")}
                    onChange={async (event: any) => setRow(event.target.value)}
                    disabled={editAll? false : (field.editable? disabled : true)}
                    style={{...styles.formField(), ...styles.adminSelect(), width: 275, ...fieldStyle}}
                />
            )
        case "total":
            return (
                <div 
                    key={key}
                    style={{...styles.formField(), ...fieldStyle, textAlign: "center", opacity: 0.5, border: "none"}}
                >
                    {value?.length || 0}
                </div>
            )
        case "checkbox":
            return (
                <CheckBoxField 
                    key={key}
                    checked={value} 
                    onChange={async (event: any) => setRow(event.target.checked)}
                    disabled={editAll? false : (field.editable? disabled : true)}
                    style={{...styles.formField(), ...styles.adminSelect(), ...fieldStyle, border: "none"}}
                />
            )
        default: return <></>
    }
}
