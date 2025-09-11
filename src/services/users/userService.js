import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";

console.log("SERVICIO USERS CARGADO ✅");




export async function listUsers() {
  const token = useAuthStore().jwtToken;
  
  const response = await fetch('api/users', {
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
    // Esta es la parte clave: mapear y unir los nombres de los roles
    role: user.roles.map(role => role.name).join(', '),

}));

}












export async function createUser(userData) {
  const token = useAuthStore().jwtToken;

    console.log("servicio datos a crear "+userData)

  const response = await fetch(endpoints.base + "users/api_usuarios.php", {
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

  const response = await fetch(endpoints.base + "users/api_usuarios.php", {
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

  const response = await fetch(endpoints.base + "users/api_usuarios.php", {
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
