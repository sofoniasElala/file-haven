import { FileModel, FolderModel, SortByData } from "../../types/global";
import optionsIcon from '/ellipsis-vertical-solid-2.svg';
import folderIcon from '/folder-solid.svg';
import pdfIcon from '/file-pdf-solid.svg';
import imageIcon from '/file-image-solid.svg';
import wordIcon from '/file-word-solid.svg';
import openIcon from '/arrow-up-right.svg';
import arrowDownIcon from '/arrow_downward.svg';
import arrowUpIcon from '/arrow_upward.svg';
import { useLocation, useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import { formatBytes } from "../utils";
import '../styles/FileFolderList.css';
import { formatDateTime } from "../utils";
import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';

export default function FileFolderList({foldersAndFiles, fileOrFolder, sortBy, clickedElementRef, setFileOrFolder, setRefresh, setSortBy}: {fileOrFolder: {type: string, name: string, id: number}, clickedElementRef: React.MutableRefObject<Element | null>, setFileOrFolder: React.Dispatch<React.SetStateAction<{type: string, name: string, id: number}>>, foldersAndFiles:{id: number, username: string, folders: FolderModel[], files: FileModel[]}, setRefresh: React.Dispatch<React.SetStateAction<boolean>>,  setSortBy: React.Dispatch<React.SetStateAction<SortByData>>, sortBy: SortByData}){
    const navigate = useNavigate();
    const location = useLocation();
    const [sortDirection, setSortDirection] = useState<{type: 'name' | 'lastModified', direction: 'desc' | 'asc'} | null>(null);
    const prev_folder = location.state?.current_folder || null;

    function handleClick(type: string, name: string, id: number, element: HTMLImageElement){
        setFileOrFolder({...fileOrFolder, name: name, id: id, type: type });
        clickedElementRef.current = element;
    }

    function handleSort(type: 'name' | 'lastModified'){
        let direction: 'desc' | 'asc';
        if(sortDirection?.type === type){
            if(sortDirection.direction === 'asc') direction = 'desc';
            else direction = 'asc';  
        } else {
            direction = sortDirection?.direction || 'desc'
        }
        const sort = {
            type: type,
            direction: direction
        }
        setSortDirection(sort)
        setSortBy({...sortBy,
            sortByUpdatedAt: type === 'lastModified' ? direction : undefined,
            sortByName: type === 'name' ? direction : undefined
        })
    }

        return (
            <>
                <div className="column-labels">
               <div className="name-column" onClick={() => handleSort('name')}>
                    <Tooltip title="sort by"><div> Name</div></Tooltip>
                        { (sortDirection &&  sortDirection.type === 'name') && 
                        <img src={sortDirection.direction === 'desc' ? arrowDownIcon : arrowUpIcon} height='20px' alt="sort by" />
                        }
                        </div>
                        <div className="last-modified-column" onClick={() => handleSort('lastModified')}>
                        <Tooltip title="sort by"><div>Last modified</div></Tooltip>
                        { (sortDirection &&  sortDirection.type === 'lastModified') &&
                        <img src={ sortDirection.direction === 'desc' ? arrowDownIcon : arrowUpIcon} height='20px' alt="sort by" />}
                        </div>
                    <div className="file-size-column">File size</div>
                </div>
                <hr />
                {((foldersAndFiles.files === undefined && foldersAndFiles.folders === undefined) || foldersAndFiles.files.length == 0 && foldersAndFiles.folders.length == 0) ?
                    <p className="empty-folder">Empty folder</p> : 
                    <div className="column-data">
                        {foldersAndFiles.folders && foldersAndFiles.folders.map(folder => { 
                            return <>
                                    <div key={folder.id} className="folder" onClick={() => navigate(`/folders/${folder.id}`, { state: { prev_folder: prev_folder, current_folder: {id: folder.id , name: folder.name } }}) }>
                                        <div className="name">
                                            <img src={folderIcon} height='20px' alt="folder" />
                                            {folder.name}
                                            </div>
                                        <div className="last-modified">{formatDateTime(folder.updatedAt)}</div>
                                        <div className="size">—</div>
                                        <Tooltip title="options"><img src={optionsIcon} height='20px' alt="more action" onClick={(event) => { event.stopPropagation(); handleClick('folder', folder.name, folder.id, event.currentTarget)} }/></Tooltip>
                                    </div>
                                    <hr />
                                </>
                        })}
                        {foldersAndFiles.files && foldersAndFiles.files.map(file => {
                            return <>
                                    <div key={file.id} className="file">
                                        <div className="name">
                                            <img src={file.type.includes('image') ? imageIcon : file.type.includes('pdf') ? pdfIcon : wordIcon} height='20px' alt="folder" />
                                            <div>{file.name}</div> 
                                            {(file.type.includes('image') || file.type.includes('pdf')) &&
                                             <a href={`${file.storage_url}`} target="_blank" rel="noopener noreferrer"> 
                                             <Tooltip title="open in new tab">
                                                <img className="tab" src={openIcon} height='15px' alt="new tab" />
                                             </Tooltip>
                                             </a>}
                                            </div>
                                        <div className="last-modified">{formatDateTime(file.updatedAt)}</div>
                                        <div className="size">{formatBytes(Number(file.size))}</div>
                                        <Tooltip title="options"><img src={optionsIcon} height='20px' alt="more action" onClick={(event) => handleClick('file', file.name, file.id, event.currentTarget)} /></Tooltip>
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