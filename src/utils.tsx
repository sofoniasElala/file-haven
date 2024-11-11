import {CustomFormData} from '../types/global';
import { toast } from 'react-toastify';
export async function checkAuthStatus() {
    try {
      const response = await fetch('http://localhost:3000/auth/status', {// await fetch('https://sofonias-elala-file-haven-api.glitch.me/auth/status', {
        method: 'GET',
        credentials: 'include'
      });
       return await response.json();
    } catch (error) {
        throw {fetchError: true, error: error}; 
    }
  }


export async function getHomePage(){
    try {
        const response = await fetch('http://localhost:3000/', {
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
        const response = await fetch('http://localhost:3000/log-in', {
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(loginData)
        });
        const data = await response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}; 
    }
}

export async function signUpForAccount(SignUpData: CustomFormData){
    try {
        const response = await fetch('http://localhost:3000/sign-up', {
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
        const response = await fetch(`http://localhost:3000/${fileOrFolder.type}s/${fileOrFolder.id}`, {
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
        const response = await fetch (`http://localhost:3000/${fileOrFolder.type}s/${fileOrFolder.id}`, {
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
            if(data && data.success == false) throw new Error(data.message)
            else if (data.errors) throw new Error()
            else return popUpMessage.success
          }
        },
        error: {
          render({data}: any){
            let popUpMessage = data.message;
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
        const response = await fetch(`http://localhost:3000/files`, {
            method: 'POST',
            credentials: 'include',
            body: fileData
        })
        const data = response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}

export async function downloadFile(name: string){
    try {
        const response = await fetch(`http://localhost:3000/files/${name}/download`, {
            credentials: 'include'
        })
        const data = response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}

export async function createFolder(newFolderData: {name: string}, folderId: number | null){
    try{
        const response = await fetch(`http://localhost:3000/folders${folderId ? '/' + folderId : ''}`, {
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(newFolderData)
        })
        const data = response.json();
        return data;
    } catch(error) {
        throw {fetchError: true, error: error}
    }
}