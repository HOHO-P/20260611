<script setup>
import { ref, computed } from 'vue';

// 基礎食譜 (以 4 人份為基準)
const baseRecipe = [
  { name: '低筋麵粉', amount: 100, unit: 'g' },
  { name: '砂糖', amount: 80, unit: 'g' },
  { name: '奶油', amount: 90, unit: 'g' },
  { name: '雞蛋', amount: 2, unit: '個' },
];

// 預計送禮人數，預設為 4 人
const servingSize = ref(4);

// 使用 computed 自動計算調整後的食譜
const adjustedRecipe = computed(() => {
  const ratio = servingSize.value / 4; // 計算與基準人數的比例
  return baseRecipe.map(ingredient => ({
    ...ingredient,
    // 將原份量乘以比例，並四捨五入到整數
    amount: Math.round(ingredient.amount * ratio)
  }));
});
</script>

<template>
  <div class="card calculator-container">
    <h2 class="calc-title">食材份量計算機</h2>
    
    <div class="input-group">
      <label>預計送禮人數：</label>
      <select v-model.number="servingSize" class="custom-select">
        <option v-for="n in 8" :key="n" :value="n">{{ n }} 人份</option>
      </select>
    </div>

    <h3>食材清單：</h3>
    <ul class="ingredient-list">
      <!-- 使用 v-for 渲染計算後的食材列表 -->
      <li v-for="item in adjustedRecipe" :key="item.name" class="ingredient-item">
        <span class="item-name">{{ item.name }}</span>
        <span class="item-amount">{{ item.amount }} <small>{{ item.unit }}</small></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.calc-title {
  color: var(--secondary-color);
  font-weight: 500;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.custom-select {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--primary-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 1rem;
  outline: none;
}

.ingredient-list {
  list-style-type: none;
  padding: 0;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed rgba(230, 213, 195, 0.8);
}

.ingredient-item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
}

.item-amount {
  color: var(--secondary-color);
  font-weight: bold;
  font-size: 1.1rem;
}

.item-amount small {
  font-size: 0.85rem;
  color: var(--text-color);
  font-weight: normal;
  margin-left: 4px;
}
</style>