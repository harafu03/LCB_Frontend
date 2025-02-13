<script setup lang="ts">
import { getBoard } from '../../api/boardApi';
import { ref, onMounted } from 'vue';

const boards = ref([]); // 초기값을 빈 배열로 설정

// 데이터를 가져오는 함수
const fetchBoards = async () => {
  try {
    const data = await getBoard(); // ✅ Promise 해결 (비동기 응답 대기)
    boards.value = data;
  } catch (error) {
    console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
  }
};

onMounted(() => {
  fetchBoards()
});
</script>
<template>
  <div class="board">
    <h5>왜 안 나옴?</h5>
    <div v-for="board in boards">
      {{ board }}
    </div>
  </div>
</template>