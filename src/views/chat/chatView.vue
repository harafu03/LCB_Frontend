<template>
  <div class="flex flex-col h-full bg-white text-gray-800">
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-for="(message, index) in messages" :key="index" class="flex flex-col" :class="message.isMine ? 'items-end' : 'items-start'">
        <div class="text-xs text-gray-500 mb-1">
          {{ message.author }} - {{ new Date(message.createdAt).toLocaleTimeString() }}
        </div>
        <div class="inline-block p-3 rounded-lg max-w-xs" :class="message.isMine ? 'bg-blue-500 text-white' : 'bg-gray-100'">
          <p class="text-sm">{{ message.text }}</p>
        </div>
      </div>
    </div>
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 p-2 bg-gray-100 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button @click="sendMessage" class="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/composables/useAuth';

const emit = defineEmits(['update:users']);

const props = defineProps<{
  boardId: string;
}>();

const { token, user } = useAuth();
const messages = ref<Message[]>([]);
const users = ref<string[]>([]);
const newMessage = ref('');
let socket: Socket;

interface Message {
  text: string;
  isMine: boolean;
  author: string;
  createdAt: Date;
}

interface MessagePayload {
  message: string;
  author: string;
  createdAt: Date;
}

onMounted(() => {
  socket = io('http://localhost:3000', {
    auth: {
      token: token.value,
    },
  });

  socket.on('connect', () => {
    console.log(`Socket connected with id: ${socket.id}`);
    // On connection, join the room for the current board
    if (props.boardId) {
      socket.emit('joinRoom', props.boardId);
      console.log(`Joined room on connect: ${props.boardId}`);
    }
  });

  socket.on('newMessage', (payload: MessagePayload) => {
    console.log('Received message payload:', payload);
    const isMine = payload.author === user.value?.username;
    messages.value.push({ text: payload.message, isMine, ...payload });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected.');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('updateUserList', (userList: string[]) => {
    users.value = userList;
    emit('update:users', userList);
  });
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});

// Watch for route changes to switch rooms
watch(() => props.boardId, (newRoomId, oldRoomId) => {
  if (socket && socket.connected && newRoomId !== oldRoomId) {
    if (oldRoomId) {
      socket.emit('leaveRoom', oldRoomId);
      console.log(`Left room: ${oldRoomId}`);
    }
    messages.value = []; // Clear messages when changing room
    socket.emit('joinRoom', newRoomId);
    console.log(`Switched to room: ${newRoomId}`);
  }
});

const sendMessage = () => {
  if (newMessage.value.trim() !== '' && socket && socket.connected) {
    const payload = {
      room: props.boardId,
      message: newMessage.value,
    };
    socket.emit('sendMessage', payload);
    newMessage.value = '';
  }
};
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
