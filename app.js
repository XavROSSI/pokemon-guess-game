let pokedex=[]
let currentPokemon=null

let score=0
let streak=0

let compareA=null
let compareB=null
let compareStat="weight"

let suggestionIndex=-1

const generations={
1:[1,151],
2:[152,251],
3:[252,386],
4:[387,493],
5:[494,649],
6:[650,721],
7:[722,809],
8:[810,905],
9:[906,1025]
}

let options={
language:"fr",
hardMode:false,
gens:[1,2,3,4,5,6,7,8,9]
}

function loadOptions(){

const saved=JSON.parse(localStorage.getItem("pokemonOptions"))

if(saved) options=saved

document.getElementById("languageOption").value=options.language
document.getElementById("hardModeOption").checked=options.hardMode

document.querySelectorAll("#genSelector input").forEach(cb=>{
cb.checked=options.gens.includes(parseInt(cb.value))
})

}

async function loadPokedex(){

const res=await fetch("data/pokedex.json")

pokedex=await res.json()

}

function startGame(){

document.getElementById("mainMenu").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")

nextPokemon()

}

function openOptions(){

document.getElementById("mainMenu").classList.add("hidden")
document.getElementById("optionsMenu").classList.remove("hidden")

loadOptions()

}

function closeOptions(){

document.getElementById("optionsMenu").classList.add("hidden")
document.getElementById("mainMenu").classList.remove("hidden")

}

function saveOptions(){

const language=document.getElementById("languageOption").value
const hardMode=document.getElementById("hardModeOption").checked

const gens=[...document.querySelectorAll("#genSelector input:checked")]
.map(e=>parseInt(e.value))

options={language,hardMode,gens}

localStorage.setItem("pokemonOptions",JSON.stringify(options))

closeOptions()

}

function backToMenu(){

document.getElementById("game").classList.add("hidden")
document.getElementById("mainMenu").classList.remove("hidden")

}

function getRandomPokemon(){

const gens=options.gens

let pool=[]

gens.forEach(g=>{

const [min,max]=generations[g]

pool=pool.concat(
pokedex.filter(p=>p.id>=min && p.id<=max)
)

})

if(pool.length===0){
return pokedex[Math.floor(Math.random()*pokedex.length)]
}

return pool[Math.floor(Math.random()*pool.length)]

}

function getSprite(id,mode){

if(mode==="back"){
return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`
}

return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

}

function nextPokemon(){

const mode=document.getElementById("mode").value

if(mode==="compare"){
startCompare()
return
}

currentPokemon=getRandomPokemon()

renderPokemon(mode)

}

function renderPokemon(mode){

const sprite=document.getElementById("sprite")
const hints=document.getElementById("hints")

sprite.style.display="block"

sprite.src=getSprite(currentPokemon.id,mode)

sprite.style.filter="none"

hints.innerHTML=""

if(mode==="silhouette"){
sprite.style.filter="brightness(0)"
}

if(mode==="types"){

currentPokemon.types.forEach(t=>{

const span=document.createElement("span")
span.textContent=t
span.className="typeBadge"

hints.appendChild(span)

})

}

if(options.hardMode){

hints.innerHTML=`Color: ${currentPokemon.color}`

}

}

function checkAnswer(){

const guess=document.getElementById("guess").value.toLowerCase().trim()

const lang=options.language

const correct=currentPokemon.names[lang]

const sprite=document.getElementById("sprite")

sprite.style.filter="none"
sprite.classList.add("reveal")

if(guess===correct){

score++
streak++

}else{

streak=0

}

document.getElementById("result").textContent="Réponse : "+correct

updateScore()

document.getElementById("guess").value=""

setTimeout(()=>{

document.getElementById("result").textContent=""

nextPokemon()

},1500)

}

function updateScore(){

document.getElementById("score").textContent="Score: "+score
document.getElementById("streak").textContent="Streak: "+streak

}

function startCompare(){

compareA=getRandomPokemon()
compareB=getRandomPokemon()

renderCompare()

}

function renderCompare(){

const compare=document.getElementById("compare")
const sprite=document.getElementById("sprite")

sprite.style.display="none"

const lang=options.language

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

<p>Qui a le plus de ${compareStat} ?</p>

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

function updateSuggestions(){

const input=document.getElementById("guess").value.toLowerCase()

const lang=options.language

const box=document.getElementById("suggestions")

box.innerHTML=""

if(input.length<2) return

pokedex
.map(p=>p.names[lang])
.filter(name=>name.startsWith(input))
.slice(0,6)
.forEach(name=>{

const div=document.createElement("div")

div.className="suggestion"

div.textContent=name

div.onclick=()=>{

document.getElementById("guess").value=name

box.innerHTML=""

}

box.appendChild(div)

})

}

function initEvents(){

document.getElementById("validateBtn").onclick=checkAnswer
document.getElementById("skipBtn").onclick=nextPokemon

document.getElementById("mode").addEventListener("change",nextPokemon)

const guessInput=document.getElementById("guess")

guessInput.addEventListener("input",updateSuggestions)

guessInput.addEventListener("keydown",e=>{

if(e.key==="Enter"){
checkAnswer()
}

})

}

async function init(){

await loadPokedex()

initEvents()

}

init()