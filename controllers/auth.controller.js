import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Register function
export const register = async (req, res) => {
	try {
		const { fullname, email, password, g_recaptcha_response, role, avatar } = req.body;

		// Kiểm tra các trường bắt buộc
		if (!fullname || !email || !password || !g_recaptcha_response) {
			return res.status(400).json({ error: 'All required fields must be filled' });
		}

		// Kiểm tra xem email đã tồn tại hay chưa
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		// Mã hóa mật khẩu
		const hashedPassword = await bcrypt.hash(password, 12);

		// Tạo người dùng mới
		const newUser = new User({
			fullname,
			email,
			password: hashedPassword,
			g_recaptcha_response,
			role: role || 'user',
			avatar: avatar || '', // Add avatar to user model
		});

		await newUser.save();

		// Tạo token JWT
		const token = jwt.sign(
			{ userId: newUser._id, email: newUser.email, role: newUser.role },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN }
		);

		res.status(201).json({
			access_token: token,
			token_type: 'Bearer',
			client_id: newUser._id.toString(),
			user: {
				_id: newUser._id,
				fullname: newUser.fullname,
				username: newUser.username || '',
				email: newUser.email,
				phone_number: newUser.phone_number || '',
				gender: newUser.gender || '',
				birthday: newUser.birthday || '',
				id_number: newUser.id_number || '',
				user_type: newUser.user_type || '',
				status: newUser.status,
				language: newUser.language,
				role_ids: newUser.role_ids || [],
				last_login: newUser.last_login ? newUser.last_login.getTime() : 0,
				created_at: newUser.created_at.getTime(),
				updated_at: newUser.updated_at.getTime(),
				avatar: newUser.avatar, // Include avatar in response
				clients: newUser.clients.map((client) => ({
					_id: client._id,
					fullname: client.fullname,
					email: client.email,
					phone_number: client.phone_number,
					organization: client.organization,
					company_name: client.company_name,
					business_sectors: client.business_sectors,
					address: client.address,
					ward: client.ward,
					district: client.district,
					province: client.province,
					country: client.country,
					postcode: client.postcode,
					tax_code: client.tax_code,
					tax_exempt: client.tax_exempt,
					late_fee: client.late_fee,
					credit: client.credit,
					currency: client.currency,
					status: client.status,
					users: client.users,
					notes: client.notes,
					created_at: client.created_at.getTime(),
					updated_at: client.updated_at.getTime(),
				})),
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Login function
// export const login = async (req, res) => {
// 	try {
// 		const { email, password } = req.body;

// 		if (!email || !password) {
// 			return res.status(400).json({ error: 'All required fields must be filled' });
// 		}

// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(400).json({ error: 'Invalid email or password' });
// 		}

// 		const isMatch = await bcrypt.compare(password, user.password);
// 		if (!isMatch) {
// 			return res.status(400).json({ error: 'Invalid email or password' });
// 		}

// 		// Include the role in the JWT payload
// 		const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
// 			expiresIn: process.env.JWT_EXPIRES_IN,
// 		});

// res.status(200).json({
// 	access_token: token,
// 	token_type: 'Bearer',
// 	user: {
// 		_id: user._id,
// 		fullname: user.fullname,
// 		username: user.username || '',
// 		email: user.email,
// 		avatar: user.image || '',
// 		phone_number: user.phone_number || '',
// 		gender: user.gender || '',
// 		birthday: user.birthday || '',
// 		id_number: user.id_number || '',
// 		user_type: user.user_type || '',
// 		status: user.status,
// 		language: user.language,
// 		role_ids: user.role_ids || [],
// 		last_login: user.last_login ? user.last_login.getTime() : 0,
// 		created_at: user.created_at.getTime(),
// 		updated_at: user.updated_at.getTime(),
// 		role: user.role, // Include role in response for testing
// 		clients: user.clients.map((client) => ({
// 			_id: client._id,
// 			fullname: client.fullname,
// 			email: client.email,
// 			phone_number: client.phone_number,
// 			organization: client.organization,
// 			company_name: client.company_name,
// 			business_sectors: client.business_sectors,
// 			address: client.address,
// 			ward: client.ward,
// 			district: client.district,
// 			province: client.province,
// 			country: client.country,
// 			postcode: client.postcode,
// 			tax_code: client.tax_code,
// 			tax_exempt: client.tax_exempt,
// 			late_fee: client.late_fee,
// 			credit: client.credit,
// 			currency: client.currency,
// 			status: client.status,
// 			users: client.users,
// 			notes: client.notes,
// 			created_at: client.created_at.getTime(),
// 			updated_at: client.updated_at.getTime(),
// 		})),
// 	},
// });
// 	} catch (error) {
// 		res.status(400).json({ error: error.message });
// 	}
// };

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'All required fields must be filled' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});

		res.status(200).json({
			access_token: token,
			role: user.role,
			user: {
				_id: user._id,
				fullname: user.fullname,
				username: user.username || '',
				email: user.email,
				avatar: user.avatar || '',
				phone_number: user.phone_number || '',
				gender: user.gender || '',
				birthday: user.birthday || '',
				id_number: user.id_number || '',
				user_type: user.user_type || '',
				status: user.status,
				language: user.language,
				role_ids: user.role_ids || [],
				last_login: user.last_login ? user.last_login.getTime() : 0,
				created_at: user.created_at.getTime(),
				updated_at: user.updated_at.getTime(),
				clients: user.clients.map((client) => ({
					_id: client._id,
					fullname: client.fullname,
					email: client.email,
					phone_number: client.phone_number,
					organization: client.organization,
					company_name: client.company_name,
					business_sectors: client.business_sectors,
					address: client.address,
					ward: client.ward,
					district: client.district,
					province: client.province,
					country: client.country,
					postcode: client.postcode,
					tax_code: client.tax_code,
					tax_exempt: client.tax_exempt,
					late_fee: client.late_fee,
					credit: client.credit,
					currency: client.currency,
					status: client.status,
					users: client.users,
					notes: client.notes,
					created_at: client.created_at.getTime(),
					updated_at: client.updated_at.getTime(),
				})),
			},
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// api get me when login successful check authentication
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Get all users
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Get user by ID
export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Update user
export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedData = req.body;

		// Nếu mật khẩu được cập nhật, mã hóa nó
		if (updatedData.password) {
			updatedData.password = await bcrypt.hash(updatedData.password, 12);
		}

		const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

		if (!updatedUser) return res.status(404).json({ error: 'User not found' });

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Delete user
export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
