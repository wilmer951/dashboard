import endpoints from "@/services/api/endpoints";
import  { useAuthStore }  from "@/stores/auth/authStore";



function buildResponse(ok, mensaje, data = null, errors = null) {
  return { status: ok, mensaje, data, errors };
}


export async function listHistoryLogin(){

  const token = useAuthStore().jwtToken;
    try {
      const response = await fetch(endpoints.AuditorView.list, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
            console.log("el estatus es ",response.status);
        return buildResponse(false, "Error al obtener el historial de logins");
      }
  
      const data = await response.json();
  
      const mapped = data.map(user => ({
        id: user.id,
        username: user.user.username,
        ip_address:user.ip_address,
        logged_in_at:user.logged_in_at,
        user_agent:user.user_agent,
      }));
   
      return buildResponse(true, "Historial obtenido correctamente", mapped  );
  
    } catch (error) {
      console.error(error);
      return buildResponse(false, "Error inesperado en la solicitud", null, error);
    }



}
