/* eslint-disable no-console */
import * as fs from "fs";
import { uniqBy, sortBy } from "lodash-es";
import { saveJSON } from "../util.js";

// const pokemondbJSON = "data/pokemondb-gen9.json";
const pokeapiJSON = "data/pokemon.json";
const mergedJSON = "data/merged-pokemon.json";
const destJSON = "public/data-pkmn.json";

function loadJSON(filename: string): any {
  const json = fs.readFileSync(filename, "utf-8");
  return JSON.parse(json);
}

function pkmnUniqBy(mon: Record<string, any>): string {
  return JSON.stringify([
    mon.number,
    mon.hp,
    mon.attack,
    mon.defense,
    mon.spAttack,
    mon.spDefense,
    mon.speed,
    mon.types,
  ]);
}

const blockList = new Set(["pikachu-starter", "eevee-starter"]);

export async function mergeData(): Promise<void> {
  const pokeapi: Record<string, any>[] = loadJSON(pokeapiJSON);
  // const gen9: Record<string, any>[] = loadJSON(pokemondbJSON);

  let mons = pokeapi;
  // let mons = [...pokeapi, ...gen9];
  const idSet = new Set<string>();

  mons = uniqBy(mons, pkmnUniqBy);
  mons = sortBy(mons, (mon) => mon.number);
  mons = mons.filter((mon) => !blockList.has(mon.name));

  // Create unique IDs for gen9 data
  for (const m of mons) {
    delete m.spriteURL;
    delete m.shinySpriteURL;
    delete m.cryURL;
    if (fs.existsSync(`public/img/512/${m.id}-shiny.png`)) {
      m.hasShiny = true;
    }
    if (fs.existsSync(`public/cry/${m.id}.ogg`)) {
      m.hasCry = true;
    }
    const id = String(m.id || m.number);
    if (idSet.has(id)) {
      console.log(m.name, m.formNames.en, id, "exists...");
      let i = 1;
      while (idSet.has(id + "-" + i)) {
        i++;
      }
      m.id = id + "-" + i;
      console.log(m.name, m.formNames.en, m.id);
    } else {
      m.id = id;
    }
    idSet.add(m.id);
  }

  saveJSON(mergedJSON, mons, { indent: 2 });
  saveJSON(destJSON, mons, { indent: 0 });
}
