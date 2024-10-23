const mongoose = require( 'mongoose' ),


{ Schema } = mongoose,

productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true, max: 5 },
  createdAt: { type: Date, default: Date.now }
})

productSchema.virtual( 'formattedPrice' ).get(() => `$${ this.price.toFixed( 2 )}` )

productSchema.statics.findByRating = rating => this.find({ rating: { $gte: rating }})

productSchema.pre( 'save', next => {
  console.log( `Saved "${ this.title }" product.` )
  next()
})


module.exports = mongoose.model( 'Product', productSchema )