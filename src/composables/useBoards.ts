import { ref, computed } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/boards';

export interface Board {
  id: number;
  name: string;
  description: string;
}

export function useBoards() {
  const boards = ref<Board[]>([]);
  const totalPages = ref(1);
  const currentPage = ref(1);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBoards(page: number = 1) {
    // 토큰이 없으면 갤러리 로드하지 않음
    const token = localStorage.getItem('token');
    if (!token) {
      boards.value = [];
      totalPages.value = 1;
      currentPage.value = 1;
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(API_URL, { params: { page, limit: 5 } }); // Fetch 5 boards per page
      boards.value = response.data.items;
      totalPages.value = Math.ceil(response.data.total / 5);
      currentPage.value = page;
    } catch (err) {
      console.error('Failed to fetch boards:', err);
      error.value = 'Failed to load boards.';
      boards.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createBoard(name: string, description: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await axios.post(API_URL, { name, description });
      // After creating, refetch the boards to update the list
      await fetchBoards();
    } catch (err) {
      console.error('Failed to create board:', err);
      error.value = 'Failed to create board.';
      throw err; // Re-throw to be caught in the component
    } finally {
      isLoading.value = false;
    }
  }

  return {
    boards,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchBoards,
    createBoard,
  };
} 