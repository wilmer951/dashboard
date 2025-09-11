import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";
console.log("SERVICIO ROLES CARGADO ✅");


export async function listRoles() {
  const token = useAuthStore().jwtToken;
  
  const response = await fetch('/api/roles', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) throw new Error('Error al obtener los roles');

 console.log("Respuesta de la API de roles, status:", response);

  const data = await response.json();
 console.log("Respuesta de la API de roles:", data);

   return data.map(role => ({
     id_rol: role.id,
     nombre_rol: role.name
   }));

}
