// ==========================================
// 【新機能】データベースの準備 (Dexie.jsを使用)
// ==========================================
const db = new Dexie("TimestampKidsDB");

// データベースの設計図（テーブル）を作ります
// daily_records: 毎日の記録を入れる箱
// "date" を主キー（見出し）にして、その他のデータも保存できるようにします
db.version(1).stores({
    daily_records: "date, startTime, endTime, durationMinutes, status"
});

// 今日の日付を「2026-03-26」のような文字列で作る便利な仕組み
function getTodayString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
// ==========================================

// ① 画面の部品を変数として取得して準備する
const screenHome = document.getElementById('screen-home');
const screenTimer = document.getElementById('screen-timer');
const screenResult = document.getElementById('screen-result');

const stampStart = document.getElementById('stamp-start');
const stampGoal = document.getElementById('stamp-goal');
const timerDisplay = document.getElementById('timer-display');
const resultTime = document.getElementById('result-time');
const btnReturn = document.getElementById('btn-return');

let startTime;       
let timerInterval;   
let unlockTimeout;   

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
    
    // --- 【新機能】データベースに「スタート」を記録する ---
    const todayStr = getTodayString();
    db.daily_records.put({
        date: todayStr,
        startTime: startTime,
        endTime: null,
        durationMinutes: 0,
        status: "in_progress" // 「いま学習中だよ」というステータス
    }).then(() => {
        console.log("データベースにスタート時刻を保存しました！", todayStr);
    });
    // ---------------------------------------------------
    
    // 誤作動防止ロックをかける処理
    stampGoal.classList.add('disabled');
    stampGoal.innerText = 'ちょっと\nまってね';
    
    unlockTimeout = setTimeout(() => {
        stampGoal.classList.remove('disabled');
        stampGoal.innerText = 'ここにスタンプ\n(ゴール)';
    }, 3000); // テスト用: 3秒

    timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000); 
});

// ⑤ 【2回目】ゴールのスタンプが押されたときの動き
stampGoal.addEventListener('click', () => {
    // ロック中は押しても無効にする処理
    if (stampGoal.classList.contains('disabled')) {
        return; 
    }

    clearInterval(timerInterval);
    clearTimeout(unlockTimeout); 
    
    const endTime = Date.now(); // ゴールした時刻
    const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    // --- 【新機能】データベースの「ゴール」を更新（上書き）する ---
    const todayStr = getTodayString();
    db.daily_records.update(todayStr, {
        endTime: endTime,
        durationMinutes: minutes,
        status: "completed" // 「おわったよ」というステータスに変更
    }).then(() => {
        console.log("データベースにゴール時刻と、かかった時間を保存しました！");
    });
    // -------------------------------------------------------------

    resultTime.textContent = `${minutes}ふん ${seconds}びょう`;
    showScreen(screenResult);
});

// ⑥ 結果画面の「ホームへもどる」ボタンが押されたときの動き
btnReturn.addEventListener('click', () => {
    timerDisplay.textContent = '00:00';
    showScreen(screenHome);
});
