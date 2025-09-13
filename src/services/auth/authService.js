import endpoints from "@/services/api/endpoints";


export async function isTokenValid(token) {
  

      try {
        const response = await fetch('/api/check-token', {
          
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Token validation response status:', response);
        return response.ok;
      } catch (error) {
        console.error('Error al validar token con el backend:', error);
        return false;
      }
    }



    


export function logout() {
 localStorage.clear();  
}









// services/authService.js



export async function login(username, password) {
  const loginData = { username, password };

  try {
    const response = await fetch(endpoints.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json(); 
    const token = data.original?.access_token;

    console.log('Login API response data:', data);
  


      if (!response.ok || !token) {

        return { success: false, message: data.original.message || 'Error al iniciar sesión' };
    } 

      return {
          success: true,
          message: 'Inicio de sesión exitoso',
          data: data.original // Aquí incluyes el objeto 'original' que contiene token, roles, username
        };

  } catch (err) {
    console.error('Login API call failed:', err);
    return { success: false, message: 'Error en la conexión con el servidor. Inténtalo más tarde.' };
  }
}