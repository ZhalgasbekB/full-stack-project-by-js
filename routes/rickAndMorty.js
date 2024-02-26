const express = require("express")
const axios = require("axios")
const Character = require("../models/Character")
const router = express.Router()
const jwt = require("jsonwebtoken")

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://rickandmortyapi.com/api/character"
    )
    const decodedToken = jwt.decode(req.cookies.token)
    const userId = decodedToken.userId
    let uCharacter = await Character.findOne({ userId })
    if (!uCharacter) {
      uCharacter = new Character({ userId, characterList: [] })
    }

    const charactersData = response.data.results.map((character) => ({
      characterId: character.id,
      name: character.name,
      status: character.status,
      species: character.species,
      gender: character.gender,
      origin: {
        name: character.origin.name,
        url: character.origin.url,
      },
      location: {
        name: character.location.name,
        url: character.location.url,
      },
      image: character.image,
      url: character.url,
      created: character.created,
      episode: character.episode,
    }))

    uCharacter.characterList.push(...charactersData)
    uCharacter.characterList = uCharacter.characterList.slice(-20)
    await uCharacter.save()

    res.render("rickAndMorty", { characters: uCharacter.characterList })
  } catch (error) {
    console.error("Error fetching characters:", error)
    res.status(500).render("rickAndMorty", {
      characters: [],
      errorMessage: "Failed to fetch characters",
    })
  }
})

router.get("/:id", async (req, res) => {
  const characterId = req.params.id
  try {
    const decodedToken = jwt.decode(req.cookies.token)
    const userId = decodedToken.userId
    const characterDetails = await Character.findOne({ userId })
    res.render("rickAndMortyDetails", {
      character: characterDetails.characterList[characterId - 1],
    })
  } catch (error) {
    console.error("Error fetching cryptocurrency details:", error)
    res.status(500).render("error", {
      errorMessage: "Error fetching cryptocurrency details",
    })
  }
})

module.exports = router
