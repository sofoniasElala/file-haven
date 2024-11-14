import { FileModel, FolderModel } from "../../types/global";
import optionsIcon from '/ellipsis-vertical-solid-2.svg';
import folderIcon from '/folder-solid.svg';
import pdfIcon from '/file-pdf-solid.svg';
import imageIcon from '/file-image-solid.svg';
import wordIcon from '/file-word-solid.svg';
import openIcon from '/arrow-up-right.svg';
import { useLocation, useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import { formatBytes } from "../utils";
import '../styles/FileFolderList.css';
import { formatDateTime } from "../utils";

export default function FileFolderList({foldersAndFiles, fileOrFolder, clickedElementRef, setFileOrFolder, setRefresh}: {fileOrFolder: {type: string, name: string, id: number}, clickedElementRef: React.MutableRefObject<Element | null>, setFileOrFolder: React.Dispatch<React.SetStateAction<{type: string, name: string, id: number}>>, foldersAndFiles:{id: number, username: string, folders: FolderModel[], files: FileModel[]}, setRefresh: React.Dispatch<React.SetStateAction<boolean>>}){
    const navigate = useNavigate();
    const location = useLocation();
    const prev_folder = location.state?.current_folder || null;

    function handleClick(type: string, name: string, id: number, element: HTMLImageElement){
        setFileOrFolder({...fileOrFolder, name: name, id: id, type: type });
        clickedElementRef.current = element;
    }

        return (
            <>
                <div className="column-labels">
                    <div className="name-column">Name</div>
                    <div className="last-modified-column">Last modified</div>
                    <div className="file-size-column">File size</div>
                </div>
                <hr />
                {(foldersAndFiles.files.length == 0 && foldersAndFiles.folders.length == 0) ?
                    <p className="empty-folder">{"Empty folder"}</p> : 
                    <div className="column-data">
                        {foldersAndFiles.folders && foldersAndFiles.folders.map(folder => { 
                            return <>
                                    <div key={folder.id} className="folder" onClick={() => navigate(`/folders/${folder.id}`, { state: { prev_folder: prev_folder, current_folder: {id: folder.id , name: folder.name } }}) }>
                                        <div className="name">
                                            <img src={folderIcon} height='20px' alt="folder" />
                                            {folder.name}
                                            </div>
                                        <div className="last-modified">{formatDateTime(folder.updatedAt)}</div>
                                        <div className="size">{"—"}</div>
                                        <img src={optionsIcon} height='20px' alt="more action" onClick={(event) => { event.stopPropagation(); handleClick('folder', folder.name, folder.id, event.currentTarget)} }/>
                                    </div>
                                    <hr />
                                </>
                        })}
                        {foldersAndFiles.files && foldersAndFiles.files.map(file => {
                            return <>
                                    <div key={file.id} className="file">
                                        <div className="name">
                                            <img src={file.type.includes('image') ? imageIcon : file.type.includes('pdf') ? pdfIcon : wordIcon} height='20px' alt="folder" />
                                            {file.name}
                                            {(file.type.includes('image') || file.type.includes('pdf')) && <a href={`${file.storage_url}`} target="_blank" rel="noopener noreferrer"><img className="tab" src={openIcon} height='15px' alt="new tab" /></a>}
                                            </div>
                                        <div className="last-modified">{formatDateTime(file.updatedAt)}</div>
                                        <div className="size">{formatBytes(Number(file.size))}</div>
                                        <img src={optionsIcon} height='20px' alt="more action" onClick={(event) => handleClick('file', file.name, file.id, event.currentTarget)} />
                                    </div>
                                    <hr />
                                </>
                            })}
                    </div>
                 }
                <PopUp setRefresh={setRefresh} fileOrFolder={fileOrFolder} clickedElementRef={clickedElementRef} setFileOrFolder={setFileOrFolder} />
            </>
    )
}