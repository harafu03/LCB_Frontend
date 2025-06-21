<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '@/api/api';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
}

interface PostsResponse {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const props = defineProps({
  boardId: {
    type: String,
    required: true,
  },
});

const posts = ref<Post[]>([]);
const error = ref<string | null>(null);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = 10;

const fetchPosts = async (boardId: string, page: number = 1) => {
  if (!boardId) return;
  error.value = null;
  isLoading.value = true;
  try {
    const response = await api.get(`/boards/${boardId}/todos`, {
      params: { page, limit },
    });
    const { data } = response;
    posts.value = data.items;
    currentPage.value = data.page;
    totalPages.value = data.totalPages;
    total.value = data.total;
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    error.value = 'Could not load posts.';
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchPosts(props.boardId, page);
  }
};

onMounted(() => {
  fetchPosts(props.boardId, 1);
});

watch(() => props.boardId, (newBoardId) => {
  fetchPosts(newBoardId, 1);
});

defineExpose({
  fetchPosts: () => fetchPosts(props.boardId, 1),
});
</script>

<template>
  <div class="board">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="text-center py-8"
    >
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">
        게시글을 불러오는 중...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-8"
    >
      <p class="text-red-500">
        {{ error }}
      </p>
      <button
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        @click="fetchPosts(boardId, 1)"
      >
        다시 시도
      </button>
    </div>

    <!-- Posts Table -->
    <div
      v-else
      class="relative overflow-x-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          게시글 목록
        </h2>
        <div class="text-sm text-gray-600">
          총 {{ total }}개의 게시글
        </div>
      </div>

      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3"
            >
              작성자
            </th>
            <th
              scope="col"
              class="px-6 py-3"
            >
              제목
            </th>
            <th
              scope="col"
              class="px-6 py-3"
            >
              내용
            </th>
            <th
              scope="col"
              class="px-6 py-3"
            >
              작성일
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            class="bg-white border-b hover:bg-gray-50"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              {{ post.author.username }}
            </th>
            <td class="px-6 py-4">
              {{ post.title }}
            </td>
            <td class="px-6 py-4">
              {{ post.content }}
            </td>
            <td class="px-6 py-4">
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-if="posts.length === 0 && !isLoading"
        class="text-center py-8"
      >
        <div class="text-gray-400 text-4xl mb-4">
          📝
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          게시글이 없습니다
        </h3>
        <p class="text-gray-600">
          첫 번째 게시글을 작성해보세요!
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center mt-6 space-x-2"
      >
        <button
          :disabled="currentPage <= 1"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="changePage(currentPage - 1)"
        >
          이전
        </button>

        <div class="flex space-x-1">
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="changePage(currentPage + 1)"
        >
          다음
        </button>
      </div>

      <div class="text-center text-sm text-gray-500 mt-2">
        {{ currentPage }} / {{ totalPages }} 페이지
      </div>
    </div>
  </div>
</template>
