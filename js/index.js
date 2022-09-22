import {songs} from './songs.js';
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading =$('header h2')
const cdThumd =$('.cd-thumb')
const audio =$('#audio')
const cd = $('.cd')
const playBtn =$('.btn-toggle-play')
const player = $('.player')

var currentIndex = 0
var isplaying =false
function render() {
    const htmls = songs.map(song => {
        return `
        <div class="song">
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
    $('.playlist').innerHTML = htmls.join('')
}

function handleEvent(){
    //xu ly thu phong main img
    const cdwith =cd.offsetWidth
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
            player.classList.remove('playing')
        }
        else{
            isplaying=true
            audio.play()
            player.classList.add('playing')
        }
        
    }
    //tien do bai hat
    audio.ontimeupdate =()=>{
        console.log(audio.currentTime)
    }
}

function difineProperties(id){
    return songs[id]
}

function loadCurrentSong(){
    const currentSong=difineProperties(currentIndex)
    heading.textContent =currentSong.name
    cdThumd.style.backgroundImage= `url('${currentSong.img}')`
    audio.src = currentSong.path

}
function start() {
    // difineProperties(currentIndex)
    loadCurrentSong()
    render()
    handleEvent()

}
start()