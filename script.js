// 1. 获取页面元素（绑定DOM节点）
const audioPlayer = document.getElementById('audio-player'); // 音频核心
const playPauseBtn = document.getElementById('play-pause-btn'); // 播放/暂停按钮
const prevBtn = document.getElementById('prev-btn'); // 上一曲
const nextBtn = document.getElementById('next-btn'); // 下一曲
const progressBar = document.getElementById('progress-bar'); // 进度条
const currentTime = document.getElementById('current-time'); // 当前时间
const totalTime = document.getElementById('total-time'); // 总时间
const songTitle = document.getElementById('song-title'); // 歌曲标题
const songArtist = document.getElementById('song-artist'); // 歌手
const albumCover = document.getElementById('album-cover'); // 专辑封面
const playlistItems = document.querySelectorAll('#playlist li'); // 播放列表项

// 2. 播放/暂停功能
playPauseBtn.addEventListener('click', function() {
    if (audioPlayer.paused) { // 若当前暂停，则播放
        audioPlayer.play();
        playPauseBtn.textContent = '暂停';
    } else { // 若当前播放，则暂停
        audioPlayer.pause();
        playPauseBtn.textContent = '播放';
    }
});

// 3. 进度条同步：播放时实时更新进度
audioPlayer.addEventListener('timeupdate', function() {
    // 计算进度百分比（当前时间/总时间 * 100）
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progressPercent;

    // 格式化当前时间（分:秒，补0对齐）
    const currentMin = Math.floor(audioPlayer.currentTime / 60);
    const currentSec = Math.floor(audioPlayer.currentTime % 60);
    currentTime.textContent = `${currentMin.toString().padStart(2, '0')}:${currentSec.toString().padStart(2, '0')}`;

    // 格式化总时间（首次加载时设置）
    if (audioPlayer.duration) {
        const totalMin = Math.floor(audioPlayer.duration / 60);
        const totalSec = Math.floor(audioPlayer.duration % 60);
        totalTime.textContent = `${totalMin.toString().padStart(2, '0')}:${totalSec.toString().padStart(2, '0')}`;
    }
});

// 4. 拖动进度条跳转播放位置
progressBar.addEventListener('input', function() {
    // 计算目标时间（进度条值/100 * 总时间）
    const targetTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = targetTime;
});

// 5. 播放列表点击切换歌曲
playlistItems.forEach(item => {
    item.addEventListener('click', function() {
        // 获取当前点击歌曲的信息（从data-*属性中读取）
        const songSrc = this.getAttribute('data-src');
        const songCover = this.getAttribute('data-cover');
        const songName = this.getAttribute('data-title');
        const songSinger = this.getAttribute('data-artist');
        const songDur = this.getAttribute('data-duration');

        // 更新音频源和页面信息
        audioPlayer.src = songSrc;
        albumCover.src = songCover;
        songTitle.textContent = songName;
        songArtist.textContent = songSinger;
        totalTime.textContent = songDur;

        // 激活当前列表项（取消其他项的激活状态）
        playlistItems.forEach(li => li.classList.remove('active'));
        this.classList.add('active');

        // 自动播放新歌曲
        audioPlayer.play();
        playPauseBtn.textContent = '暂停';
    });
});

// 6. 上一曲功能
prevBtn.addEventListener('click', function() {
    // 找到当前激活的列表项索引
    let currentIndex = 0;
    playlistItems.forEach((item, index) => {
        if (item.classList.contains('active')) {
            currentIndex = index;
        }
    });

    // 计算上一曲索引（循环：第一首的上一曲是最后一首）
    const prevIndex = currentIndex === 0 ? playlistItems.length - 1 : currentIndex - 1;
    // 触发上一曲的点击事件
    playlistItems[prevIndex].click();
});

// 7. 下一曲功能（逻辑同上一曲，索引递增）
nextBtn.addEventListener('click', function() {
    let currentIndex = 0;
    playlistItems.forEach((item, index) => {
        if (item.classList.contains('active')) {
            currentIndex = index;
        }
    });

    const nextIndex = currentIndex === playlistItems.length - 1 ? 0 : currentIndex + 1;
    playlistItems[nextIndex].click();
});

// 8. 歌曲播放结束自动切下一曲
audioPlayer.addEventListener('ended', function() {
    nextBtn.click();
});

// 1. 仅声明1次核心DOM元素（放在文件开头，避免重复声明）
const mvBtn = document.getElementById('mv-btn');
const mvModal = document.getElementById('mv-modal');
const mvClose = document.getElementById('mv-close');
const mvPlayer = document.getElementById('mv-player');
let currentSongItem = playlistItems[0]; // 初始当前歌曲（第一首）

// 2. 播放列表点击切换：同步更新MV源（核心修改）
// 2. 播放列表点击切换：同步更新MV源（修正后）
playlistItems.forEach(item => { // 用箭头函数，确保this指向item
    item.addEventListener('click', () => {
        // 2.2 更新音频数据（原有逻辑保留）
        const audioSrc = item.getAttribute('data-src');
        const audioCover = item.getAttribute('data-cover');
        const songTitle = item.getAttribute('data-title');
        const songArtist = item.getAttribute('data-artist');
        const songDuration = item.getAttribute('data-duration');
        
        audioPlayer.src = audioSrc;
        document.getElementById('album-cover').src = audioCover;
        document.getElementById('song-title').textContent = songTitle;
        document.getElementById('song-artist').textContent = songArtist;
        document.getElementById('total-time').textContent = songDuration;
        
        // 2.3 新增：更新MV源和封面（关键！实现多MV关联）
        const mvSrc = item.getAttribute('data-mv-src');
        console.log("mv/video2.mp4", mvSrc);
        const mvCover = item.getAttribute('data-mv-cover');
        mvPlayer.src = mvSrc; // 切换MV视频源
        mvPlayer.poster = mvCover; // 切换MV封面
        
        // 2.4 激活当前列表项+播放音频（修正classList拼写）
        playlistItems.forEach(li => li.classList.remove('active'));
        item.classList.add('active'); // 修正为classList（大写L）
        audioPlayer.play();
        playPauseBtn.textContent = '暂停';
    });
});
// 3. 点击MV按钮：播放当前歌曲对应的MV（原有逻辑优化）
mvBtn.addEventListener('click', function() {
    // 3.1 暂停音频，避免音画冲突
    audioPlayer.pause();
    playPauseBtn.textContent = '播放';
    
    // 3.2 显示MV弹窗并播放
    mvModal.style.display = 'flex';
    mvPlayer.play(); // 播放当前歌曲对应的MV（已通过列表切换更新源）
});

// 4. MV关闭逻辑（原有保留，确保正常关闭）
mvClose.addEventListener('click', function() {
    mvPlayer.pause();
    mvModal.style.display = 'none';
});
// 点击弹窗遮罩关闭（优化体验，参考摘要3的交互设计）
mvModal.addEventListener('click', function(e) {
    if (e.target === mvModal) {
        mvPlayer.pause();
        mvModal.style.display = 'none';
    }
});