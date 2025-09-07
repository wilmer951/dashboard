import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";
console.log("SERVICIO PERFILES CARGADO ✅");


export async function listPerfiles() {
  const token = useAuthStore().jwtToken;
  
  const response = await fetch(endpoints.base+'users/api_perfiles.php', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) throw new Error('Error al obtener los roles');



  const data = await response.json();


    return { data};

}
