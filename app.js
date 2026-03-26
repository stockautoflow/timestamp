// ① 画面の部品（HTMLの要素）を変数として取得して準備する
const screenHome = document.getElementById('screen-home');
const screenTimer = document.getElementById('screen-timer');
const screenResult = document.getElementById('screen-result');

const stampStart = document.getElementById('stamp-start');
const stampGoal = document.getElementById('stamp-goal');
const timerDisplay = document.getElementById('timer-display');
const resultTime = document.getElementById('result-time');
const btnReturn = document.getElementById('btn-return');

// タイマー計算用のデータを入れる箱（変数）を用意する
let startTime;       // スタートした時刻を記録する箱
let timerInterval;   // 1秒ごとに動く時計の仕組みを入れる箱

// ② 画面を切り替えるための便利な仕組み（関数）
function showScreen(screenToShow) {
    // 一旦、すべての画面に「hidden（隠す）」魔法をかける
    screenHome.classList.add('hidden');
    screenTimer.classList.add('hidden');
    screenResult.classList.add('hidden');
    
    // 指定された画面だけ「hidden」の魔法を解いて表示する
    screenToShow.classList.remove('hidden');
}

// ③ 時間を「00:00」のきれいな形にする仕組み
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60); // 60で割って「分」を出す
    const seconds = totalSeconds % 60;             // 余りを「秒」にする
    // 数字が1桁のときに頭に「0」をつける（例：5秒 → 05）
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}

// ④ 【1回目】スタートのスタンプが押されたときの動き
stampStart.addEventListener('click', () => {
    // 画面をタイマー画面に切り替える
    showScreen(screenTimer);
    
    // パソコンの現在の時刻（ミリ秒）をスタート時刻として記録する
    startTime = Date.now();
    
    // 1秒（1000ミリ秒）ごとに時計の表示を書き換える命令をスタート
    timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000); // 何秒経ったか計算
        timerDisplay.textContent = formatTime(elapsedSeconds);       // 画面の数字を更新
    }, 1000); 
});

// ⑤ 【2回目】ゴールのスタンプが押されたときの動き
stampGoal.addEventListener('click', () => {
    // 1秒ごとに動いていた時計の仕組みをストップさせる
    clearInterval(timerInterval);
    
    // スタートからゴールまで何分何秒かかったか計算する
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    // 結果画面の「--ふん--びょう」という文字を、実際の計算結果に書き換える
    resultTime.textContent = `${minutes}ふん ${seconds}びょう`;
    
    // 画面を結果画面に切り替える
    showScreen(screenResult);
});

// ⑥ 結果画面の「ホームへもどる」ボタンが押されたときの動き
btnReturn.addEventListener('click', () => {
    // タイマーの数字を最初の「00:00」に戻しておく
    timerDisplay.textContent = '00:00';
    // ホーム画面に切り替える
    showScreen(screenHome);
});
