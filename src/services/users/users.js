import endpoints from "@/services/api/endpoints";
import { getToken } from "@/services/auth/authService";
console.log("SERVICIO USERS CARGADO ✅");


export async function listusers() {
  const token = getToken();
  
  const response = await fetch(endpoints.base+'api_usuarios.php', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) throw new Error('Error al obtener los usuarios');

  const data = await response.json();

  return data.map(({ id, usuario, nombres, nom_rol, ult_login, estado,id_rol,id_perfil }) => ({
    id,
    username: usuario,
    name: nombres,
    role: nom_rol,
    lastLogin: ult_login,
    estado,
    id_rol:id_rol,
    id_perfil:id_perfil
  }));

}



export async function createUser(userData) {
  const token = getToken();

  const response = await fetch(endpoints.base + "api_usuarios.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Error al crear usuario");

  return await response.json();
}