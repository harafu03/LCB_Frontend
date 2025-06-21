<script setup lang="ts">
import { onMounted } from 'vue';
import { useBoards } from '@/composables/useBoards';

const { boards, totalPages, currentPage, isLoading, error, fetchBoards } = useBoards();

onMounted(() => {
  fetchBoards(1);
});
</script>

<template>
  <div class="p-8 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">갤러리 목록</h1>
    <p class="text-gray-600 mb-8">사용 가능한 갤러리들을 확인하고 참여해보세요.</p>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600">갤러리를 불러오는 중...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button 
        @click="fetchBoards(1)" 
        class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        다시 시도
      </button>
    </div>

    <!-- Boards List -->
    <div v-else-if="boards.length > 0" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="board in boards" 
          :key="board.id"
          class="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="$router.push(`/board/${board.id}`)"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ board.name }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ board.description || '설명이 없습니다.' }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">ID: {{ board.id }}</span>
            <span class="text-indigo-600 text-sm font-medium">클릭하여 입장</span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center mt-8 space-x-2">
        <button
          :disabled="currentPage <= 1"
          @click="fetchBoards(currentPage - 1)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <span class="px-4 py-2 text-sm text-gray-700">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          :disabled="currentPage >= totalPages"
          @click="fetchBoards(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <div class="text-gray-400 text-6xl mb-4">📋</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">갤러리가 없습니다</h3>
      <p class="text-gray-600">아직 생성된 갤러리가 없습니다.</p>
    </div>
  </div>
</template>
