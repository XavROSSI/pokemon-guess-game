let pokedex=[]
let currentPokemon=null

let score=0
let streak=0

let compareA=null
let compareB=null
let compareStat="weight"

/* ================= LOAD POKEDEX ================= */

async function loadPokedex(){

const res=await fetch("data/pokedex.json")
pokedex=await res.json()

}

/* ================= MENU ================= */

function startGame(){

document.getElementById("mainMenu").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")

nextPokemon()

}

function backToMenu(){

document.getElementById("game").classList.add("hidden")
document.getElementById("mainMenu").classList.remove("hidden")

}

/* ================= RANDOM ================= */

function getRandomPokemon(){

return pokedex[Math.floor(Math.random()*pokedex.length)]

}

/* ================= SPRITE ================= */

function getSprite(id,mode){

if(mode==="back"){
return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`
}

return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

}

/* ================= GAME FLOW ================= */

function nextPokemon(){

const mode=document.getElementById("mode").value

if(mode==="compare"){
startCompare()
return
}

currentPokemon=getRandomPokemon()

renderPokemon(mode)

}

/* ================= RENDER ================= */

function renderPokemon(mode){

const sprite=document.getElementById("sprite")
const hints=document.getElementById("hints")
const compare=document.getElementById("compare")

compare.innerHTML=""
hints.innerHTML=""

sprite.style.display="block"

sprite.src=getSprite(currentPokemon.id,mode)
sprite.style.filter="none"

if(mode==="silhouette"){
sprite.style.filter="brightness(0) contrast(100)"
}

if(mode==="types"){

hints.innerHTML="Types : "

currentPokemon.types.forEach(t=>{
const span=document.createElement("span")
span.textContent=t
span.className="typeBadge"
hints.appendChild(span)
})

}

if(mode==="pokedex"){

sprite.style.display="none"

const lang=document.getElementById("language").value

hints.innerHTML=`
<p>Height: ${currentPokemon.height}</p>
<p>Weight: ${currentPokemon.weight}</p>
<p>Color: ${currentPokemon.color}</p>
`

}

}

/* ================= COMPARISON MODE ================= */

function startCompare(){

compareA=getRandomPokemon()
compareB=getRandomPokemon()

renderCompare()

}

function renderCompare(){

const compare=document.getElementById("compare")
const sprite=document.getElementById("sprite")
const hints=document.getElementById("hints")

sprite.style.display="none"
hints.innerHTML=""

const lang=document.getElementById("language").value

compare.innerHTML=`

<div class="compareBox">

<div class="comparePokemon" onclick="chooseCompare('A')">
${compareA.names[lang]}
</div>

<div>VS</div>

<div class="comparePokemon" onclick="chooseCompare('B')">
${compareB.names[lang]}
</div>

</div>

<p>Who has the biggest ${compareStat} ?</p>

`

}

function chooseCompare(choice){

let correct

if(compareA[compareStat]>compareB[compareStat]){
correct="A"
}else{
correct="B"
}

if(choice===correct){
score++
streak++
}else{
streak=0
}

updateScore()

startCompare()

}

/* ================= ANSWER ================= */

function checkAnswer(){

const guess=document.getElementById("guess").value.toLowerCase().trim()

const lang=document.getElementById("language").value

const correct=currentPokemon.names[lang]

if(guess===correct){

score++
streak++

}else{

streak=0

}

document.getElementById("result").textContent=correct

updateScore()

}

/* ================= SCORE ================= */

function updateScore(){

document.getElementById("score").textContent="Score: "+score
document.getElementById("streak").textContent="Streak: "+streak

}

/* ================= EVENTS ================= */

function initEvents(){

document.getElementById("validateBtn").onclick=checkAnswer
document.getElementById("skipBtn").onclick=nextPokemon

document.getElementById("mode").addEventListener("change",nextPokemon)

document.getElementById("language").addEventListener("change",nextPokemon)

document.getElementById("guess").addEventListener("keydown",e=>{
if(e.key==="Enter"){
checkAnswer()
}
})

}

/* ================= INIT ================= */

async function init(){

await loadPokedex()

initEvents()

}

init()
