import endpoints from "@/services/api/endpoints";
import  { useAuthStore }  from "@/stores/auth/authStore";




function buildResponse(ok, mensaje, data = null, errors = null) {
  return { status: ok, mensaje, data, errors };
}


// 🔹 Función para mapear datos al formato esperado por el backend
function mapFilterData(filterData) {
  // Asegurarte de que rol siempre sea un array 
  // de números


  return {
    tipofile: filterData.tipofile,
    entity: filterData.entity,
    datestar: filterData.datestart,
    dateend: filterData.dateend,
    estado: filterData.estado,
    
  };
}



export async function generatorReport(filterData) {
  const token = useAuthStore().jwtToken;
  const payload = mapFilterData(filterData);

  try {
    const response = await fetch(endpoints.reports.list(payload.entity, payload.tipofile,payload.estado,payload.datestar,payload.dateend), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // Esto puede ayudarte si usas CORS correctamente en el backend
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    if (!response.ok) {
      return buildResponse(false, "Error al obtener el archivo");
    }

    // Leer el blob (archivo binario)
    const blob = await response.blob();

    // Crear URL del archivo
    const url = window.URL.createObjectURL(blob);

    // Obtener nombre del archivo si está disponible
    const disposition = response.headers.get("Content-Disposition");
    let filename = "reporte.xlsx";
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].split(";")[0].replace(/"/g, '');
    }

    // Crear enlace y simular clic para descargar
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    // Limpieza
    link.remove();
    window.URL.revokeObjectURL(url);

    return buildResponse(true, "Archivo descargado correctamente");

  } catch (error) {
    console.error(error);
    return buildResponse(false, "Error inesperado en la solicitud", null, error);
  }
}
