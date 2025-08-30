import endpoints from "@/services/api/endpoints";
import { getToken } from "@/services/auth/authService";

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

  return data.map(({ id, usuario, nombres, nom_rol, ult_login, estado }) => ({
    id,
    username: usuario,
    name: nombres,
    role: nom_rol,
    lastLogin: ult_login,
    estado
  }));

}