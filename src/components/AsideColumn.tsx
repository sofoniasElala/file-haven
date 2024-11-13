import { useRef } from "react";
import { uploadFile, notificationPopUp } from "../utils";
import CreateFolderDialog from "./CreateFolderDialog";
import { useNavigate } from "react-router-dom";
import uploadIcon from '/upload-solid.svg';
import createIcon from '/plus-solid.svg';
import houseIcon from '/house-solid.svg';

export default function AsideColumn({folderIdRef, setParentRefresh}: {folderIdRef: React.MutableRefObject<number | null>, setParentRefresh: React.Dispatch<React.SetStateAction<boolean>>}){
    const FileInputRef = useRef<HTMLInputElement | null>(null);
    const folderDialogRef = useRef<HTMLDialogElement | null>(null);
    const navigate = useNavigate();

    async function fileSelected(){
        const files = FileInputRef.current?.files;
        if(files && files.length > 0){
            const formData = new FormData();
            formData.append('file', files[0]);
            formData.append('folder_id', folderIdRef.current === null ? 'null' : String(folderIdRef.current));

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
            <div className="upload-file" onClick={() => FileInputRef.current?.click()}>
                <img src={uploadIcon} height='15px' alt="upload file" />
                {"Upload File"}
                </div>
            <CreateFolderDialog folderIdRef={folderIdRef} setParentRefresh={setParentRefresh} folderDialogRef={folderDialogRef} />
            <div className="create-folder" onClick={() => folderDialogRef.current?.showModal()}>
                <img src={createIcon} height='15px' alt="create folder" />
                {"Create Folder"}
                </div>
            <div className="home" onClick={() => navigate('/')}>
                <img src={houseIcon} height='15px' alt="home" />
                {"Home"}
                </div>
        </>
    )
}