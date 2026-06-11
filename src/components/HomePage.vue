<script setup>
import { ref, computed } from 'vue'; // 從 vue 引入 ref 和 computed 功能

// 模擬互動數據
const oilContamination = ref(0); // 模擬蛋白霜中的油脂汙染比例 (0% to 5%)

// 使用 computed 實現「新手避坑數據提示」
const meringueSuccessRate = computed(() => {
  // 當油脂汙染大於 0.5% 時，成功率就暴跌
  if (oilContamination.value > 0.5) {
    return 15;
  }
  return 98;
});

const pitfallMessage = computed(() => {
  if (oilContamination.value > 0.5) {
    return `蛋白霜若接觸到 ${oilContamination.value}% 的油脂，打發成功率將由 98% 暴跌至 15%！請確保容器乾燥。`;
  }
  return '蛋白霜打發的關鍵在於保持容器絕對潔淨無油，成功率可達 98%！';
});

// --- 💖 友情心意份量計算機 ---

// 1. 定義「預計送禮人數」，使用 ref 將其變為響應式數據，預設為 1 人
const giftCount = ref(1);

// 2. 定義「瑪德蓮」的基礎食材清單 (1人份)
const baseMadeleineRecipe = [
  { name: '低筋麵粉', amount: 20, unit: 'g' },
  { name: '砂糖', amount: 15, unit: 'g' },
  { name: '奶油', amount: 20, unit: 'g' },
  { name: '雞蛋', amount: 15, unit: 'g' },
];

// 3. 使用「computed (計算屬性)」來自動換算食材份量
//    當 giftCount 改變時，這個函式會自動重新執行，並回傳最新的計算結果
const adjustedRecipe = computed(() => {
  // .map() 會遍歷陣列中的每一個食材，並回傳一個處理過後的新陣列
  return baseMadeleineRecipe.map(ingredient => {
    // 回傳一個新的物件，包含名稱、單位，以及換算後的新份量
    return {
      ...ingredient, // 複製食材原有的屬性 (name, unit)
      amount: ingredient.amount * giftCount.value // 將基礎份量乘以人數
    };
  });
});

// 增加人數的函式
const incrementCount = () => {
  giftCount.value++;
};

// 減少人數的函式 (並確保人數不小於 1)
const decrementCount = () => {
  if (giftCount.value > 1) {
    giftCount.value--;
  }
};
</script>

<template>
  <div>
    <!-- 1. 上方導覽列 (Navbar) -->
    <nav class="navbar">
      <div class="logo">甜點文化及傳播</div>
      <div class="nav-links">
        <router-link to="/">心意故事</router-link>
        <router-link to="/culture">甜點意義</router-link>
        <router-link to="/baking">烘焙實作</router-link>
      </div>
    </nav>

    <!-- 2. 中央主視覺區 -->
    <main class="main-content">
      <!-- 左側卡片 -->
      <div class="card left-card">
        <div class="scenario-content">
          <p class="scenario-text">朋友最近加班很累，心情低落...</p>
          <span class="scenario-suggestion">或許，一份親手做的溫暖甜點，能為他帶來一絲甜蜜的慰藉。</span>
        </div>
        <img src="https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1978&auto=format&fit=crop" alt="精美的甜點" class="dessert-image">
      </div>

      <!-- 右側深度解析區 -->
      <div class="card right-card">
        <h2 class="insights-title">💡 心意與烘焙數據 Insights</h2>
        <div class="data-tip">
          <p>🚨 失敗率數據：{{ pitfallMessage }}</p>
        </div>
        
        <div class="interactive-demo">
          <label for="oil-slider">互動模擬：拖動以改變油脂汙染程度：{{ oilContamination }}%</label>
          <input 
            type="range" 
            id="oil-slider" 
            min="0" 
            max="5" 
            step="0.1" 
            v-model.number="oilContamination"
            class="slider"
          >
          <div class="success-rate-viz">
            <span>預估打發成功率</span>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: meringueSuccessRate + '%' }">
                {{ meringueSuccessRate }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 分隔線 -->
        <hr class="divider">

        <!-- 💖 友情心意份量計算機 -->
        <div class="calculator-section">
          <h3 class="calculator-title">💖 友情心意份量計算機</h3>
          <div class="counter-group">
            <label>預計送禮人數：</label>
            <div class="counter">
              <button @click="decrementCount" class="counter-btn">-</button>
              <span class="counter-value">{{ giftCount }}</span>
              <button @click="incrementCount" class="counter-btn">+</button>
            </div>
          </div>
          <ul class="ingredient-list">
            <li v-for="item in adjustedRecipe" :key="item.name" class="ingredient-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-amount">{{ item.amount }} <small>{{ item.unit }}</small></span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 1. Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: rgba(251, 249, 246, 0.8); /* 帶透明度的燕麥白 */
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.logo {
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--text-color);
}

.nav-links a {
  margin-left: 30px;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--secondary-color);
}

/* 2. Main Content */
.main-content {
  display: flex;
  gap: 30px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.left-card {
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.right-card {
  width: 55%;
}

/* 左側卡片樣式 */
.scenario-content {
  padding-bottom: 20px;
}
.scenario-text {
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 10px 0;
}
.scenario-suggestion {
  font-size: 1rem;
  color: #7d6e6e;
}
.dessert-image {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  margin-top: auto; /* 將圖片推至底部 */
}

/* 右側卡片樣式 */
.insights-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
}
.data-tip {
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid var(--primary-color);
  margin-bottom: 25px;
}
.data-tip p {
  margin: 0;
  line-height: 1.6;
}

/* 互動展示區 */
.interactive-demo {
  margin-top: 20px;
}
.interactive-demo label {
  font-size: 0.9rem;
  color: #7d6e6e;
}
.slider {
  width: 100%;
  margin: 10px 0;
  accent-color: var(--secondary-color);
}
.success-rate-viz {
  margin-top: 20px;
}
.progress-bar-container {
  width: 100%;
  background-color: #f0e9e2;
  border-radius: 20px;
  height: 28px;
  overflow: hidden;
  margin-top: 8px;
}
.progress-bar {
  height: 100%;
  background-color: var(--secondary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  transition: width 0.5s ease-in-out;
  white-space: nowrap;
}

/* 分隔線 */
.divider {
  border: none;
  border-top: 1px solid #f0e9e2;
  margin: 30px 0;
}

/* 計算機區塊 */
.calculator-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.counter-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 20px;
}

.counter {
  display: flex;
  align-items: center;
  gap: 15px;
}

.counter-btn {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background-color 0.3s ease;
}

.counter-btn:hover {
  background-color: var(--secondary-color);
  color: white;
}

.counter-value {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.ingredient-list {
  list-style-type: none;
  padding: 0;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed rgba(230, 213, 195, 0.8);
}

.ingredient-item:last-child {
  border-bottom: none;
}
</style>