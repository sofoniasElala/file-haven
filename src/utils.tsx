export async function checkAuthStatus() {
    try {
      const response = await fetch('http://localhost:3000/auth/status', {// await fetch('https://sofonias-elala-file-haven-api.glitch.me/auth/status', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn) return data;
      } 
        return false;
    } catch (error) {
        throw {fetchError: true, error: error}; 
    }
  }