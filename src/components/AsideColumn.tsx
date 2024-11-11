//import { useLocation } from "react-router-dom"
import { useRef } from "react";
import { uploadFile, notificationPopUp } from "../utils";
import CreateFolderDialog from "./CreateFolderDialog";

export default function AsideColumn({folderId, setParentRefresh}: {folderId: React.MutableRefObject<number | null>, setParentRefresh: React.Dispatch<React.SetStateAction<boolean>>}){
    //const path = useLocation().pathname;
   // console.log(path) // '/' for homepage
    const FileInputRef = useRef<HTMLInputElement | null>(null);
    const folderDialogRef = useRef<HTMLDialogElement | null>(null);

    async function fileSelected(){
        const files = FileInputRef.current?.files;
        if(files && files.length > 0){
            const formData = new FormData();
            formData.append('file', files[0]);
            formData.append('folder_id', folderId.current === null ? 'null' : String(folderId.current));

            const uploadFileApiCall = uploadFile(formData);
            const apiResponse = await notificationPopUp(
                uploadFileApiCall,
            { pending: `Uploading file...`, success: `File uploaded`},
            3000
            );
            FileInputRef.current!.value = ''; //clear selected file path just in case it does not clear due to selecting same file more than once

            if(apiResponse.success) setParentRefresh((prev) => !prev); //just switches to opposite boolean to trigger re-render app level
        }
    }

    return (
        <>
            <input ref={FileInputRef} type="file" name="file" id="file-input" style={{display: "none"}} onChange={fileSelected} accept="image/*,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>
            <div className="upload-file" onClick={() => FileInputRef.current?.click()}>{"Upload File"}</div>
            <CreateFolderDialog folderId={folderId} setParentRefresh={setParentRefresh} folderDialogRef={folderDialogRef} />
            <div className="create-folder" onClick={() => folderDialogRef.current?.showModal()}>{"Create Folder"}</div>
            <div className="all-files">{"All Files"}</div>
        </>
    )
}