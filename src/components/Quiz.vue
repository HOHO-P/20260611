<script setup>
import { ref, computed } from 'vue';
import Question from './Question.vue';

const currentStep = ref(1);
const answers = ref({
  q1: null,
  q2: null,
  q3: null,
});

// 根據答案計算推薦的甜點
const recommendedDessert = computed(() => {
  if (answers.value.q1 === 'A' && answers.value.q2 === 'B') {
    return '瑪德蓮';
  }
  // ... 其他推薦邏輯
  return '曲奇餅乾';
});
</script>

<template>
  <div class="card quiz-container">
    <!-- 測驗進行中 -->
    <div v-if="currentStep <= 3">
      <Question
        v-if="currentStep === 1"
        v-model="answers.q1"
        question="朋友的口味偏好？"
        :options="[{ text: '偏甜', value: 'A' }, { text: '不愛太甜', value: 'B' }]"
      />
      <Question
        v-if="currentStep === 2"
        v-model="answers.q2"
        question="朋友最近的心情？"
        :options="[{ text: '壓力大', value: 'A' }, { text: '很開心', value: 'B' }]"
      />
      <Question
        v-if="currentStep === 3"
        v-model="answers.q3"
        question="你們的熟稔度？"
        :options="[{ text: '非常熟', value: 'A' }, { text: '普通朋友', value: 'B' }]"
      />
      <div class="action-bar">
        <button @click="currentStep++" class="primary-btn">下一題</button>
      </div>
    </div>

    <!-- 顯示結果 -->
    <div v-else class="result-section">
      <h2>為您的朋友推薦：{{ recommendedDessert }}！</h2>
      <p>這款甜點代表著最溫暖的心意...</p>
    </div>
  </div>
</template>

<style scoped>
.quiz-container h2 {
  color: var(--secondary-color);
  margin-bottom: 15px;
  font-weight: 500;
}

.action-bar {
  margin-top: 25px;
  text-align: right;
}

.primary-btn {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.primary-btn:hover {
  background-color: var(--secondary-color);
  color: #FFFFFF;
  box-shadow: 0 2px 10px rgba(217, 162, 155, 0.3);
}

.result-section {
  text-align: center;
  padding: 20px 0;
}
</style>