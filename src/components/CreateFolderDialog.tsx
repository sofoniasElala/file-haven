import { useRef } from "react";
import { createFolder, notificationPopUp } from "../utils";

export default function CreateFolderDialog({folderIdRef, setParentRefresh, folderDialogRef}: {folderIdRef: React.MutableRefObject<number | null>, setParentRefresh: React.Dispatch<React.SetStateAction<boolean>>, folderDialogRef: React.MutableRefObject<HTMLDialogElement | null>,}){
    const inputRef = useRef<HTMLInputElement | null>(null);

    async function handleSubmission(CreateFolderFormData: FormData){
        folderDialogRef.current!.close();
        inputRef.current!.value = '';

        const newFolderData: any = {
            name: CreateFolderFormData.get("folderName")
        };
        const createFolderApiCall = createFolder(newFolderData, folderIdRef.current);
            const apiResponse = await notificationPopUp(
                createFolderApiCall,
            { pending: `Creating folder...`, success: `Folder created`},
            3000
            );
            if(apiResponse.success) setParentRefresh((prev) => !prev); //just switches to opposite boolean to trigger re-render app level
    }
    function handleClose(){
        folderDialogRef.current!.close();
    }
    return (
        <dialog ref={folderDialogRef}>
            <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmission(new FormData(e.currentTarget));
            }}>
                <label htmlFor="new-folder">{"New folder"}</label>
                <input ref={inputRef} autoCapitalize="on" id="new-folder" name="folderName" type="text"  />
                <div className="buttons">
                    <button onClick={handleClose} type="button" >{"Cancel"}</button>
                    <button type="submit">{"Create"}</button>
                </div>
            </form>
        </dialog>
    )
}