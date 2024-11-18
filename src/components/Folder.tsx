import { useEffect, useRef, useState } from "react";
import { FolderModel, FileModel, SortByData } from "../../types/global";
import { getFolder, notificationPopUp } from "../utils";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FileFolderList from "./FileFolderList";
import sideArrowIcon from '/chevron-right-solid.svg';
import accountIcon from '/manage_account.svg';
import AccountPopUp from "./AccountPopUp";
import Tooltip from "@mui/material/Tooltip";

export default function Folder(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, parentFolderName: string | null, folder_id: number | null, name: string, folders: FolderModel[], files: FileModel[]}>({id: 0, name: '', parentFolderName:null, folder_id: null, folders: [], files: [] });
    const [fileOrFolder, setFileOrFolder] = useState<{type: string, name: string, id: number}>({type: '', name: '', id: -1});
    const clickedElementRef = useRef<HTMLImageElement | null>(null); // null is required bc otherwise .current will be read only
    const [refresh, setRefresh] = useState(false); //toggle state to re-render after renames and deletes
    const [folderIdRef, parentRefresh] = useOutletContext<[React.MutableRefObject<Number | null>, boolean]>();
    const {folderId} = useParams();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false); //account management pop up
    const [sortBy, setSortBy] = useState<SortByData>({sortByUpdatedAt: 'desc', sortByName: undefined});

    useEffect(() => {
        async function getFoldersAndFiles(){
         const getFolderApiCall = getFolder(Number(folderId), sortBy);
         const response = await notificationPopUp(
            getFolderApiCall,
        { pending: `Loading folder...`, success: `Folder loaded`},
        2000
        );
         setFoldersAndFiles(response);
         document.title = `${response.name} - File Haven`
        }
        getFoldersAndFiles();
        folderIdRef.current = Number(folderId);
     }, [folderId])

     useEffect(()=> { //does not show 'loading folder'... toast on reload/refresh
        async function getFoldersAndFilesOnReload(){
            const response = await getFolder(Number(folderId), sortBy);
            setFoldersAndFiles(response);
        }
        if(foldersAndFiles.id > 0) {
            getFoldersAndFilesOnReload();
            folderIdRef.current = Number(folderId);
        }
     }, [refresh, parentRefresh, sortBy])

    return (
        <>
            <nav>
                <div className="folder-name">{foldersAndFiles.parentFolderName ?  <Tooltip title={`go to ${foldersAndFiles.parentFolderName}`}><div className="prev" onClick={() => navigate(`/folders/${foldersAndFiles.folder_id}`)} >{foldersAndFiles.parentFolderName }</div></Tooltip> : 'HOME'}<img className="side-arrow" src={sideArrowIcon} height='15px' alt="arrow" />{foldersAndFiles.name}</div>
                <Tooltip title="manage account"><img src={accountIcon} height='40px' alt="manage account" onClick={() => setOpen((prev) => !prev)}/></Tooltip>
                <AccountPopUp open={open} setOpen={setOpen} />
            </nav>
            <FileFolderList setSortBy={setSortBy} sortBy={sortBy} setRefresh={setRefresh} fileOrFolder={fileOrFolder} foldersAndFiles={foldersAndFiles} clickedElementRef={clickedElementRef} setFileOrFolder={setFileOrFolder} />
        </>
        
    )
}