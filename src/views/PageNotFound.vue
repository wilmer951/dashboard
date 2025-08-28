<template>
  <div class="d-flex vh-100 justify-content-center align-items-center bg-light">
    <div class="text-center">
      <h1 class="display-1 fw-bold">404</h1>
      <p class="fs-3"> <span class="text-danger">Oops!</span> Página no encontrada.</p>
      <p class="lead">
        La página que buscas no existe.
      </p>
      <router-link to="/" class="btn btn-primary">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageNotFound"
}
</script>

