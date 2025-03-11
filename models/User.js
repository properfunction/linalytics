const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

// Hash password before saving a new user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) { // Check if password is modified
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      next(); // Proceed with saving the user after hashing the password
    } catch (err) {
      next(err); // Pass any error to the next middleware
    }
  } else {
    next(); // If password wasn't modified, proceed to save user
  }
});

// Password hash middleware.
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch; // Return the result of comparison (true or false)
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model("User", UserSchema);