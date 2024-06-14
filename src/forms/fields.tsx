import * as React from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Checkbox, IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';

import { styles } from '../styles';
import { COLORS, THEME } from '../constants';
import { selectMenuOptionType } from '../types';

export function PassFormField({...props}) {
    const [showPassword, setShowPassword] = React.useState(false);
    // console.log(`[PassFormField] (focused) >> ${focused}`)
    return (
        <FormField 
            {...props}
            // marginBottom={"10px"}
            placeholder="Password"
            type={showPassword? "text" : "password"}
            inputProps={{
                endAdornment: 
                    <InputAdornment position="start">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {setShowPassword(!showPassword)}}
                            style={{color: props.adornmentColor || THEME.TEXT}}
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
                style: {
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

export function SelectField({...props}) {
    let {style, className, inputStyle, options, ...rest} = props;

    return (
        <Select
            {...rest}
            style={{...style}}
            className={`${className || ""}`}
        >
            {options?.map((option: selectMenuOptionType, i: number) => {
                return (
                    <MenuItem value={option.id} key={`${option.id}`} sx={{...option.style, fontSize: THEME.FONT.PARAGRAPH}}>{option.name}</MenuItem>
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