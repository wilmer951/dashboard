import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";

console.log("SERVICIO USERS CARGADO ✅");




export async function listUsers() {
  const token = useAuthStore().jwtToken;
  
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
  const token = useAuthStore().jwtToken;

    console.log("servicio datos a crear "+userData)

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









export async function updateUser(userData) {
  const token = useAuthStore().jwtToken;

  console.log("servicio datos a actualizar "+userData)

  const response = await fetch(endpoints.base + "api_usuarios.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Error al actualizar usuario");

  return await response.json();
}




export async function deleteUser(userData) {
  const token = useAuthStore().jwtToken;

  console.log("servicio datos a eliminar "+userData.id)

  const response = await fetch(endpoints.base + "api_usuarios.php", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Error al eliminar usuario");

  return await response.json();
}
