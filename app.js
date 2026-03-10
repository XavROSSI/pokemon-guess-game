let pokedex=[]
let currentPokemon=null

let score=0
let streak=0

async function loadPokedex(){

const res=await fetch("data/pokedex.json")

pokedex=await res.json()

}

function startGame(){

document.getElementById("mainMenu").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")

nextPokemon()

}

function backToMenu(){

document.getElementById("game").classList.add("hidden")
document.getElementById("mainMenu").classList.remove("hidden")

}

function getRandomPokemon(){

return pokedex[Math.floor(Math.random()*pokedex.length)]

}

function getSprite(id,mode){

if(mode==="back"){

return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`

}

return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

}

function nextPokemon(){

const mode=document.getElementById("mode").value

currentPokemon=getRandomPokemon()

renderPokemon(mode)

}

function renderPokemon(mode){

const sprite=document.getElementById("sprite")

sprite.src=getSprite(currentPokemon.id,mode)

sprite.style.filter="none"

if(mode==="silhouette"){

sprite.style.filter="brightness(0) contrast(100)"

}

}

function checkAnswer(){

const guess=document.getElementById("guess").value.toLowerCase()

const lang=document.getElementById("language").value

const correct=currentPokemon.names[lang]

if(guess===correct){

score++
streak++

}else{

streak=0

}

document.getElementById("score").textContent="Score: "+score
document.getElementById("streak").textContent="Streak: "+streak

}

document.getElementById("validateBtn").onclick=checkAnswer
document.getElementById("skipBtn").onclick=nextPokemon

document.getElementById("mode").addEventListener("change",nextPokemon)
document.getElementById("language").addEventListener("change",nextPokemon)


async function init(){

await loadPokedex()

}

init()
