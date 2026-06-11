<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 導覽列狀態管理 (5大分頁)
const currentTab = ref('culture');

// 🏆 全域狀態：當前選擇的甜點 (串聯所有分頁)
const globalDessertId = ref('thanks');

// --- 1. 核心資料庫：基礎資訊、配方與遊戲 ---
const dessertDB = {
  thanks: {
    id: 'thanks',
    intent: '感謝陪伴',
    name: '經典磅蛋糕 (Pound Cake)',
    img: 'https://shoplineimg.com/67c5523a88c0b5001a1a71f5/69a78f97299a163458bec16f/800x.jpg?',
    culture: '誕生於18世紀的英國，因其配方中麵粉、奶油、糖、蛋各佔一磅而得名。它紮實、純粹且耐存放的特性，象徵著「經得起時間考驗的深厚情誼」，是表達感謝與日常陪伴的最佳選擇。',
    baseCost: 150,
    recipe: [
      { name: '低筋麵粉', amt: 50, unit: 'g' },
      { name: '無鹽奶油', amt: 50, unit: 'g' },
      { name: '細砂糖', amt: 50, unit: 'g' },
      { name: '全蛋液', amt: 50, unit: 'g' }
    ],
    gameItems: [
      { id: 1, text: 'A. 奶油與砂糖打發至羽毛狀泛白' },
      { id: 2, text: 'B. 分次少量加入常溫蛋液確保乳化' },
      { id: 3, text: 'C. 篩入低筋麵粉並以切拌方式混合' },
      { id: 4, text: 'D. 麵糊入模並在中央表面劃刀' },
      { id: 5, text: 'E. 放入烤箱高溫烘烤至金黃熟透' }
    ]
  },
  icebreak: {
    id: 'icebreak',
    intent: '破冰和好',
    name: '法式瑪德蓮 (Madeleine)',
    img: 'https://cdn-general.cybassets.com/media/W1siZiIsIjE4NTg0L3Byb2R1Y3RzLzM2MDc4NjM4LzE2NDMxNzk4NTVfMDVjOTJiY2JmYWJlNmEwODVkZGUuanBlZyJdLFsicCIsInRodW1iIiwiMjA0OHgyMDQ4Il1d.jpeg?sha=5f660341e44a4ad7',
    culture: '源自法國洛林地區，因普魯斯特的《追憶似水年華》而成為喚醒美好記憶的代名詞。它溫暖的貝殼造型與剛出爐的奶油香氣，能瞬間融化彼此的隔閡，是最適合破冰與分享的溫暖甜點。',
    baseCost: 80,
    recipe: [
      { name: '低筋麵粉', amt: 20, unit: 'g' },
      { name: '無鹽奶油', amt: 20, unit: 'g' },
      { name: '細砂糖', amt: 15, unit: 'g' },
      { name: '全蛋液', amt: 20, unit: 'g' },
      { name: '無鋁泡打粉', amt: 0.6, unit: 'g' }
    ],
    gameItems: [
      { id: 1, text: 'A. 混合全蛋液與細砂糖至均勻' },
      { id: 2, text: 'B. 拌入過篩的低筋麵粉與泡打粉' },
      { id: 3, text: 'C. 緩慢加入微溫的融化焦化奶油' },
      { id: 4, text: 'D. 麵糊確實封膜並靜置冷藏兩小時' },
      { id: 5, text: 'E. 放入高溫烤箱利用溫差熱震烘焙' }
    ]
  },
  birthday: {
    id: 'birthday',
    intent: '生日祝福',
    name: '波爾多可麗露 (Canelé)',
    img: 'https://resource02.ulifestyle.com.hk/ulcms/content/article/thumbnail/1280x720/uf/2800000/2803956/100386331_1428252070716426_1863886137106366464_o.jpg',
    culture: '誕生於波爾多修道院，擁有「天使之鈴」的美譽。外層是經過長時間高溫烘烤的焦糖脆殼，內裡卻是充滿香草與蘭姆酒香氣的柔軟孔洞。製作繁複且珍貴，最適合獻給生命中特別的他/她。',
    baseCost: 120,
    recipe: [
      { name: '全脂牛奶', amt: 100, unit: 'ml' },
      { name: '細砂糖', amt: 45, unit: 'g' },
      { name: '低筋麵粉', amt: 25, unit: 'g' },
      { name: '蘭姆酒', amt: 10, unit: 'ml' },
      { name: '雞蛋黃', amt: 10, unit: 'g' }
    ],
    gameItems: [
      { id: 1, text: 'A. 煮沸香草牛奶與奶油並放涼' },
      { id: 2, text: 'B. 將微溫液體沖入蛋粉糊中混合' },
      { id: 3, text: 'C. 麵糊封膜冷藏熟成 24-48 小時' },
      { id: 4, text: 'D. 銅模預熱並均勻塗抹純蜂蠟' },
      { id: 5, text: 'E. 倒入麵糊進行三段式溫控烘烤' }
    ]
  }
};

const currentDessert = computed(() => dessertDB[globalDessertId.value]);

// --- 2. 烘焙科學 (動態核心教學步驟資料庫) ---
const academyStepIndex = ref(0);

// 建立動態映射對象，根據不同甜點切換對應的步驟內容
const academyData = {
  thanks: [ // 磅蛋糕
    { title: 'Step 1: 奶油與砂糖粉碎打發', detail: '將室溫軟化的奶油與砂糖打發至蓬鬆泛白，這是蛋糕膨脹的核心動力。', img: 'https://img.shoplineapp.com/media/image_clips/5f1e823f37b6c80042f10e99/original.png?1595834943', insight: '磅蛋糕膨脹全靠奶油裹入的空氣。若奶油退冰過度化成液態，將無法鎖住氣泡，烤出來的蛋糕會像死硬的發糕。' },
    { title: 'Step 2: 蛋液少量多次乳化攪拌', detail: '確保蛋液為室溫狀態，分次、少量地加入奶油糊中，並充分攪拌至完全吸收。', img: 'https://img.ltn.com.tw/Upload/food/page/2017/08/13/170813-6579-13-CLuZS.jpg', insight: '一次倒入過多冷蛋液，油脂與水分會徹底分離。請確保蛋液為室溫，並分至少4-5次加入，否則油水分離會導致蛋糕體粗糙、縮水。' },
    { title: 'Step 3: 中心劃刀與均勻開裂', detail: '在烘烤中途、表面微結皮時，在蛋糕中心劃一刀，引導熱氣均勻釋放。', img: 'https://imgproxy.icook.network/safe/rt:fit/w:1200/el:0/q:80/plain/http://tokyo-kitchen.icook.tw.s3.amazonaws.com/uploads/step/cover/668488/8e1a09c39d352dc7.jpg', insight: '烤至表面微結皮時（約15分鐘），若未及時用小刀在中央劃出一道裂縫，熱氣會隨機從側邊爆破，破壞磅蛋糕經典的對稱山形美感。' }
  ],
  icebreak: [ // 瑪德蓮
    { title: 'Step 1: 粉類過篩與均勻混合', detail: '過篩能帶入空氣，確保粉類不結塊，使甜點質地細緻。', img: 'https://media.karousell.com/media/photos/products/2023/7/1/60_____1688226620_8493232c_progressive', insight: '麵粉若未過篩，顆粒內部會形成「乾燥夾心」，在攪拌時容易過度出筋，導致原本應該鬆軟的蛋糕體變得像麵包一樣產生死硬的嚼勁。' },
    { title: 'Step 2: 奶油焦化與乳化作用', detail: '加熱奶油引發「梅納反應」，散發迷人的榛果香氣（榛果奶油 Brown Butter）；並透過溫度控制讓油脂與蛋液完美乳化。', img: 'https://img.ltn.com.tw/Upload/food/page/2017/08/13/170813-6579-13-CLuZS.jpg', insight: '焦化奶油若在「高於 60°C」的狀態下直接倒入蛋液，會瞬間將雞蛋燙熟變成「散蛋花」，導致乳化失敗、油水分離，甜點進爐後會瘋狂冒油。' },
    { title: 'Step 3: 靜置冷藏與高溫熱震', detail: '麵糊經過一夜冷藏靜置，讓麵筋放鬆、澱粉充分吸收水分；進爐時遇到高溫，產生劇烈的「熱震物理效應」。', img: 'https://today-obs.line-scdn.net/0hFBIW12E4GW10LghViYRmOiZ4GgJHQgpuEBhIWQovRyEFaQZQFDwQdDRRDjYseQZAFzReWw5eRCYGflZQOiNWajRZGw0FSwREPiNWdCRKRDYSbgJrLUkQ', insight: '缺少了冷藏靜置的「溫差熱震」，烤焙時內外溫差不足，瑪德蓮將無法順利膨脹出高聳迷人的「經典凸肚臍」，磅蛋糕也無法自然膨脹開裂。' }
  ],
  birthday: [ // 可麗露
    { title: 'Step 1: 鮮奶香草莢加熱與悶香', detail: '溫柔加熱鮮奶與香草莢，讓香草的天然精華徹底釋放融入奶液中。', img: 'https://imgproxy.icook.network/safe/rt:fit/w:1200/el:0/q:80/plain/http://tokyo-kitchen.icook.tw.s3.amazonaws.com/uploads/step/cover/1946999/64e115e8a2e980a9.jpg', insight: '香草鮮奶若煮至大滾，精華香氣會隨水蒸氣大量流失。應加熱至微冒泡後離火悶香，才能封存最深厚的風味。' },
    { title: 'Step 2: 麵糊長時間熟成靜置', detail: '將混合好的麵糊放入冰箱，進行 24 到 48 小時的低溫熟成，是風味與質地的關鍵。', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2flGsd1ckKPlBlP8lfkgwd_N2LM6rVo9gtw&s', insight: '可麗露麵糊內含高比例液體，若無靜置24-48小時讓麵筋徹底釋放、澱粉完全水合，烘烤時麵糊會瘋狂膨脹「暴走拔高」，導致內部結構空洞。' },
    { title: 'Step 3: 銅模塗蠟與高溫瞬間定型', detail: '均勻在銅模內部塗抹一層薄薄的天然蜂蠟，再倒入麵糊進行高溫烘烤。', img: 'https://i.ytimg.com/vi/MHqKREa1bQQ/hqdefault.jpg', insight: '蜂蠟或黃油若塗抹不均、厚度過厚，高溫烘烤時會在底部積油，形成「凹底（白頭）」現象，焦糖外殼也會因此變得軟爛不酥脆。' }
  ]
};

// 使用 computed 自動根據當前甜點切換對應的教學步驟
const currentSteps = computed(() => academyData[globalDessertId.value]);

// --- 3. 友情份量與預算計算機 ---
const friendCount = ref(2);
const adjustedRecipe = computed(() => {
  return currentDessert.value.recipe.map(ingredient => {
    return {
      ...ingredient,
      amt: (ingredient.amt * friendCount.value).toFixed(1).replace(/\.0$/, '')
    };
  });
});
const estimatedCost = computed(() => currentDessert.value.baseCost * friendCount.value);
const incrementFriend = () => friendCount.value++;
const decrementFriend = () => { if (friendCount.value > 1) friendCount.value--; };

// --- 4. 烘焙大師步驟排序遊戲 ---
const gameItems = ref([]);
const gameResult = ref(null);

const initGame = () => {
  gameResult.value = null;
  // 深拷貝並隨機打亂當前甜點的遊戲選項
  const items = JSON.parse(JSON.stringify(currentDessert.value.gameItems));
  gameItems.value = items.sort(() => Math.random() - 0.5);
};

const moveUp = (index) => {
  if (index > 0) {
    const temp = gameItems.value[index - 1];
    gameItems.value[index - 1] = gameItems.value[index];
    gameItems.value[index] = temp;
  }
};
const moveDown = (index) => {
  if (index < gameItems.value.length - 1) {
    const temp = gameItems.value[index + 1];
    gameItems.value[index + 1] = gameItems.value[index];
    gameItems.value[index] = temp;
  }
};
const checkGame = () => {
  const correctOrder = [1, 2, 3, 4, 5];
  const currentOrder = gameItems.value.map(i => i.id);
  const isPerfect = correctOrder.every((val, i) => val === currentOrder[i]);
  
  if (isPerfect) {
    gameResult.value = { text: '👑 烘焙大師：完美無瑕的科學步驟！', type: 'success' };
  } else if (currentOrder[0] === 1 && currentOrder[4] === 5) {
    gameResult.value = { text: '👨‍🍳 合格主廚：細節有點小亂，但成品應該還行！', type: 'warning' };
  } else {
    gameResult.value = { text: '💥 廚房殺手：步驟大亂，準備迎接災難吧！請重試。', type: 'danger' };
  }
};
const resetGame = () => { initGame(); };

// --- 狀態監聽：切換全域甜點時，重置相關步驟與遊戲 ---
watch(globalDessertId, () => {
  academyStepIndex.value = 0;
  initGame();
});

onMounted(() => {
  initGame();
});

// --- 5. 心意卡片客製化產生器 ---
const cardForm = ref({
  friendName: '',
  message: '',
  style: 'style-warm'
});
</script>

<template>
  <div class="app-wrapper">
    <!-- 🌌 上方導覽列 -->
    <nav class="navbar">
      <div class="logo">Friendship Bakery</div>
      <div class="nav-links">
        <a @click="currentTab = 'culture'" :class="{ 'active': currentTab === 'culture' }">心意文化</a>
        <a @click="currentTab = 'academy'" :class="{ 'active': currentTab === 'academy' }">烘焙科學</a>
        <a @click="currentTab = 'calculator'" :class="{ 'active': currentTab === 'calculator' }">預算計算</a>
        <a @click="currentTab = 'game'" :class="{ 'active': currentTab === 'game' }">排序遊戲</a>
        <a @click="currentTab = 'card'" :class="{ 'active': currentTab === 'card' }">心意卡片</a>
      </div>
    </nav>

    <!-- 🌸 分頁一：心意引導與甜點文化傳播 -->
    <main class="page-container" v-if="currentTab === 'culture'">
      <div class="text-center">
        <h1 class="main-title">你想對朋友表達什麼心意？</h1>
        <p class="sub-title">選擇你的送禮初衷，讓我們為你尋找最適合的文化甜點載體。</p>
      </div>
      
      <div class="selection-grid">
        <div 
          v-for="(item, key) in dessertDB" 
          :key="key"
          class="card selection-card"
          :class="{ 'active-card': globalDessertId === key }"
          @click="globalDessertId = key"
        >
          <h2 class="card-title">{{ item.intent }}</h2>
        </div>
      </div>

      <div class="card flex-layout mt-40">
        <div class="col-left">
          <h2 class="insights-title">{{ currentDessert.name }}</h2>
          <p class="meaning-text">{{ currentDessert.culture }}</p>
        </div>
        <div class="col-right">
          <img :src="currentDessert.img" :alt="currentDessert.name" class="dessert-img">
        </div>
      </div>
    </main>

    <!-- 📖 分頁二：烘焙科學：核心教學步驟 -->
    <main class="page-container" v-else-if="currentTab === 'academy'">
       <div class="text-center">
        <h1 class="main-title">烘焙科學教練</h1>
        <p class="sub-title">告別失敗！用物理與數據看透甜點製作的真相。</p>
      </div>

      <div class="card">
        <!-- 步驟切換按鈕組 -->
        <div class="step-tabs">
          <button 
            v-for="(step, index) in currentSteps" 
            :key="index"
            class="step-tab-btn"
            :class="{ active: academyStepIndex === index }"
            @click="academyStepIndex = index"
          >
            Step {{ index + 1 }}
          </button>
        </div>
        
        <!-- 透過 v-if 動態渲染當前選中的步驟 -->
        <transition name="fade" mode="out-in">
          <div class="flex-layout mt-40" :key="academyStepIndex" v-if="currentSteps[academyStepIndex]">
            <div class="col-left">
              <h2 class="step-title">{{ currentSteps[academyStepIndex].title }}</h2>
              <p class="step-detail">{{ currentSteps[academyStepIndex].detail }}</p>
              <img :src="currentSteps[academyStepIndex].img" alt="step image" class="dessert-img mt-20">
            </div>
            
            <div class="col-right flex-column-center">
              <div class="insight-box">
                <h2 class="insight-title">🚨 烘焙物理破綻偵測</h2>
                <p class="insight-text">{{ currentSteps[academyStepIndex].insight }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>

    <!-- 🧮 分頁三：友情份量與預算即時計算機 -->
    <main class="page-container" v-else-if="currentTab === 'calculator'">
      <div class="card calculator-card">
        <h1 class="main-title text-center">友情預算與備料計算機</h1>
        
        <div class="counter-wrap mb-20">
          <span class="counter-label">選擇甜點：</span>
          <select v-model="globalDessertId" class="custom-select">
            <option v-for="(item, key) in dessertDB" :key="key" :value="key">{{ item.name }}</option>
          </select>
        </div>

        <div class="counter-wrap">
          <span class="counter-label">預計送禮人數：</span>
          <div class="counter-controls">
            <button class="circle-btn" @click="decrementFriend">-</button>
            <span class="counter-num">{{ friendCount }}</span>
            <button class="circle-btn" @click="incrementFriend">+</button>
          </div>
        </div>

        <div class="cost-estimate mt-20">
          💰 預估食材成本：<span>NT$ {{ estimatedCost }}</span>
        </div>

        <ul class="recipe-list">
          <li v-for="item in adjustedRecipe" :key="item.name" class="recipe-item">
            <span class="ing-name">{{ item.name }}</span>
            <span class="ing-amount">{{ item.amt }} <small>{{ item.unit }}</small></span>
          </li>
        </ul>
      </div>
    </main>

    <!-- 🎮 分頁四：烘焙大師：步驟排序互動遊戲 -->
    <main class="page-container" v-else-if="currentTab === 'game'">
      <div class="text-center">
        <h1 class="main-title">挑戰：{{ currentDessert.name }} 步驟排序</h1>
        <p class="sub-title">點擊上下箭頭，還原正確的烘焙科學順序！</p>
        <div class="mt-20">
          <label class="counter-label">切換挑戰甜點：</label>
          <select v-model="globalDessertId" class="custom-select">
            <option v-for="(item, key) in dessertDB" :key="key" :value="key">{{ item.name }}</option>
          </select>
        </div>
      </div>

      <div class="card calculator-card">
        <div class="game-list">
          <div v-for="(item, index) in gameItems" :key="item.id" class="game-item">
            <span class="game-text">{{ item.text }}</span>
            <div class="game-actions">
              <button class="circle-btn small-btn" @click="moveUp(index)" :disabled="index === 0">↑</button>
              <button class="circle-btn small-btn" @click="moveDown(index)" :disabled="index === gameItems.length - 1">↓</button>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-40">
          <button class="primary-btn wide-btn" @click="checkGame">提交檢查</button>
          <button class="secondary-btn wide-btn ml-10" @click="resetGame">重新洗牌</button>
        </div>

        <div v-if="gameResult" class="alert-box mt-20" :class="gameResult.type">
          {{ gameResult.text }}
        </div>
      </div>
    </main>

    <!-- 📝 分頁五：心意卡片客製化產生器 -->
    <main class="page-container flex-layout" v-else-if="currentTab === 'card'">
      <div class="card col-left">
        <h2 class="insights-title">客製化心意表單</h2>
        
        <div class="form-group">
          <label>朋友的名字：</label>
          <input type="text" v-model="cardForm.friendName" placeholder="例如：親愛的 Alice" class="custom-input">
        </div>

        <div class="form-group">
          <label>想對他說的話：</label>
          <textarea v-model="cardForm.message" rows="4" placeholder="寫下你的溫暖祝福..." class="custom-input"></textarea>
        </div>

        <div class="form-group">
          <label>搭配甜點：</label>
          <select v-model="globalDessertId" class="custom-select w-100">
            <option v-for="(item, key) in dessertDB" :key="key" :value="key">{{ item.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>卡片風格：</label>
          <select v-model="cardForm.style" class="custom-select w-100">
            <option value="style-warm">奶茶溫暖風</option>
            <option value="style-pink">莫蘭迪粉紅</option>
          </select>
        </div>
      </div>

      <div class="col-right flex-column-center">
        <div class="card preview-card" :class="cardForm.style">
          <h2 class="preview-title">To: {{ cardForm.friendName || '你的朋友' }}</h2>
          <img :src="currentDessert.img" class="preview-img">
          <p class="preview-msg">{{ cardForm.message || '這裡會顯示你充滿心意的溫暖文字，將這份手作的幸福傳遞給他/她。' }}</p>
          <div class="preview-footer">From: 烘焙好朋友</div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  /* 🌌 全域視覺升級色彩 */
  --bg-color: #FDFBF7;        /* 極具質感的淺燕麥白 */
  --text-color: #3A2E2B;      /* 深胡桃木色 */
  --highlight-color: #C98A7F; /* 溫暖的莫蘭迪粉 */
  --card-bg: #FFFFFF;

  --font-family: 'PingFang TC', 'Microsoft JhengHeidi', sans-serif;
  --card-shadow: 0 8px 30px rgba(58, 46, 43, 0.05); /* 微細高級陰影 */
  --card-radius: 16px; /* 高質感圓角 */
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-family);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

.app-wrapper {
  min-height: 100vh;
}

/* 通用 Utils */
.mt-20 { margin-top: 20px; }
.mt-40 { margin-top: 40px; }
.mb-20 { margin-bottom: 20px; }
.ml-10 { margin-left: 10px; }
.w-100 { width: 100%; }

/* --- 共用排版與卡片 --- */
.card {
  background-color: var(--card-bg);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  padding: 40px; /* 充分的留白 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.page-container {
  max-width: 1100px;
  margin: 60px auto;
  padding: 0 30px;
}

.text-center {
  text-align: center;
  margin-bottom: 40px;
}

/* ---  typography 字體大升級 --- */
.main-title {
  font-size: 2rem; /* 32px */
  font-weight: bold;
  margin-bottom: 15px;
}

.sub-title {
  font-size: 1.4rem; /* 22px */
  color: #7A6A66;
}

p, .card-desc, .meaning-text {
  font-size: 1.1rem; /* 18px */
  line-height: 1.6;
}

/* --- 🌌 導覽列 Navbar --- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 60px; /* 拉大內襯 */
  background-color: rgba(253, 251, 247, 0.85); 
  backdrop-filter: blur(15px);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(58, 46, 43, 0.05);
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.logo {
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--text-color);
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.2rem; /* 提升字體大小 */
  transition: color 0.3s ease;
  cursor: pointer;
  position: relative;
  padding-bottom: 8px; 
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--highlight-color);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease-out;
  border-radius: 2px;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--highlight-color);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  transform: scaleX(1);
}

/* --- 🌸 分頁一：選單網格 --- */
.selection-grid {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.selection-card {
  flex: 1;
  min-width: 280px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 30px 20px;
}

.selection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(58, 46, 43, 0.08);
}

.active-card {
  border-color: var(--highlight-color);
  background-color: #FEFAF9;
}

.card-title {
  font-size: 1.6rem;
  color: var(--highlight-color);
  margin: 0;
}

/* --- 🍰 分頁二：雙欄排版 --- */
.flex-layout {
  display: flex;
  gap: 40px;
}

.col-left { width: 45%; display: flex; flex-direction: column; }
.col-right { width: 55%; }
.flex-column-center { display: flex; flex-direction: column; justify-content: center; }

.dessert-img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  flex-grow: 1;
  min-height: 250px;
}

.insights-title { font-size: 1.6rem; font-weight: bold; margin-bottom: 30px; }

.alert-box {
  padding: 25px;
  border-radius: 12px;
  font-size: 1.1rem;
  line-height: 1.6;
}
.alert-box.danger {
  background-color: #FFF5F4;
  border: 1px solid #FFD6D1;
  color: #B23A3A;
  font-weight: 500;
}
.alert-box.warning {
  background-color: #FFFDF4;
  border: 1px solid #FDE68A;
  color: #92400E;
  font-weight: 500;
}
.alert-box.success {
  background-color: #F8FAF7;
  border: 1px solid #E2EBDD;
  color: #3F6212;
  font-weight: 500;
}

/* 按鈕樣式 */
.primary-btn, .secondary-btn {
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}
.primary-btn {
  background-color: var(--highlight-color);
  color: white;
}
.primary-btn:hover:not(:disabled) {
  background-color: #B0766B;
}
.primary-btn:disabled {
  background-color: #E2D3D0;
  cursor: not-allowed;
}
.secondary-btn {
  background-color: #F0EAE3;
  color: var(--text-color);
}
.secondary-btn:hover {
  background-color: #E2D8CE;
}
.wide-btn { min-width: 150px; }

.step-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}
.step-indicator {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--text-color);
}

/* --- 📖 分頁二：烘焙科學專屬樣式 --- */
.step-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  border-bottom: 2px solid #F0EAE3;
  padding-bottom: 20px;
}

.step-tab-btn {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  font-weight: bold;
  color: #A89B98;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.step-tab-btn:hover {
  color: var(--highlight-color);
  background-color: #FEFAF9;
}

.step-tab-btn.active {
  color: var(--highlight-color);
  background-color: #FEFAF9;
  box-shadow: 0 4px 15px rgba(201, 138, 127, 0.15);
}

.step-title {
  font-size: 1.5rem; /* 24px */
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--text-color);
}

.step-detail {
  font-size: 1.1rem; /* 18px */
  line-height: 1.6;
  color: var(--text-color);
}

.insight-box {
  background-color: #FFF0EE; /* 淡紅色背景底框 */
  border: 1px solid #FFD6D1;
  border-radius: 12px;
  padding: 35px;
  box-shadow: 0 10px 25px rgba(178, 58, 58, 0.05);
}

.insight-title {
  color: #B23A3A; /* 深紅色標題 */
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.insight-text {
  color: #922B2B; /* 深紅色內文 */
  font-size: 1.1rem; /* 18px */
  line-height: 1.8;
  margin: 0;
}

/* 動畫：步驟圖片淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* --- 🧮 分頁三：專屬計算機 --- */
.calculator-card {
  max-width: 700px;
  margin: 0 auto;
}

.counter-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F9F7F4;
  border-radius: 12px;
  padding: 20px 30px;
}

.counter-label { font-size: 1.4rem; font-weight: bold; }

.counter-controls { display: flex; align-items: center; gap: 20px; }

.circle-btn {
  background-color: var(--highlight-color);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.6rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.circle-btn:hover { opacity: 0.8; }
.circle-btn:disabled { background-color: #E2D3D0; cursor: not-allowed; }
.small-btn { width: 34px; height: 34px; font-size: 1.2rem; }

.counter-num {
  font-size: 1.6rem;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.custom-select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #D9CDC2;
  font-size: 1.2rem;
  font-family: inherit;
  outline: none;
  background-color: white;
}

.cost-estimate {
  text-align: right;
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 30px;
}
.cost-estimate span { color: var(--highlight-color); font-size: 1.6rem; }

.recipe-list { list-style: none; padding: 0; }

.recipe-item {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 2px dashed rgba(58, 46, 43, 0.1);
  font-size: 1.4rem;
}
.recipe-item:last-child { border: none; }

.ing-name { font-weight: 500; }
.ing-amount {
  color: var(--highlight-color);
  font-weight: bold;
}
.ing-amount small { font-size: 1.1rem; color: #7A6A66; }

/* --- 🎮 分頁四：遊戲 --- */
.game-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.game-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFF;
  border: 1px solid #E6DCD1;
  padding: 15px 25px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
}
.game-actions { display: flex; gap: 10px; }

/* --- 📝 分頁五：卡片產生器 --- */
.form-group { margin-bottom: 25px; }
.form-group label { display: block; font-size: 1.2rem; font-weight: bold; margin-bottom: 10px; }
.custom-input {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #D9CDC2;
  font-size: 1.1rem;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
}

.preview-card {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 3 / 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 15px 40px rgba(58, 46, 43, 0.1);
}
.preview-card.style-warm { background-color: #F9F3EE; color: var(--text-color); border: 8px solid #FFFFFF; }
.preview-card.style-pink { background-color: #FDF6F5; color: #8F554D; border: 8px solid #F6E1DF; }

.preview-title { font-size: 1.8rem; font-family: serif; font-weight: bold; }
.preview-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin: 20px auto; border: 4px solid white; }
.preview-msg { font-size: 1.2rem; line-height: 1.8; font-style: italic; white-space: pre-wrap; flex-grow: 1;}
.preview-footer { font-size: 1.1rem; font-weight: bold; text-align: right; margin-top: 20px;}
</style>
