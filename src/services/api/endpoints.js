const BASE_URL = "/api";

export default {
  users: {
    list: `${BASE_URL}/users`,
    create: `${BASE_URL}/register`,
    update: (id) => `${BASE_URL}/users/${id}`,
    delete: (id) => `${BASE_URL}/users/${id}`,
    detail: (id) => `${BASE_URL}/users/${id}`,
    resetPassword: (id) => `${BASE_URL}/reset-password/${id}`,
  },
  auth: {
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
  },


  roles: {
    list: `${BASE_URL}/roles`,
   },

  perfiles: {
    list: `${BASE_URL}/profiles`,
   },




  AuditorView: {

    list: `${BASE_URL}/loginHistory`,




  }



};
