const express = require("express")
const axios = require("axios")
const jwt = require("jsonwebtoken")
const Artist = require("../models/Artist")
const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const url = "https://groupietrackers.herokuapp.com/api/artists"
    const response = await axios.get(url)

    const decodedToken = jwt.decode(req.cookies.token)
    const userId = decodedToken.userId

    let uBand = await Artist.findOne({ userId })

    if (!uBand) {
      uBand = new Artist({ userId, bands: [] })
    }
    const artists = response.data.map((artist) => ({
      artistId: artist.id,
      name: artist.name,
      image: artist.image,
      members: artist.members,
      creationDate: artist.creationDate,
      firstAlbum: artist.firstAlbum,
    }))
    uBand.bands.push(...artists)
    await uBand.save()

    res.render("groupie", {
      artistData: uBand.bands,
    })
  } catch (error) {
    console.error("Error fetching artists:", error)
    res.status(500).render("artists", {
      artistData: [],
      errorMessage: "Error fetching artists",
    })
  }
})

router.get("/:id", async (req, res) => {
    const relationId = req.params.id;

    try {
      const decodedToken = jwt.decode(req.cookies.token);
      const userId = decodedToken.userId;
      const artistData = await Artist.findOne({ userId });
      if (!artistData) {
        throw new Error('Artist data not found');
      }
      
  
      const band = artistData.bands[relationId - 1]
      const url = `https://groupietrackers.herokuapp.com/api/relation/${relationId}`;
      const response = await axios.get(url);
      const concerts = response.data;
  
      const infoConcert = { band, concerts };  
  
      res.render("groupieConcerts", {
        info: infoConcert,  
      });
  } catch (error) {
    console.error("Error fetching HAHA details:", error)
    res.status(500).render("error", {
      errorMessage: "Error fetching HEHE details",
    })
  }
})
module.exports = router

 