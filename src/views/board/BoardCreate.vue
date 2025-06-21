<template>
  <div class="w-full">
    <form @submit.prevent="createPost" class="space-y-4">
      <div>
        <label
          for="title"
          class="block text-sm font-medium text-gray-700"
        >제목</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="제목을 입력하세요"
          class="mt-1 block w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label
          for="content"
          class="block text-sm font-medium text-gray-700"
        >내용</label>
        <textarea
          id="content"
          v-model="content"
          rows="4"
          placeholder="내용을 입력하세요"
          class="mt-1 block w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          :disabled="!isAuthenticated || isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? '작성 중...' : '작성하기' }}
        </button>
      </div>
    </form>

    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="!isAuthenticated" class="text-yellow-500 mt-2">로그인이 필요합니다.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import api from '@/api/api';

const props = defineProps<{
  boardId: string | number;
}>();

const emit = defineEmits(['post-created', 'close']);

const { isAuthenticated } = useAuth();

const title = ref('');
const content = ref('');
const error = ref<string | null>(null);
const isLoading = ref(false);

const createPost = async () => {
  if (!props.boardId || !isAuthenticated.value) return;
  error.value = null;
  isLoading.value = true;
  try {
    await api.post(`/boards/${props.boardId}/todos`, {
      title: title.value,
      content: content.value,
    });
    title.value = '';
    content.value = '';
    emit('post-created');
  } catch (err) {
    console.error('Failed to create post:', err);
    error.value = '게시글 작성에 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};
</script>
