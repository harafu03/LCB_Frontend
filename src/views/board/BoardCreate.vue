<template>
  <div class="max-w-lg mx-auto mt-8 p-6 bg-gray-800 shadow-lg rounded-lg text-white">
    <h2 class="text-xl font-semibold text-gray-100 mb-4">
      게시판 생성
    </h2>

    <!-- 입력 필드 -->
    <div class="space-y-4">
      <div>
        <label
          for="title"
          class="block text-sm font-medium text-gray-300"
        >제목</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="제목을 입력하세요"
          class="mt-1 block w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          for="content"
          class="block text-sm font-medium text-gray-300"
        >내용</label>
        <textarea
          id="content"
          v-model="content"
          rows="4"
          placeholder="내용을 입력하세요"
          class="mt-1 block w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
        @click="createBoardFunc"
      >
        생성하기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createBoard } from '../../api/boardApi';

const title = ref('');
const content = ref('');

const createBoardFunc = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 입력해주세요!');
    return;
  }
  try {
    await createBoard({ title: title.value, content: content.value });
    alert('게시물이 성공적으로 생성되었습니다!');
    title.value = '';
    content.value = '';
  } catch (error) {
    console.error('게시판 생성 중 오류 발생:', error);
    alert('게시판 생성 실패!');
  }
};
</script>
