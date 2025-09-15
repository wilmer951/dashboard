import endpoints from "@/services/api/endpoints";
import { useAuthStore } from "@/stores/auth/authStore";

// 🔹 Función para mapear datos al formato esperado por el backend
function mapUserDataToPayload(userData) {
  return {
    id: userData.id,
    usuario: userData.usuario,
    nombres: userData.nombres,
    email: userData.email,
    perfil: userData.perfil,
    rol: userData.rol,
    password: userData.password,
    confirmar_password: userData.confirmarContrasena,
    status: userData.estado,
  };
}

// 🔹 Helper de respuesta estándar
function buildResponse(ok, mensaje, data = null, errors = null) {
  return { status: ok, mensaje, data, errors };
}

/* ======================
   LISTAR USUARIOS
====================== */
export async function listUsers() {
  const token = useAuthStore().jwtToken;

  try {
    const response = await fetch(endpoints.users.list, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
          console.log("el estatus es ",response.status);
      return buildResponse(false, "Error al obtener los usuarios");
    }

    const data = await response.json();

    const mapped = data.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      lastLogin: user.last_login,
      estado: user.status,
      perfil: user.profile_id,
      perfilNombre: user.profile?.name,
      roleIds: user.roles.map(role => role.id).join(', '),
      roleNames:  user.roles.map(role => role.name).join(', '),
      email: user.email,
      
    }));
 
    return buildResponse(true, "Usuarios obtenidos correctamente", mapped);

  } catch (error) {
    console.error(error);
    return buildResponse(false, "Error inesperado en la solicitud", null, error);
  }
}

/* ======================
   CREAR USUARIO
====================== */
export async function createUser(userData) {
  const token = useAuthStore().jwtToken;
  const payload = mapUserDataToPayload(userData);

  try {
    const response = await fetch(endpoints.users.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 422) {
      const data = await response.json();
      return buildResponse(false, "Los datos enviados no son válidos", null, data.errors || data);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error del servidor:", errorText);
      return buildResponse(false, "Error en la creación del usuario", null, errorText);
    }

    const data = await response.json();
    return buildResponse(true, "Usuario creado correctamente", data);

  } catch (error) {
    console.error(error);
    return buildResponse(false, "Error inesperado en la solicitud", null, error);
  }
}

/* ======================
   ACTUALIZAR USUARIO
====================== */
export async function updateUser(userData) {
  const token = useAuthStore().jwtToken;
  const payload = mapUserDataToPayload(userData);

  try {
    const response = await fetch(endpoints.users.update(userData.id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 422) {
      const data = await response.json();
      return buildResponse(false, "Los datos enviados no son válidos", null, data.errors || data);
    }

    if (!response.ok) {
      return buildResponse(false, "Error al actualizar el usuario");
    }

    const data = await response.json();
    return buildResponse(true, "Usuario actualizado correctamente", data);

  } catch (error) {
    console.error(error);
    return buildResponse(false, "Error inesperado en la solicitud", null, error);
  }
}

/* ======================
   ELIMINAR USUARIO
====================== */
export async function deleteUser(userData) {
  const token = useAuthStore().jwtToken;

  try {
    const response = await fetch(endpoints.users.delete(userData.id), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return buildResponse(false, "Error al eliminar usuario");
    }

    const data = await response.json();
    return buildResponse(true, "Usuario eliminado correctamente", data);

  } catch (error) {
    console.error(error);
    return buildResponse(false, "Error inesperado en la solicitud", null, error);
  }
}

/* ======================
   RESET PASSWORD
====================== */
export async function resetPassword(userData) {
  const token = useAuthStore().jwtToken;

  const payload = {
    password: userData.password,
    confirmar_password: userData.confirmarContrasena,
  };

  try {
    const response = await fetch(endpoints.users.resetPassword(userData.id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 422) {
      const data = await response.json();
      return buildResponse(false, "Los datos enviados no son válidos", null, data.errors || data);
    }

    if (!response.ok) {
      return buildResponse(false, "Error al resetear la contraseña");
    }

    const data = await response.json();
    return buildResponse(true, "Contraseña actualizada correctamente", data);

  } catch (error) {
    console.error(error);
    return buildResponse(false, "Error inesperado en la solicitud", null, error);
  }
}
