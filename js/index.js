import {songs} from './songs.js';
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY="SETTING_KEY"

const heading =$('header h2')
const cdThumd =$('.cd-thumb')
const audio =$('#audio')
const cd = $('.cd')
const playBtn =$('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn =$('.btn-next')
const prevBtn =$('.btn-prev')
const randomBtn =$('.btn-random')
const repeatBtn =$('.btn-repeat')
const playList= $('.playlist')

var isRandom = false
var isRepeat =false
var currentIndex = 0
var isplaying =false
var config= JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{}

function setConfig(key,value){
    config[key]=value
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(config))
}

function handleEvent(){
    //xu ly thu phong main img
    const cdwith =cd.offsetWidth

    const cdThumbAnimate=cdThumd.animate([
        {
            transform:'rotate(360deg)'
        }
    ],
        {
            duration:8000, //10secon
            iterations: Infinity
        }
    )
    cdThumbAnimate.pause()

    document.onscroll=()=>{
       const scrollTop= window.scrollY||document.documentElement.scrollTop

       const newcd =cdwith-scrollTop
       cd.style.width = newcd >24 ? newcd + 'px':0
       cd.style.opacity = newcd/cdwith
    }
    // xu ly play/pause 
    playBtn.onclick =()=>{
        if(isplaying){
            isplaying=false
            audio.pause()
            cdThumbAnimate.pause()
            player.classList.remove('playing')
        }
        else{
            isplaying=true
            audio.play()
            cdThumbAnimate.play()
            player.classList.add('playing')
        }
        
    }
    //tien do bai hat
    audio.ontimeupdate =()=>{
        if(audio.duration){
            const progessPercent = Math.floor(audio.currentTime/ audio.duration*100)
            progress.value =progessPercent
        }
    }
    //tua nhac
    progress.onchange = (e)=>{
        const seekTime= audio.duration /100 * e.target.value
        setTimeout(()=>{},500)
        audio.currentTime =seekTime.toFixed()
        }
    //nextsong
    nextBtn.onclick =function(){
        if(isRandom){
            playRandomSong()
        }
        else{
        nextSong()
        }
        audio.play()
        if(player.classList.contains('playing')==false){
            player.classList.add('playing')
        }
        render()
        scrollToActiveSong()

    }
    //prevSong
    prevBtn.onclick = ()=>{
        if(isRandom){
            playRandomSong()
        }
        else{
        prevSong()
        }
        audio.play()
        if(player.classList.contains('playing')==false){
            player.classList.add('playing')
        }
        render()
        scrollToActiveSong()
    }
    //random
    randomBtn.onclick =(e)=>{
        isRandom=!isRandom
        setConfig('isRandom',isRandom)
        randomBtn.classList.toggle('active',isRandom)

    }
    ///  repeat song
    repeatBtn.onclick=(e)=>{
        isRepeat =! isRepeat
        setConfig('isRepeat',isRepeat)
        repeatBtn.classList.toggle('active',isRepeat)
    }




    audio.onended=()=>{
        if(isRepeat){
            audio.play()
        }else{
            nextBtn.click()
        }
    }
    ///click chon bai nhac
    playList.onclick=(e)=>{
        const songNode =e.target.closest('.song:not(.active)')
        if(songNode || e.target.closest('.option')){
            if(songNode){
                currentIndex= Number(songNode.dataset.index)
                loadCurrentSong()
                audio.play()
                render()
                if(player.classList.contains('playing')==false){
                    player.classList.add('playing')
                }
            }
            if(e.target.closest('.option')){

            }
        }
    }




}
//ham load setting(loadconfig)
 function loadSetting(){
    isRandom= config.isRandom
    isRepeat= config.isRepeat
 }

//ham view
function scrollToActiveSong(){
    setTimeout(()=>{
        $('.song.active').scrollIntoView({
            behavior:'smooth',
            block:currentIndex<2?'end':'center'
        }
        )
    },200)
}
//ham render nhac 
function render() {
    const htmls = songs.map((song,index) => {
        return `
        <div class="song ${index===currentIndex?'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
    })
    playList.innerHTML = htmls.join('')
}
//ham phat nhac ramdon
function playRandomSong(){
    let newIndex
    do{
        newIndex=Math.floor(Math.random()*songs.length)
    }while(newIndex === currentIndex)
    currentIndex=newIndex
    loadCurrentSong()
}

//ham lay lay id nhaf
function difineProperties(id){
    return songs[id]
}
// ham phat bai nhac tiep theo
function nextSong(){
    currentIndex++;
    if(currentIndex >= songs.length){
        currentIndex=0
    }
    console.log(currentIndex)
    
    loadCurrentSong()
}
//hamg quay lai bai nhac truoc do
function prevSong(){
    currentIndex--;
    console.log(currentIndex)
    if(currentIndex <0){
        currentIndex=songs.length-1
    }
    loadCurrentSong()
}

//ham chuyen nhac
function loadCurrentSong(){
    const currentSong=difineProperties(currentIndex)
    heading.textContent =currentSong.name
    cdThumd.style.backgroundImage= `url('${currentSong.img}')`
    audio.src = currentSong.path

}
function start() {
    loadSetting()
    loadCurrentSong()
    render()
    handleEvent()
    randomBtn.classList.toggle('active',isRandom)
    repeatBtn.classList.toggle('active',isRepeat)

}
start()