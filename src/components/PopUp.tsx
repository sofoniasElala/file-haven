import { useRef } from "react";
import { rename, notificationPopUp, deleteFileOrFolder, downloadFile } from "../utils";
import download from "downloadjs";
import { decode } from "base64-arraybuffer";

export default function PopUp({fileOrFolder, clickedElementRef, setFileOrFolder, setRefresh}: {fileOrFolder: {type: string, name: string, id: number}, clickedElementRef: React.MutableRefObject<Element | null>, setFileOrFolder: React.Dispatch<React.SetStateAction<{type: string, name: string, id: number}>>, setRefresh: React.Dispatch<React.SetStateAction<boolean>>}){
    const rect = clickedElementRef.current?.getBoundingClientRect();
    const top = rect?.top;
    const RenameDialogRef = useRef<HTMLDialogElement | null>(null);
    const deleteDialogRef = useRef<HTMLDialogElement | null>(null);
    const popUpRef = useRef<HTMLDivElement | null>(null);
    const popUpOverlayRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    async function handleClick(type: string | null, dialog: string | null, downloadClick: boolean = false){
        if(type === 'open') {
            popUpRef.current!.style.display = "none";
            popUpOverlayRef.current!.style.display = "none";
        }
        if(downloadClick){
            const downloadApiCall = downloadFile(fileOrFolder.name);
            const apiResponse = await notificationPopUp(
                downloadApiCall,
                { pending: `Preparing file...`, success: `Download should start soon`},
              3000
            );
            const fileBlob = new Blob([decode(apiResponse.base64File)], {type: apiResponse.type})
             
            download(fileBlob, fileOrFolder.name);
    
        } else {
            if(type === 'open' && dialog === 'rename') {
            RenameDialogRef.current!.showModal();
            inputRef.current?.select();
            } else if(type === 'close' && dialog === 'rename') {
                RenameDialogRef.current!.close();
                setFileOrFolder({...fileOrFolder, id: -1});
            }
            if(type === 'open' && dialog === 'delete'){
                deleteDialogRef.current!.showModal();
            } else if(type === 'close' && dialog === 'delete') {
                deleteDialogRef.current!.close();
                setFileOrFolder({...fileOrFolder, id: -1});
            }
        }
    }

    async function handleSubmission(updateFormData: FormData, type: string){
        let updateApiCall;
        let deleteApiCall;
        if(type === 'rename') {
        const updateData: any = {
            name: updateFormData.get("re-name"),
            originalName: fileOrFolder.name
        };
         updateApiCall = rename(updateData, fileOrFolder);
         handleClick('close', 'rename');

      } else if(type === 'delete') {
         deleteApiCall = deleteFileOrFolder(fileOrFolder);
         handleClick('close', 'delete');
      }
      const apiResponse = await notificationPopUp(
        updateApiCall ? updateApiCall : deleteApiCall!,
      { pending: `${updateApiCall ?'Renaming' : 'Deleting'} ${fileOrFolder.type}...`, success: `${fileOrFolder.type} ${updateApiCall ? 'renamed.' : 'deleted'}`},
      3000
    );
    if(apiResponse.success) setRefresh((prev) => !prev); //just switches to opposite boolean to trigger re-render
    }

    return (
        <>
        <dialog ref={deleteDialogRef} className="delete-dialog" >
            <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmission(new FormData(e.currentTarget), 'delete');
            }}>
               <p>{"Are you sure you want to delete this?"}</p>
               <div className="buttons">
                    <button onClick={() => handleClick('close', 'delete')} type="button">{"No"}</button>
                    <button type="submit">{"Yes"}</button>
               </div>
            </form>
        </dialog>
        <dialog ref={RenameDialogRef} className="rename-dialog">
            <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmission(new FormData(e.currentTarget), 'rename');
            }}>
                <label htmlFor="re-name">{"Rename"}</label>
                <input key={fileOrFolder.id} ref={inputRef} autoCapitalize="on" id="re-name" name="re-name" type="text" defaultValue={fileOrFolder.name} />
                <div className="buttons">
                    <button onClick={() => handleClick('close', 'rename')} type="button" >{"Cancel"}</button>
                    <button type="submit">{"OK"}</button>
                </div>
            </form>
        </dialog>
        <div key={fileOrFolder.id} id="overlay" ref={popUpOverlayRef} className="overlay" style={{display: fileOrFolder.id < 0 ? "none" : "block"}} onClick={() => setFileOrFolder({...fileOrFolder, id: -1})}></div>
            <div key={fileOrFolder.id + 1} className="pop-up" ref={popUpRef} style={{ display: fileOrFolder.id < 0 ? "none" : "block", top: `${top! + 90}px` }}>
                <div className="rename" onClick={() => handleClick('open', 'rename')}>{"Rename"}</div>
                {fileOrFolder.type === 'file' && <div className="download" onClick={() => handleClick('open', null, true)}>{"Download"}</div>}
                <div className="delete" onClick={() => handleClick('open', 'delete')} >{"Delete"}</div>
        </div>
        </>
    )
}