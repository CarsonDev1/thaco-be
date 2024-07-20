import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
	fullname: { type: String },
	email: { type: String },
	phone_number: { type: String },
	organization: { type: Boolean, default: false },
	company_name: { type: String },
	business_sectors: { type: String },
	address: { type: String },
	ward: { type: String },
	district: { type: String },
	province: { type: String },
	country: { type: String },
	postcode: { type: String },
	tax_code: { type: String },
	tax_exempt: { type: Boolean, default: false },
	late_fee: { type: Number, default: 0 },
	credit: { type: Number, default: 0 },
	currency: { type: String },
	status: { type: String },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	notes: { type: String },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const Client = mongoose.model('Client', ClientSchema);

const UserSchema = new mongoose.Schema({
	fullname: { type: String, required: true },
	username: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	avatar: { type: String, default: '' },
	phone_number: { type: String },
	gender: { type: String },
	birthday: { type: String },
	id_number: { type: String },
	user_type: { type: String },
	status: { type: String, default: 'active' },
	language: { type: String, default: 'VN' },
	role_ids: [{ type: String }],
	last_login: { type: Date, default: null },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	clients: [ClientSchema],
	g_recaptcha_response: { type: String, required: true },
	role: { type: String, default: 'user' },
});

const User = mongoose.model('User', UserSchema);
export default User;
