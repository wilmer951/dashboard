import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";

export async function listPerfiles() {
  const token = useAuthStore().jwtToken;
  
  const response = await fetch('api/profiles', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

if (!response.ok) {
        // Aquí es donde el servicio detecta el error de red/API
        // Puedes lanzar un error más específico si lo necesitas,
        // o intentar obtener un mensaje de error del cuerpo de la respuesta si la API lo devuelve.
        const errorData = await response.json(); // Intentar leer el error del cuerpo
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }




  const data = await response.json();

  return data.map(profile => ({
    id_perfil: profile.id,
    nombre_perfil: profile.name
  }));

  

     }
