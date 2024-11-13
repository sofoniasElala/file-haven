import { useEffect, useRef, useState } from "react";
import { FolderModel, FileModel } from "../../types/global";
import { getFolder } from "../utils";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import FileFolderList from "./FileFolderList";
import sideArrowIcon from '/chevron-right-solid.svg';
import accountIcon from '/manage_account.svg';

export default function Folder(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, username: string, folders: FolderModel[], files: FileModel[]}>({id: 0, username: '', folders: [], files: [] });
    const [fileOrFolder, setFileOrFolder] = useState<{type: string, name: string, id: number}>({type: '', name: '', id: -1});
    const clickedElementRef = useRef<HTMLImageElement | null>(null); // null is required bc otherwise .current will be read only
    const [refresh, setRefresh] = useState(false); //toggle state to re-render after renames and deletes
    const [folderIdRef, parentRefresh] = useOutletContext<[React.MutableRefObject<Number | null>, boolean]>();
    const {folderId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const prev_folder = location.state.prev_folder;
    const current_folder= location.state.current_folder;

    useEffect(() => {
        async function getFoldersAndFiles(){
         const response = await getFolder(Number(folderId));
         setFoldersAndFiles(response);
        }
        getFoldersAndFiles();
        folderIdRef.current = Number(folderId)
     }, [refresh, parentRefresh, folderId])

    return (
        <>
            <nav>
                <p className="folder-name">{prev_folder?.name ? <div className="prev" >{prev_folder.name }</div> : 'HOME'}<img className="side-arrow" src={sideArrowIcon} height='15px' alt="arrow" />{current_folder?.name}</p>
                <img src={accountIcon} height='40px' alt="manage account" />
            </nav>
            <FileFolderList setRefresh={setRefresh} fileOrFolder={fileOrFolder} foldersAndFiles={foldersAndFiles} clickedElementRef={clickedElementRef} setFileOrFolder={setFileOrFolder} />
        </>
        
    )
}