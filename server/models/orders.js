const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  appOrderID: { type: Number, required: true },
  price: { type: Number, required: true },
  triggerPrice: { type: Number },
  priceType: { type: String, enum: ['MKT', 'LMT', 'SL-LMT', 'SL-MKT'], required: true },
  productType: { type: String, required: true },
  status: { type: String, enum: ['open', 'complete', 'pending', 'cancelled'], required: true },
  cumulativeQuantity: { type: Number, default: 0 },
  leavesQuantity: { type: Number, default: 0 },
  orderGeneratedDateTimeAPI: { type: Date, default: Date.now },
  transaction: { type: String, enum: ['buy', 'sell'], required: true },
  algoID: { type: String, default: '' },
  exchange: { type: String, required: true },
  symbol: { type: String, required: true },

  actionLogs: [
    {
      actionType: { type: String, enum: ['placeOrder', 'modifyOrder', 'cancelOrder'] },
      details: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Order = new mongoose.model('Order', orderSchema);

module.exports = Order;
