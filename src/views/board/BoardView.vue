<template>
  <div class="flex h-full gap-4">
    <!-- Board Content -->
    <div class="flex-1 flex flex-col gap-4">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Board #{{ id }}</h1>
            <p class="text-gray-600">This is the content area for the board.</p>
          </div>
          <!-- 작성 버튼 -->
          <div v-if="isAuthenticated" class="flex space-x-2">
            <button
              @click="showCreateModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <span class="mr-2">✏️</span>
              작성
            </button>
          </div>
          <div v-else class="text-center">
            <p class="text-gray-600 mb-2">게시글을 작성하려면 로그인이 필요합니다.</p>
            <router-link 
              to="/login" 
              class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인하기
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="flex-1 bg-white p-4 rounded-lg shadow">
        <BoardList :board-id="id" ref="boardListRef" />
      </div>
    </div>

    <!-- Chat & User List -->
    <div class="w-96 flex flex-col gap-4">
      <!-- Chat -->
      <div class="flex-1 bg-white rounded-lg shadow flex flex-col">
        <h2 class="text-xl font-semibold p-4 border-b">Board Chat</h2>
        <ChatView v-if="id" :board-id="id" class="flex-1" @update:users="updateUserList" />
      </div>

      <!-- User List -->
      <div class="bg-white rounded-lg shadow">
        <h3 class="text-lg font-semibold p-4 border-b">Connected Users ({{ users.length }})</h3>
        <ul class="p-4 space-y-2 max-h-48 overflow-y-auto">
          <li v-for="user in users" :key="user" class="text-gray-700">{{ user }}</li>
        </ul>
      </div>
    </div>

    <!-- Create Post Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">새 게시글 작성</h2>
          <button
            @click="showCreateModal = false"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <BoardCreate 
          :board-id="id" 
          @post-created="handlePostCreated" 
          @close="showCreateModal = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import BoardList from './BoardList.vue';
import BoardCreate from './BoardCreate.vue';
import ChatView from '../chat/chatView.vue';

const route = useRoute();
const id = computed(() => route.params.id as string);
const { isAuthenticated } = useAuth();

const boardListRef = ref<InstanceType<typeof BoardList> | null>(null);
const showCreateModal = ref(false);

const users = ref<string[]>([]);
const updateUserList = (userList: string[]) => {
  users.value = userList;
};

const handlePostCreated = () => {
  boardListRef.value?.fetchPosts();
  showCreateModal.value = false;
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
