<script setup lang="ts">
import router from '../router';
</script>
<template>
  <button @click="router.push({name: 'Board', params: {id: 111}})">
    야구갤
  </button>
</template>
