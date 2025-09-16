import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";

export async function listRoles() {
  const token = useAuthStore().jwtToken;
  
  const response = await fetch(endpoints.roles.list, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) throw new Error('Error al obtener los roles');

 

  const data = await response.json();
 

   return data.map(role => ({
     id_rol: role.id,
     nombre_rol: role.name
   }));

}
