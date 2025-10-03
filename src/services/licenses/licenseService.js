import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "@/firebase";

export async function validarLicencia() {


  try {

    const licenseKey = import.meta.env.VITE_LICENSE_KEY;
    const docRef = doc(db, "licencias", "licencia-app-001");
    const docSnap = await getDocFromServer(docRef);

    if (!docSnap.exists()) {
      return { valido: false, status: 'INVALID', error: "Licencia no encontrada" };
    }

    const data = docSnap.data();

    
    const now = new Date();
    const fechaExpiracion = data?.fechaExpiracion?.toDate?.();
    const license_key = data?.license_key;


    if (!fechaExpiracion || !(fechaExpiracion instanceof Date)) {
      
      return {
        valido: false,
        status: 'INVALID',
        datos: data,
      };
    }

    
    const licenciaValida = data.status === 'active' && now.getTime() <= fechaExpiracion.getTime() && licenseKey === license_key;

    return {
      valido: licenciaValida,
      status: licenciaValida ? 'active' : 'expired',
      datos: data,
    };

  } catch (error) {
    return {
      valido: false,
      status: 'INVALID',
      error: error.message,
    };
  }
}
