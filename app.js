let pokedex=[]
let currentPokemon=null

let score=0
let streak=0

let compareA=null
let compareB=null
let compareStat="weight"
let suggestionIndex=-1
let currentSuggestions=[]

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

async function loadPokedex(){

const res=await fetch("data/pokedex.json")
pokedex=await res.json()

}

function getSelectedGenerations(){

return [...document.querySelectorAll("#genSelector input:checked")]
.map(e=>parseInt(e.value))

}

function navigateSuggestions(e){

const items=document.querySelectorAll(".suggestion")

if(!items.length) return

if(e.key==="ArrowDown"){

suggestionIndex++

if(suggestionIndex>=items.length) suggestionIndex=0

}

if(e.key==="ArrowUp"){

suggestionIndex--

if(suggestionIndex<0) suggestionIndex=items.length-1

}

items.forEach(el=>el.classList.remove("active"))

if(items[suggestionIndex]){

items[suggestionIndex].classList.add("active")

document.getElementById("guess").value=
items[suggestionIndex].textContent

}

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

const gens=getSelectedGenerations()

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
sprite.classList.remove("reveal")

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

if(document.getElementById("hardMode").checked){

hints.innerHTML=`Color: ${currentPokemon.color}`

}

}

function checkAnswer(){

const guess=document.getElementById("guess").value.toLowerCase().trim()
const lang=document.getElementById("language").value

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
const lang=document.getElementById("language").value
const box=document.getElementById("suggestions")

box.innerHTML=""
suggestionIndex=-1

if(input.length<2) return

currentSuggestions=pokedex
.map(p=>p.names[lang])
.filter(name=>name.startsWith(input))
.slice(0,6)

currentSuggestions.forEach((name,i)=>{

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

document.getElementById("language").addEventListener("change",nextPokemon)

const guessInput=document.getElementById("guess")

guessInput.addEventListener("input",updateSuggestions)

guessInput.addEventListener("keydown",e=>{

if(e.key==="Enter"){
checkAnswer()
}

if(e.key==="ArrowDown" || e.key==="ArrowUp"){
navigateSuggestions(e)
}

}))

document.getElementById("guess").addEventListener("input",updateSuggestions)

}

async function init(){

await loadPokedex()

initEvents()

}

init()
