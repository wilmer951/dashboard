import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";
console.log("SERVICIO PERFILES CARGADO ✅");


export async function listPerfiles() {
  const token = useAuthStore().jwtToken;
  
  const response = await fetch('api/positions', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) throw new Error('Error al obtener los perfiles');



  const data = await response.json();


    return data.map(profile => ({
      id_perfil: profile.id,
      nombre_perfil: profile.name
    }));  

  

     }

