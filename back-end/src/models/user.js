const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, minlength: 8 },    // optional — OAuth users won't have one
  provider:   { type: String, default: 'local' }, // 'local' | 'google'
  providerId: { type: String },                   // Google user ID
  createdAt:  { type: Date, default: Date.now }
})

// Hash password before saving (only if a password is set)
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Method to compare passwords on login
userSchema.methods.comparePassword = async function (entered) {
  return await bcrypt.compare(entered, this.password)
}

// Never send password in responses
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model('User', userSchema)