let gameSeq=[];
let userSeq=[];

let btns=["red","orange","blue","purple"]

let started=false;
let level=0;
let hiscore=0;

let h2=document.querySelector('h2')

document.addEventListener("keypress",function(){
    if(started==false){
        console.log("game is started!")
        started=true
        levelUp();
    }
})

function levelUp(){
    userSeq=[]
    level++;
    h2.innerText=`level ${level}`

    //randon btn chossen
    let ranIdx=Math.floor(Math.random()*4);
    let randColor=btns[ranIdx]
    let randbtn=document.querySelector(`.${randColor}`)
    // console.log(ranIdx)
    // console.log(randColor)
    gameSeq.push(randColor)
    console.log(gameSeq)
    btnFlash(randbtn)
}

function btnFlash(btn){
    btn.classList.add('flash')
    setTimeout(function(){
        btn.classList.remove('flash')
    },250)
}
function userFlash(btn){
    btn.classList.add('userflash')
    setTimeout(function(){
        btn.classList.remove('userflash')
    },250)
}





let allbtns=document.querySelectorAll('.btn')
for(btn of allbtns){
    btn.addEventListener('click',btnPress)
}

function btnPress(){
    // console.log("btn was press")
    // console.log(this)
    let btn=this
    userFlash(btn)
    userColor=btn.getAttribute('id')
    // console.log(userColor)
    userSeq.push(userColor)
    checkAns(userSeq.length-1)
}

function checkAns(idx){
    // console.log("curr level: ",level)
    if(userSeq[idx]===gameSeq[idx]){
        // console.log("same value")
        if(userSeq.length==gameSeq.length){
            setTimeout(levelUp,1000)
        }
    }
    else{
        if(hiscore<level) hiscore=level
        h2.innerHTML=`Game over! your score was <b>${level}</b> <br> Higest Score till now is ${hiscore}<br>Press any key to start`
        document.querySelector('body').style.backgroundColor='red'

        setTimeout(function(){
            document.querySelector('body').style.backgroundColor='white'

        },150)
        reset();
    }

}

function reset(){
    started=false
    gameSeq=[];
    userSeq=[];
    level=0;
}
