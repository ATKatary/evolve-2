import * as React from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS, THEME } from "../constants";

const Editor = ({...props}) => {
    const {style, data, onChange, editorBlock, edit, content} = props;

    const ref = React.useRef();
    const [localData, setLocalData] = React.useState();

    //Initialize editorjs
    React.useEffect(() => {
        //Initialize editorjs if we don't have a reference
        if (ref.current?.destroy) {
            // console.log(`[Editor] >> destroying editor ${editorBlock}`)
            ref.current.destroy();
        }
        const editor = new EditorJS({
            holder: editorBlock,

            data: data,
            readOnly: !edit,
            autofocus: true,
            tools: EDITOR_JS_TOOLS,
            async onChange(api, event) {
                if (!this.readOnly) {
                    const data = await api.saver.save();
                    // console.log("[Editor][onChange] (data) >>", data);
                    // onChange({data});
                    if (data) setLocalData(data)
                }
            },
        });

        // editor.isReady.then(() => console.log(console.log(`[Editor] >> created editor ${editorBlock}`)))
        ref.current = editor;
        
        
        // Add a return function to handle cleanup
        return () => {
            if (ref.current && ref.current?.destroy) {
                // console.log(`[Editor] >> destroying editor ${editorBlock}`)
                ref.current?.destroy();
            }
        };
    }, [edit]);

    React.useEffect(() => {
        if (localData) onChange({...content, data: localData})
    }, [localData])
    return <div id={editorBlock} className="width-100" style={{marginTop: edit? 0 : -30, border: edit? `0.5px solid ${THEME.BACKGROUND_ACCENT_2}` : "none", ...style}}/>;
};

export default React.memo(Editor);