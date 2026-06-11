<script setup>
// 接收從父層傳來的選項值，並使其可被雙向綁定
const model = defineModel();

defineProps({
  question: String,
  options: Array
});
</script>

<template>
  <div>
    <h3 class="question-title">{{ question }}</h3>
    <div class="options-container">
      <label v-for="option in options" :key="option.value" class="option-label">
        <input type="radio" :value="option.value" v-model="model" class="radio-input" />
        <span class="option-text">{{ option.text }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.question-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 20px;
}
.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.option-label {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: var(--bg-color);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(230, 213, 195, 0.4);
}
.option-label:hover {
  background-color: #f4eee8;
  border-color: var(--primary-color);
}
.radio-input {
  margin-right: 12px;
  accent-color: var(--secondary-color);
  width: 18px;
  height: 18px;
}
.option-text {
  font-size: 1rem;
}
</style>