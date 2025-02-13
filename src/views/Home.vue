<script setup lang="ts">
import router from '../router';
</script>
<template>
 시발 홈
 <button @click="router.push({name: 'Board'})">게시판</button>
</template>