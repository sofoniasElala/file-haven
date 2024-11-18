import { getHomePage, notificationPopUp } from "../utils"
import { useEffect, useState, useRef } from "react"
import { useOutletContext } from "react-router-dom";
import { FileModel, FolderModel, SortByData } from "../../types/global";
import FileFolderList from "./FileFolderList";
import sideArrowIcon from '/chevron-right-solid.svg';
import accountIcon from '/manage_account.svg';
import AccountPopUp from "./AccountPopUp";
import Tooltip from "@mui/material/Tooltip";

export default function HomePage(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, username: string ,name: string, folders: FolderModel[], files: FileModel[]}>({id: 0, name: '', username: '', folders: [], files: [] });
    const [fileOrFolder, setFileOrFolder] = useState<{type: string, name: string, id: number}>({type: '', name: '', id: -1});
    const clickedElementRef = useRef<HTMLImageElement | null>(null); // null is required bc otherwise .current will be read only
    const [refresh, setRefresh] = useState(false); //toggle state to re-render after renames and deletes
    const [folderIdRef, parentRefresh] = useOutletContext<[React.MutableRefObject<Number | null>, boolean]>();
    const [open, setOpen] = useState<boolean>(false); //account management pop up
    const [sortBy, setSortBy] = useState<SortByData>({sortByUpdatedAt: 'desc', sortByName: undefined});
    document.title = `Home - File Haven`;

    useEffect(() => {
       async function getFoldersAndFiles(){
        const getHomePageApiCall = getHomePage(sortBy);
        const response = await notificationPopUp(
            getHomePageApiCall,
        { pending: `Loading homepage...`, success: `Homepage loaded`},
        2000
        );
        setFoldersAndFiles(response);
       }
       getFoldersAndFiles();
       folderIdRef.current = null;
    }, [])

    useEffect(()=> { //does not show 'loading homepage'... toast on reload/refresh
        async function getFoldersAndFilesOnReload(){
            const response = await getHomePage(sortBy);
            setFoldersAndFiles(response);
        }
        if(foldersAndFiles.id > 0) {
            getFoldersAndFilesOnReload();
            folderIdRef.current = null;
        }

    }, [refresh, parentRefresh, sortBy])

    

    return (
        <>
        <nav>
            <p className="folder-name">HOME<img className="side-arrow" src={sideArrowIcon} height='15px' alt="arrow" /></p>
            <Tooltip title="manage account"><img src={accountIcon} height='40px' alt="manage account" onClick={() => setOpen((prev) => !prev)} /></Tooltip>
            <AccountPopUp open={open} setOpen={setOpen} />
        </nav>
        <FileFolderList  setSortBy={setSortBy} sortBy={sortBy} setRefresh={setRefresh} fileOrFolder={fileOrFolder} foldersAndFiles={foldersAndFiles} clickedElementRef={clickedElementRef} setFileOrFolder={setFileOrFolder} />
        </>
        
    )
}