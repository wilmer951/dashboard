import endpoints from "@/services/api/endpoints";


export async function isTokenValid(token) {
  

      try {
        const response = await fetch('/api/check-token', {
          
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
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
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    
    

    if (response.ok && response.status === 200) {
      
      return { success: true, message: 'Inicio de sesión exitoso', data };

    } else {
      return { success: false, message: data.mensaje || 'Error al iniciar sesión' };
    }

  } catch (err) {
    console.error('Login API call failed:', err);
    return { success: false, message: 'Error en la conexión con el servidor. Inténtalo más tarde.' };
  }
}