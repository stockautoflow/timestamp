// ① 画面の部品（HTMLの要素）を変数として取得して準備する
const screenHome = document.getElementById('screen-home');
const screenTimer = document.getElementById('screen-timer');
const screenResult = document.getElementById('screen-result');

const stampStart = document.getElementById('stamp-start');
const stampGoal = document.getElementById('stamp-goal');
const timerDisplay = document.getElementById('timer-display');
const resultTime = document.getElementById('result-time');
const btnReturn = document.getElementById('btn-return');

// タイマー計算用のデータを入れる箱
let startTime;       
let timerInterval;   
let unlockTimeout;   // --- 【追加】ロック解除のタイマーを入れる箱 ---

// ② 画面を切り替えるための仕組み
function showScreen(screenToShow) {
    screenHome.classList.add('hidden');
    screenTimer.classList.add('hidden');
    screenResult.classList.add('hidden');
    screenToShow.classList.remove('hidden');
}

// ③ 時間を「00:00」のきれいな形にする仕組み
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}

// ④ 【1回目】スタートのスタンプが押されたときの動き
stampStart.addEventListener('click', () => {
    showScreen(screenTimer);
    startTime = Date.now();
    
    // --- 【追加】誤作動防止ロックをかける処理 ---
    // CSSで用意した「disabled」クラスをつけてグレーにする
    stampGoal.classList.add('disabled');
    stampGoal.innerText = 'ちょっと\nまってね';
    
    // テストしやすいように、まずは「3秒（3000ミリ秒）」でロックを解除します。
    // 本番（1分）にするときは、ここを 60000 に変更してください。
    unlockTimeout = setTimeout(() => {
        stampGoal.classList.remove('disabled');
        stampGoal.innerText = 'ここにスタンプ\n(ゴール)';
    }, 3000);
    // ------------------------------------------

    timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000); 
});

// ⑤ 【2回目】ゴールのスタンプが押されたときの動き
stampGoal.addEventListener('click', () => {
    // --- 【追加】ロック中は押しても無効にする処理 ---
    // もしスタンプに「disabled」クラスがついていたら、ここで処理をストップ！
    if (stampGoal.classList.contains('disabled')) {
        return; 
    }
    // ----------------------------------------------

    clearInterval(timerInterval);
    clearTimeout(unlockTimeout); // 念のためロック解除のタイマーもリセット
    
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    resultTime.textContent = `${minutes}ふん ${seconds}びょう`;
    showScreen(screenResult);
});

// ⑥ 結果画面の「ホームへもどる」ボタンが押されたときの動き
btnReturn.addEventListener('click', () => {
    timerDisplay.textContent = '00:00';
    showScreen(screenHome);
});
