<template>


  <Table
    :column="columns"

  />
</template>

<script setup>

import Table from '@/components/common/Table.vue';




const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Username', field: 'username' },
  { label: 'IP Address', field: 'ip_address' },
  { label: 'Login Time', field: 'logged_in_at' },
  { label: 'User Agent', field: 'user_agent' },
];
</script>

