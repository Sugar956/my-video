
var playNode = document.getElementsByClassName('playNode')[0],
    videoNode = document.getElementsByClassName('videoNode')[0],
    fullNode = document.querySelector('.fullNode'),
    nowTime = document.querySelector('.now'),
    allTime = document.querySelector('.all'),
    lineNode = document.querySelector('.lineNode'),
    crlNode = document.querySelector('.crlNode'),
    loadNode = document.querySelector('.loadNode'),
    vDragNode = document.querySelector('.dragNode'),
    playBln = true;

playNode.onclick = function () {
    playBln = !playBln;
    if(playBln==false){
        this.className = 'pauseNode';
        videoNode.play();
    }else {
        this.className = 'playNode';
        videoNode.pause();
    }
};

fullNode.onclick = function () {
    if(videoNode.webkitRequestFullscreen){
        videoNode.webkitRequestFullscreen();
    }else if(videoNode.mozRequestFullScreen){
        videoNode.mozRequestFullScreen();
    }else {
        videoNode.requestFullscreen();
    }
};

//解决时间为NaN的问题
videoNode.addEventListener('canplay',function () {
    // allTime.innerHTML = videoNode.duration;
    var needTime = parseInt(videoNode.duration),
        s = needTime%60,
        m = parseInt(needTime / 60),
        timeNum = ToDou(m)+":"+ToDou(s);
    allTime.innerHTML = timeNum;
},false);
//解决时间不足10的问题
function ToDou(time) {
    return  time<10?"0"+time:time;
}

videoNode.addEventListener('timeupdate',function () {

    // allTime.innerHTML = videoNode.duration;
    var needTime = parseInt(videoNode.currentTime),
        s = needTime%60,
        m = parseInt(needTime / 60),
        timeNum = ToDou(m)+":"+ToDou(s);
    nowTime.innerHTML = timeNum;

//进度条走动
    //     console.log(videoNode.currentTime/videoNode.duration*100);
    lineNode.style.width = videoNode.currentTime/videoNode.duration*100+"%";
    crlNode.style.left = lineNode.offsetWidth-8.5+"px";
},false);

//拖拽进度条按钮
crlNode.onmousedown = function(e){
    var ev = e || event;
    var l = ev.clientX - this.offsetLeft;
    videoNode.pause();

    document.onmousemove = function(e){
        var ev = e || event;
        var needX = ev.clientX - l;
        var maxX = loadNode.offsetWidth - 8.5;

        needX = needX < -8.5 ? -8.5 : needX;
        needX = needX > maxX ? maxX : needX;
        crlNode.style.left = needX + 'px';
        lineNode.style.width = (crlNode.offsetLeft+9)/loadNode.offsetWidth*100 + '%';
    };
    document.onmouseup = function(e){
        document.onmousemove = document.onmouseup = null;
        videoNode.currentTime = videoNode.duration * (crlNode.offsetLeft+9)/loadNode.offsetWidth;
        //console.log((CrlNode.offsetLeft+9)/LoadNode.offsetWidth);
        //VideoNode.play();
        //PlayBln = false;
        //className = 'pauseNode';
        if(playBln == false){
            //console.log(1);
            playNode.className = 'pauseNode';
            videoNode.play();
        }
        else{
            //console.log(2);
            playNode.className = 'playNode';
            videoNode.pause();
        }
    };
    return false;
};

//声音的拖拽按钮
vDragNode.onmousedown = function(e){
    var ev = e || event;
    var l = ev.clientX - this.offsetLeft;
    document.onmousemove = function(e){
        var ev = e || event;
        var needX = ev.clientX - l;
        var maxX = vDragNode.parentNode.offsetWidth - 2.5;

        needX = needX < -2.5 ? - 2.5 : needX;
        needX = needX > maxX ? maxX : needX;
        //计算0 - 1
        //console.log((vDragNode.offsetLeft + 2) / vDragNode.parentNode.offsetWidth);
        //	console.log((vDragNode.offsetLeft + 2) / vDragNode.parentNode.offsetWidth);
        var lastVolume = (vDragNode.offsetLeft + 2) / vDragNode.parentNode.offsetWidth ;
        videoNode.volume = lastVolume < 0 ? 0 : lastVolume;

        vDragNode.style.left = needX + 'px';
    };
    document.onmouseup = function(e){
        document.onmousemove = document.onmouseup = null;
    };
    return false;
};

