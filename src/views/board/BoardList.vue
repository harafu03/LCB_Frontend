<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getBoard, deleteBoard } from '../../api/boardApi';

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

const boardDelete = async (id:number) => {
  try {
    await deleteBoard(id); // ✅ Promise 해결 (비동기 응답 대기)
  } catch (error) {
    console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
  }
};

onMounted(() => {
  fetchBoards();
});
</script>
<template>
  <div class="board ">
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th
              scope="col"
              class="px-6 py-3"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3"
            >
              Title
            </th>
            <th
              scope="col"
              class="px-6 py-3"
            >
              Content
            </th>
            <th
              scope="col"
              class="px-6 py-3"
            >
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="board in boards"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ board['id'] }}
            </th>
            <td class="px-6 py-4">
              {{ board['title'] }}
            </td>
            <td class="px-6 py-4">
              {{ board['content'] }}
            </td>
            <td class="h-full">
              <div class="flex items-center h-full">
                <button
                  class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 ml-6 py-1.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  @click="boardDelete(board['id'])"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
