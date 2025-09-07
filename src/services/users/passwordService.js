import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";
console.log("SERVICIO USERS CARGADO ✅");



export async function resetPassword(userData) {
  const token = useAuthStore().jwtToken;

    console.log("servicio datos a crear ",userData)

  const response = await fetch(endpoints.base + "users/api_resetPasswrod.php", {
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
