import endpoints from "@/services/api/endpoints";

// authService.js
export function getToken() {
  return localStorage.getItem('jwt_token');
}

export function isAuthenticated() {
  return !!getToken();
}

export async function isTokenValid() {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(endpoints.base+'api_check-auth.php', {
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



export async function login(usuario, password) {
  const loginData = { usuario, password };

  try {
    const response = await fetch(endpoints.base+'api_login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (response.ok && data.estado) {
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('id_rol', data.rol);
      return { success: true, message: 'Inicio de sesión exitoso', data };

    } else {
      return { success: false, message: data.mensaje || 'Error al iniciar sesión' };
    }

  } catch (err) {
    console.error('Login API call failed:', err);
    return { success: false, message: 'Error en la conexión con el servidor. Inténtalo más tarde.' };
  }
}