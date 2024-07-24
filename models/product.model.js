import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	discountPrice: { type: Number },
	imageUrls: { type: [String], required: true },
	videoUrl: { type: String },
	createdAt: { type: Date, default: Date.now },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	type: { type: String, required: true },
	category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
