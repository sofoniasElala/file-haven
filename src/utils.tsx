import {CustomFormData, SortByData} from '../types/global';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';

export function setUserLocalStorage(set: boolean, username = ''){
    if(set){
    const weekExpiration = DateTime.now().plus({days: 7});
    const data = {
        username: username,
        expires: weekExpiration
    }
    localStorage.setItem('file-haven-username', JSON.stringify(data));
    } else {
        localStorage.removeItem('file-haven-username'); 
    }
}

export async function checkAuthStatus() {
    try {
      const response = await fetch('https://www.api.sofonias-elala-file-haven.xyz/auth/status', {
        method: 'GET',
        credentials: 'include'
      });
       return await response.json();
    } catch (error) {
        throw {fetchError: true, error: error}; 
    }
  }


export async function getHomePage(sortByData: SortByData){
    try {
        const response = await fetch(`https://www.api.sofonias-elala-file-haven.xyz/?sortByUpdatedAt=${sortByData.sortByUpdatedAt}&sortByName=${sortByData.sortByName}`, {
            credentials: 'include'
        });
        const jsonData = await response.json();
        return jsonData.data;
    } catch(error) {
        throw {fetchError: true, error: error}; 
    }
}

export async function handleLogin(loginData: CustomFormData){
    try {
        const response = await fetch('https://www.api.sofonias-elala-file-haven.xyz/log-in', {
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(loginData)
        });
        const data = await response.json();
        if(response.status === 200) setUserLocalStorage(true, data.username);
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}; 
    }
}

export async function logOut(){
    try{
        const response = await fetch('https://www.api.sofonias-elala-file-haven.xyz/logout', {
            method: 'POST',
            credentials: 'include'
        })
        const data = await response.json();
        if(response.status === 200) setUserLocalStorage(false);
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}; 
    }
}

export async function deleteAccount(){
    try {
        const response = await fetch('https://www.api.sofonias-elala-file-haven.xyz/user/delete', {
            method: 'POST',
            credentials: 'include'
        })
        const data = await response.json();
        if(response.status === 200) setUserLocalStorage(false);
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}; 
    }
}

export async function signUpForAccount(SignUpData: CustomFormData){
    try {
        const response = await fetch('https://www.api.sofonias-elala-file-haven.xyz/sign-up', {
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(SignUpData)
        });
        const data = await response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}; 
    }
}

export async function rename(updateData: {name: string, originalName: string}, fileOrFolder: {type: string, id: number}){
    try {
        const response = await fetch(`https://www.api.sofonias-elala-file-haven.xyz/${fileOrFolder.type}s/${fileOrFolder.id}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(updateData)
        });
        const data = await response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}

export async function deleteFileOrFolder(fileOrFolder: {type: string, name:string, id: number}){
    try {
        const response = await fetch (`https://www.api.sofonias-elala-file-haven.xyz/${fileOrFolder.type}s/${fileOrFolder.id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({name: fileOrFolder.name})
        })
        const data = await response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}

export async function notificationPopUp(apiCall: Promise<any>, popUpMessage: {pending: string, success: string}, timeLength: number){
    return await toast.promise(apiCall, {
        pending: popUpMessage.pending,
        success: {
          render({data}){
            if(data && data.success == false) throw new Error(data.message || data.errors)
            else if (data.errors) throw new Error()
            else if(data.status == 'error') throw new Error('status')
            else return popUpMessage.success
          }
        },
        error: {
          render({data}: any){
            let popUpMessage = data.message == 'status' ? 'Folder by that name already exists' : data.message;
            if(data.error) {
            if(data.error.name === 'TypeError') popUpMessage = 'Network error. check connection and try again.'
            else if(data.error.name === 'AbortError') popUpMessage = 'The request was cancelled.'
            }
            return `${popUpMessage}`
          }
        }
      }, {
        autoClose: timeLength
      });
}

export async function uploadFile(fileData: FormData){
    try {
        const response = await fetch(`https://www.api.sofonias-elala-file-haven.xyz/files`, {
            method: 'POST',
            credentials: 'include',
            body: fileData
        })
        const data = await response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}

export async function downloadFile(name: string){
    try {
        const response = await fetch(`https://www.api.sofonias-elala-file-haven.xyz/files/${name}/download`, {
            credentials: 'include'
        })
        const data = await response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}

export async function createFolder(newFolderData: {name: string}, folderId: number | null){
    try{
        const response = await fetch(`https://www.api.sofonias-elala-file-haven.xyz/folders${folderId ? '/' + folderId : ''}`, {
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(newFolderData)
        })
        const data = await response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}

export async function getFolder(folderId: number, sortByData: SortByData){
    try {
        const response = await fetch(`https://www.api.sofonias-elala-file-haven.xyz/folders/${folderId}/?sortByUpdatedAt=${sortByData.sortByUpdatedAt}&sortByName=${sortByData.sortByName}`, {
            credentials: 'include'
        })
        const data = await response.json();
        return {...data.folder, parentFolderName: data.parentFolderName};
    } catch (error) {
        throw {fetchError: true, error: error}
    }
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024; // or 1000 for decimal units
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export function formatDateTime(dateTime: string){
    const folderDateTime = DateTime.fromISO(dateTime);
    const now = DateTime.now();
    if( folderDateTime.day == now.day && folderDateTime.month == now.month && folderDateTime.year == now.year){
        return folderDateTime.toFormat("h':'mm a")
    } else {
        return folderDateTime.toFormat("MMMM dd, yyyy")
    }
}