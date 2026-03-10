const fs=require("fs")

async function fetchJSON(url){

const res=await fetch(url)

return res.json()

}

async function build(){

const pokedex=[]

for(let id=1;id<=1025;id++){

console.log("pokemon",id)

const pokemon=await fetchJSON(`https://pokeapi.co/api/v2/pokemon/${id}`)
const species=await fetchJSON(`https://pokeapi.co/api/v2/pokemon-species/${id}`)

const names={}

species.names.forEach(n=>{
names[n.language.name]=n.name.toLowerCase()
})

const stats={}

pokemon.stats.forEach(s=>{
stats[s.stat.name]=s.base_stat
})

pokedex.push({

id,
names,
types:pokemon.types.map(t=>t.type.name),
height:pokemon.height,
weight:pokemon.weight,
stats,
color:species.color.name

})

}

fs.writeFileSync("../data/pokedex.json",JSON.stringify(pokedex))

console.log("done")

}

build()
