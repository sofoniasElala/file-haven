import {CustomFormData} from '../types/global';
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
        const data = await response.json();
        return data;
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