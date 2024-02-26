// const mongoose = require('mongoose');

// const cryptoSchema = new mongoose.Schema({
//   id: String,
//   symbol: String,
//   name: String,
//   image: String,
//   current_price: Number,
//   market_cap: Number,
//   market_cap_rank: Number,
//   total_volume: Number,
//   high_24h: Number,
//   low_24h: Number,
//   price_change_24h: Number,
//   price_change_percentage_24h: Number,
//   market_cap_change_24h: Number,
//   market_cap_change_percentage_24h: Number,
//   circulating_supply: Number,
//   total_supply: Number,
//   ath: Number,
//   ath_change_percentage: Number,
//   ath_date: Date,
//   atl: Number,
//   atl_change_percentage: Number,
//   atl_date: Date,
//   last_updated: Date
// });

// const Crypto = mongoose.model('Crypto', cryptoSchema);

// module.exports = Crypto;

const mongoose = require("mongoose")

const cryptoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cryptoList: [
      {
        id: String,
        symbol: String,
        name: String,
        image: String,
        current_price: Number,
        market_cap: Number,
        market_cap_rank: Number,
        total_volume: Number,
        high_24h: Number,
        low_24h: Number,
        price_change_24h: Number,
        price_change_percentage_24h: Number,
        market_cap_change_24h: Number,
        market_cap_change_percentage_24h: Number,
        circulating_supply: Number,
        total_supply: Number,
        ath: Number,
        ath_change_percentage: Number,
        ath_date: Date,
        atl: Number,
        atl_change_percentage: Number,
        atl_date: Date,
        last_updated: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Crypto = mongoose.model("Crypto", cryptoSchema)

module.exports = Crypto
