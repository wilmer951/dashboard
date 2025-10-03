<template>

    <router-view></router-view>

</template>

<script setup>
import { useLicenseStore } from '@/stores/licenses/licenceStore';

const licenseStore = useLicenseStore();

// ✅ Solo se ejecuta una vez al montar la app
licenseStore.iniciarVerificacionPeriodica();
</script>