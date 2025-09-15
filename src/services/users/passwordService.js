import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";

export async function resetPassword(userData) {
  const token = useAuthStore().jwtToken;

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
