import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";

console.log("SERVICIO USERS CARGADO ✅");




// services/userService.js
function mapUserDataToPayload(userData) {
  return {
    id: userData.id,
    usuario: userData.usuario,
    nombres: userData.nombres,
    email: userData.email,
    perfil: userData.perfil,
    rol: userData.rol,
    password: userData.password,
    confirmar_password: userData.confirmarContrasena,
    status: userData.estado
  };
}











export async function listUsers() {
  const token = useAuthStore().jwtToken;
  
  const response = await fetch(endpoints.users.list, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) throw new Error('Error al obtener los usuarios');

  const data = await response.json();

  return data.map(user => ({
    id: user.id,
    username: user.username,
    name: user.name,
    lastLogin: user.last_login,
    estado: user.status,
    perfil: user.profile_id,
    perfilNombre: user.profile.name,
    // Esta es la parte clave: mapear y unir los nombres de los roles
    role: user.roles.map(role => role.id).join(', '),
    rolename: user.roles.map(role => role.name).join(', '),
    email: user.email


}));

}












export async function createUser(userData) {
  const token = useAuthStore().jwtToken;

  const payload = mapUserDataToPayload(userData)

  console.log("servicio datos a crear ",payload)


   try {
    const response = await fetch(endpoints.users.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // <-- importante para recibir JSON de Laravel
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Si es un error de validación (422), Laravel envía un JSON con los errores.
      if (response.status === 422) {
        const data = await response.json();
        // 💡 Añadimos este log para inspeccionar la respuesta completa de Laravel
        console.log('🔍 Respuesta de validación (422) del backend:', data);

        return {
          status: false,
        mensaje: 'Los datos enviados no son válidos',
        errors: data
        };
      }
      // Para otros errores (ej. 500), el cuerpo puede ser HTML. Lo leemos como texto.
      const errorText = await response.text();
      console.error('❌ Error del servidor (no JSON):', errorText);
      throw new Error('Error del servidor. Revisa la consola del navegador para más detalles.');
    }

    // Si la respuesta es OK (2xx), procesamos el JSON.
    const data = await response.json();
    return {
      status: true,
      mensaje: 'Usuario creado correctamente',
      data: data,
    };
  } catch (error) {
        // Error de red, JSON inválido, etc.
        console.error('❌ Error inesperado al crear usuario:', error);
        return {
          status: false,
          mensaje: 'Error inesperado en la solicitud',
        };
      }
}









export async function updateUser(userData) {
  const token = useAuthStore().jwtToken;


  console.log("servicio datos a actualizar ",userData)

  const payload = mapUserDataToPayload(userData)
  




  const response = await fetch(endpoints.users.update(userData.id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Error al actualizar usuario");

  return await response.json();
}




export async function deleteUser(userData) {
  const token = useAuthStore().jwtToken;

  console.log("servicio datos a eliminar "+userData.id)

  

  const response = await fetch(endpoints.users.delete(userData.id), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    
  });

  if (!response.ok) throw new Error("Error al eliminar usuario");

  return await response.json();
}







export async function resetPassword(userData) {
  const token = useAuthStore().jwtToken;

    console.log("Servicio resetar password ",userData,"usuario",userData.id)
   const payload = mapUserDataToPayload(userData)

  const response = await fetch(endpoints.users.resetPassword(userData.id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Error al actualizar usuario");

  return await response.json();
}
