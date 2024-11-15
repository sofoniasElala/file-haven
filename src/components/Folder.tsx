import { useEffect, useRef, useState } from "react";
import { FolderModel, FileModel, SortByData } from "../../types/global";
import { getFolder, notificationPopUp } from "../utils";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import FileFolderList from "./FileFolderList";
import sideArrowIcon from '/chevron-right-solid.svg';
import accountIcon from '/manage_account.svg';
import AccountPopUp from "./AccountPopUp";
import Tooltip from "@mui/material/Tooltip";

export default function Folder(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, username: string, folders: FolderModel[], files: FileModel[]}>({id: 0, username: '', folders: [], files: [] });
    const [fileOrFolder, setFileOrFolder] = useState<{type: string, name: string, id: number}>({type: '', name: '', id: -1});
    const clickedElementRef = useRef<HTMLImageElement | null>(null); // null is required bc otherwise .current will be read only
    const [refresh, setRefresh] = useState(false); //toggle state to re-render after renames and deletes
    const [folderIdRef, parentRefresh] = useOutletContext<[React.MutableRefObject<Number | null>, boolean]>();
    const {folderId} = useParams();
    const location = useLocation();
    const [open, setOpen] = useState<boolean>(false); //account management pop up
    const [sortBy, setSortBy] = useState<SortByData>({sortByUpdatedAt: 'desc', sortByName: undefined});
    const prev_folder = location.state.prev_folder;
    const current_folder= location.state.current_folder;

    useEffect(() => {
        async function getFoldersAndFiles(){
         const getFolderApiCall = getFolder(Number(folderId), sortBy);
         const response = await notificationPopUp(
            getFolderApiCall,
        { pending: `Loading folder...`, success: `Folder loaded`},
        2000
        );
         setFoldersAndFiles(response);
        }
        getFoldersAndFiles();
        folderIdRef.current = Number(folderId);
     }, [])

     useEffect(()=> { //does not show 'loading folder'... toast on reload/refresh
        async function getFoldersAndFilesOnReload(){
            const response = await getFolder(Number(folderId), sortBy);
            setFoldersAndFiles(response);
        }
        if(foldersAndFiles.id > 0) {
            getFoldersAndFilesOnReload();
            folderIdRef.current = Number(folderId);
        }
     }, [refresh, parentRefresh, folderId, sortBy])

    return (
        <>
            <nav>
                <div className="folder-name">{prev_folder?.name ? <div className="prev" >{prev_folder.name }</div> : 'HOME'}<img className="side-arrow" src={sideArrowIcon} height='15px' alt="arrow" />{current_folder?.name}</div>
                <Tooltip title="manage account"><img src={accountIcon} height='40px' alt="manage account" onClick={() => setOpen((prev) => !prev)}/></Tooltip>
                <AccountPopUp open={open} setOpen={setOpen} />
            </nav>
            <FileFolderList setSortBy={setSortBy} sortBy={sortBy} setRefresh={setRefresh} fileOrFolder={fileOrFolder} foldersAndFiles={foldersAndFiles} clickedElementRef={clickedElementRef} setFileOrFolder={setFileOrFolder} />
        </>
        
    )
}