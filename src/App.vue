<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';
import { useBoards } from './composables/useBoards';

const {
  isAuthenticated, user, logout, initializeAuth,
} = useAuth();
const {
  boards, totalPages, currentPage, isLoading: boardsLoading, fetchBoards,
} = useBoards();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.push('/login');
};

// 로그인 상태가 변경될 때마다 갤러리 로드
watch(isAuthenticated, (newAuthState) => {
  if (newAuthState) {
    fetchBoards(1);
  }
}, { immediate: true });

onMounted(async () => {
  // 앱 시작 시 토큰이 있으면 사용자 정보 가져오기
  await initializeAuth();

  if (isAuthenticated.value) {
    fetchBoards(1);
  }
});
</script>

<template>
  <div
    v-if="isAuthenticated"
    class="flex h-screen bg-gray-900"
  >
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white flex flex-col shadow-lg">
      <div class="p-4 border-b border-gray-700">
        <h1 class="text-2xl font-bold text-white">
          LCB
        </h1>
      </div>
      <nav class="p-2 mt-4 flex-1">
        <router-link
          to="/"
          class="flex items-center py-2 px-4 rounded transition duration-200 hover:bg-gray-700 text-gray-300"
        >
          <span class="mr-2">🏠</span> Home
        </router-link>
        <!-- Dynamic Board Links -->
        <router-link
          v-for="board in boards"
          :key="board.id"
          :to="`/board/${board.id}`"
          class="flex items-center mt-2 py-2 px-4 rounded transition duration-200 hover:bg-gray-700 text-gray-300"
        >
          <span class="mr-2">📋</span> {{ board.name }}
        </router-link>
        <div
          v-if="boardsLoading"
          class="text-gray-400 p-4"
        >
          Loading boards...
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex justify-center items-center mt-4 space-x-2 text-white"
        >
          <button
            :disabled="currentPage <= 1"
            class="px-3 py-1 rounded disabled:opacity-50"
            @click="fetchBoards(currentPage - 1)"
          >
            &laquo;
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 rounded disabled:opacity-50"
            @click="fetchBoards(currentPage + 1)"
          >
            &raquo;
          </button>
        </div>
      </nav>
      <!-- User profile and logout -->
      <div class="p-4 border-t border-gray-700">
        <p class="text-sm text-gray-400">
          Logged in as
        </p>
        <p class="font-semibold">
          {{ user?.username || 'User' }}
        </p>
        <button
          class="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 p-8 bg-gray-200 text-gray-800 overflow-y-auto">
      <router-view />
    </main>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<style>
html, body {
  height: 100vh;
  background-color: #111827; /* bg-gray-900 */
  color: #f3f4f6; /* bg-gray-100 */
}
</style>
