const express = require("express")
const axios = require("axios")
const Crypto = require("../models/Crypto")
const router = express.Router()
const jwt = require("jsonwebtoken")

router.get("/", async (req, res) => {
  try {
    const resp = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
    )
    const decodedToken = jwt.decode(req.cookies.token)
    const userId = decodedToken.userId

    let uCrypto = await Crypto.findOne({ userId })

    if (!uCrypto) {
      uCrypto = new Crypto({ userId, cryptoList: [] })
    }
    const cryptos = resp.data.map((crypto) => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.current_price,
      market_cap: crypto.market_cap,
      market_cap_rank: crypto.market_cap_rank,
      total_volume: crypto.total_volume,
      high_24h: crypto.high_24h,
      low_24h: crypto.low_24h,
    }))

    for (const cry of cryptos) {
      uCrypto.cryptoList.push(cry)
    }
    uCrypto.cryptoList = uCrypto.cryptoList.slice(-10)
    await uCrypto.save()
    res.render("crypto", {
      cryptos: uCrypto.cryptoList,
    })
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error)
    res.status(500).render("crypto", {
      cryptos: [],
      errorMessage: "Error fetching or saving data",
    })
  }
})

router.get("/:id", async (req, res) => {
  const cryptoId = req.params.id

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}`
    const response = await axios.get(url)
    const cryptoDetails = response.data

    res.render("cryptoDetails", {
      crypto: cryptoDetails,
    })
  } catch (error) {
    console.error("Error fetching cryptocurrency details:", error)
    res.status(500).render("error", {
      errorMessage: "Error fetching cryptocurrency details",
    })
  }
})

module.exports = router
