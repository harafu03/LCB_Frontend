<template>
  <div class="min-h-full p-2">
    <button @click="router.push({name: 'Home'})">
      메인으로
    </button>
    <h5 class="p-2">
      {{ id.id }}
    </h5>
    <div class="flex gap-2">
      <div class="flex-1 ">
        <BoardList />
        <BoardCreate />
      </div>
      <div class="flex-3 rounded-md border-gray-500 border">
        <ChatView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import BoardList from './BoardList.vue';
import BoardCreate from './BoardCreate.vue';
import ChatView from '../chat/chatView.vue';
import router from '../../router';

const route = useRoute();
const id:any = ref('');
onMounted(() => {
  id.value = route.params;
});
</script>
