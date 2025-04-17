import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    default: 'jobseeker',
  },
  profile: {
    name: String,
    phone: String,
    location: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      location: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String,
    }],
    education: [{
      school: String,
      degree: String,
      fieldOfStudy: String,
      from: Date,
      to: Date,
    }],
    resume: String, // URL to resume file
  },
  company: {
    name: String,
    website: String,
    description: String,
    logo: String,
    location: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;