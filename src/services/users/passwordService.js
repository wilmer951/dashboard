import endpoints from "@/services/api/endpoints";
import { getToken } from "@/services/auth/authService";
console.log("SERVICIO USERS CARGADO ✅");



export async function resetPassword(userData) {
  const token = getToken();

    console.log("servicio datos a crear "+userData)

  const response = await fetch(endpoints.base + "api_resetPasswrod.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Error al actualizar usuario");

  return await response.json();
}
