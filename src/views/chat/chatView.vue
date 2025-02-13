<template>
  <div class="flex rounded-md flex-col h-full bg-gray-800">
    <!-- 채팅 리스트 -->
    <div
      ref="chatList"
      class="flex-1 grow-4 overflow-y-auto p-6 text-gray-300 space-y-4"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
      >
        {{ "(11.11)" }}  {{ msg }}
      </div> <!-- 실제 채팅 내용이 들어갈 부분 -->
    </div>

    <!-- 메시지 입력 영역 (고정된 하단) -->
    <div class="flex grow-1 justify-between items-end space-x-3 p-4 bg-gray-800 border-t border-gray-700">
      <input
        id="chat"
        v-model="message"
        rows="1"
        class="flex-1 block p-3 text-sm text-gray-900 bg-gray-700 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="메시지를 입력하세요..."
        @keydown.enter="sendMessage"
      />

      <div class="flex items-center space-x-3">
        <!-- 전송 버튼 -->
        <button
          type="submit"
          class="p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          @click="sendMessage"
        >
          <svg
            class="w-5 h-5 rotate-90 rtl:-rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

// 메시지 상태를 관리하는 변수
const message = ref('');
const messages = ref<string[]>([
  'tlqkf1',
]);

// 채팅 리스트 끝으로 스크롤을 내리는 함수
const scrollToBottom = () => {
  const chatList = document.querySelector('.flex-1') as HTMLElement;
  chatList.scrollTop = chatList.scrollHeight;
};

// 메시지를 보내는 함수
const sendMessage = () => {
  if (!message.value.trim()) {
    alert('메시지를 입력해주세요!');
    return;
  }
  // 새 메시지를 배열에 추가
  messages.value.push(message.value);
  message.value = ''; // 입력창 초기화
  nextTick(() => {
    scrollToBottom(); // 새로운 메시지를 추가한 후 스크롤을 맨 아래로
  });
};

// 컴포넌트가 마운트된 후 초기 스크롤 위치를 맨 아래로 설정
onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>
