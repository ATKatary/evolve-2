import * as React from "react";

import { TableContainer, TableHead, Table, TableRow, TableBody, Paper, TableCell } from "@mui/material";

import { styles } from "../styles";

function CustomTable({...props}) {
    const {header, title, rows, cells, style, ...other} = props;

    return (
        <TableContainer component={Paper} style={{backgroundColor: other.backgroundColor, boxShadow: "none", ...style}}>
        <Table sx={{ width: "100%" }}>
            {title? <TableHead>
                <TableRow>
                    <TableCell 
                        style={{
                            ...styles.customTableCell(),
                            fontSize: 24,
                            color: other.color, 
                            ...other.titleStyle
                        }}
                    >
                        {title}
                    </TableCell>
                </TableRow>
            </TableHead> : <></>}
            {header? <TableHead>
                <TableRow>
                    <TableCell 
                        style={{
                            ...styles.customTableCell(), 
                            padding: "10px 0",
                            ...other.headerStyle
                        }}
                    >
                        {header}
                    </TableCell>
                </TableRow>
            </TableHead> : <></>}
            <TableBody>
            {rows.map((row: any, i: number) => (
                <TableRow
                    onClick={other.onRowClick} 
                    key={`row-${i}-${row.name}`}
                    className={other.rowClassName}
                    sx={{'&:last-child td, &:last-child th': { border: 0 }, color: other.color}}
                >
                    <TableCell style={{...styles.customTableCell() as React.CSSProperties}}>{cells(row, i)}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    )
}

export default CustomTable;
