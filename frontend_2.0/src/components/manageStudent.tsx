import { Typography } from "@mui/material";
import { useMutation } from "@apollo/client";

import { THEME } from "../constants";
import { styles } from "../styles";
import { manageStudentPropsType } from "../types";
import { ASSIGN_STUDENT_PROGRAM } from "../mutations";
import { SelectField, ProgressField } from "../forms/fields";
import { useStudent } from "../classes/student";

function ManageStudent(props: manageStudentPropsType) {
    const {sid, student, programs, ...domProps} = props;
    const {style, className, ...rest} = domProps;
    const [assignStudentProgram] = useMutation(ASSIGN_STUDENT_PROGRAM);

    return (
        <div className={`flex align-center column ${className || ""}`} style={{width: "80%", margin: "75px 0 0 225px", ...style}}>
            {sid && student.obj?
                <>
                <Typography sx={{fontSize: THEME.FONT.HEADING(), color: THEME.DOMINANT, height: "50px"}}>{student.obj.name}</Typography>
                <Typography sx={{fontSize: THEME.FONT.SUB_HEADING(), color: THEME.BUTTON_ACCENT}}>Assigned programs</Typography>
                <SelectField 
                    multiple
                    sx={{...styles.formField()}}
                    value={student.obj.programs?.map(program => program.id) || []}
                    onChange={async (event: any) => {
                        const toAdd = event.target.value.filter((id: string) => !student.obj?.programs?.find(program => program.id === id));
                        const toRemove = student.obj?.programs?.filter(program => !event.target.value.includes(program.id)).map(program => program.id);
                        
                        if (toAdd.length) {
                            await assignStudentProgram({variables: {id: student.id, pids: toAdd, action: "add"}});
                        }
                        if (toRemove?.length) {
                            await assignStudentProgram({variables: {id: student.id, pids: toRemove, action: "remove"}});
                        } student.setState({initialized: false})
                    }}
                    style={{...styles.adminSelect() as React.CSSProperties, width: 275, margin: 7.5}}
                    options={programs.map(program => ({id: program.id as string, name: program.title}))}
                />
                
                {student.obj.programs?.map(program => {
                    return (
                        <div className="flex justify-between align-center" style={{width: "80%"}}>
                            <Typography sx={{...styles.formField(true), margin: "15px"}}>{program.title}</Typography>
                            <ProgressField style={{width: "50%"}} value={program.progress}/>
                        </div>
                    )
                })}
                </> 
                : <Typography sx={{fontSize: THEME.FONT.HEADING(), height: "50px", opacity: 0.5}}>Select student to manage</Typography>
            }
        </div>
    )
}

export default ManageStudent;