import endpoints from "@/services/api/endpoints";
import { getToken } from "@/services/auth/authService";
console.log("SERVICIO ROLES CARGADO ✅");


export async function listRoles() {
  const token = getToken();
  
  const response = await fetch(endpoints.base+'api_roles.php', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) throw new Error('Error al obtener los roles');



  const data = await response.json();


    return { data};

}
