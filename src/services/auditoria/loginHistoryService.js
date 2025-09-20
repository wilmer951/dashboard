import endpoints from "@/services/api/endpoints";
import  { useAuthStore }  from "@/stores/auth/authStore";



function buildResponse(ok, mensaje, data = null, errors = null) {
  return { status: ok, mensaje, data, errors };
}


export async function listHistoryLogin(page, perPage){

  const token = useAuthStore().jwtToken;

  console.log(page,perPage)
    try {
      console.log("entro al servicio ")
      const response = await fetch(endpoints.AuditorView.list(page,perPage) , {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
            console.log("el estatus es ",response.status);
        return buildResponse(false, "Error al obtener los usuarios");
      }
  
      const data = await response.json();

      console.log("historial de login desde servicio", data);
  
      const mapped = data.data.map(user => ({
        id: user.id,
        username: user.user.username,
        ip_address:user.ip_address,
        logged_in_at:user.logged_in_at,
        user_agent:user.user_agent,
      }));
   
      return buildResponse(true, "Usuarios obtenidos correctamente",{ data: mapped, pagination: data.pagination } );
  
    } catch (error) {
      console.error(error);
      return buildResponse(false, "Error inesperado en la solicitud", null, error);
    }



}
