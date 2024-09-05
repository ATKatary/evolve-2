import * as React from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Checkbox, IconButton, InputAdornment, LinearProgress, MenuItem, Select, TextField, Typography } from '@mui/material';

import { styles } from '../styles';
import { COLORS, THEME } from '../constants';
import { Editable } from '../support/editable';
import { selectMenuOptionType, selectFieldPropsType } from '../types/fields';

export function PassFormField({...props}) {
    const [showPassword, setShowPassword] = React.useState(false);
    // console.log(`[PassFormField] (focused) >> ${focused}`)
    return (
        <FormField 
            placeholder="Password"
            {...props}
            // marginBottom={"10px"}
            type={showPassword? "text" : "password"}
            inputProps={{
                endAdornment: 
                    <InputAdornment position="start">
                        <IconButton
                            style={{color: props.adornmentColor}}
                            aria-label="toggle password visibility"
                            onClick={() => {setShowPassword(!showPassword)}}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            }
        />
    )
}

export function FormField({...props}) {
    const {style, helperText, inputProps, inputStyle, labelStyle, InputLabelProps, ...other} = props;
    
    let focused = false;
    let color: "primary" | "success" | "warning" | "info" = "info";

    if (props.focused) focused = true;
    else if (helperText === "good") {color = "success"; props.setHelperText(""); focused = true}
    else if (helperText !== "" && helperText) {color = "warning"; focused = true}
    else focused = false;

    return (
        <TextField 
            {...other}
            focused={focused}
            style={{ ...style}} 
            helperText={helperText}
            color={color || "primary"}
            InputProps={{
                sx: {
                    padding: 0,
                    borderRadius: 0,
                    color: THEME.TEXT,
                    ...inputStyle,
                },
                ...inputProps
            }}
            onTouchEnd={other.onTouchEnd}
            InputLabelProps={{
                style: {
                    color: THEME.TEXT, 
                    ...labelStyle
                },
                ...InputLabelProps
            }}
            type ={other.type? other.type : "text"}
            variant={other.variant? other.variant : "standard"} 
            inputRef={(input) => other.focused? input && input.focus() : undefined}
        >
        </TextField>
    )
}

export function SelectField(props: selectFieldPropsType) {
    const {options, multiple, ...domProps} = props;
    const {sx, style, className, value, onChange, ...rest} = props;

    return (
        <Select
            sx={{...sx}}
            value={value}
            style={{...style}}
            onChange={onChange}
            multiple={multiple}
            className={`${className || ""}`}
        >
            {options?.map((option: selectMenuOptionType, i: number) => {
                return (
                    <MenuItem value={option.id} key={`${option.id}`} sx={{fontSize: THEME.FONT.PARAGRAPH(), ...option.style}}>{option.name}</MenuItem>
                )
            })}
        </Select>
    )
}

export function CheckBoxField({...props}) {
    let {style, className, inputStyle, options, ...rest} = props;
    
    return (
        <Checkbox 
            {...rest}
            style={{...style}}
            className={`${className || ""}`}
        />
    )
}

export function TimeField({...props}) {
    let {style, className, value, setValue, color, fontSize, ...rest} = props;

    return (
        <Editable 
            min={0}
            max={99}
            type="int"
            value={value}
            defaultValue={0}
            setValue={setValue}
            style={{...styles.title(fontSize, color), ...style}}
            {...rest}
        />
    )
}

export function ProgressField({...props}) {
    let {style, value, className, inputStyle, options, ...rest} = props;

    return (
        <div className="flex align-center justify-between" style={{width: 50, ...style}}>
            <LinearProgress 
                variant="determinate" 
                value={value*100} 
                sx={{
                    width: "calc(100% - 50px)", 
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: THEME.BACKGROUND_ACCENT_2
                    }, 
                    backgroundColor: THEME.DOMINANT
                }}
            />
            <Typography style={{fontSize: THEME.FONT.PARAGRAPH(), color: THEME.DOMINANT}}>{value*100} %</Typography>
        </div>
    )
}