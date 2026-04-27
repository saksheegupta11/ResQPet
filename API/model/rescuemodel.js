import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
const rescueSchema = mongoose.Schema({
  _id: Number,

  animalImage: {
    type: String,
  },
  animalImageName: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  assignedNgo: {
    type: Number,
    ref: "ngo_collection",
  },

  rejectedBy: [{
    type: Number,
    ref: "ngo_collection",
  }],

  location: {
    type: String,
    required: true,
    trim: true
  },

  city: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    trim: true,
  },

  reporterEmail: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "resolved"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
//to apply unique validator
mongoose.plugin(mongooseUniqueValidator);
const rescueSchemaModel = mongoose.model('rescue_collection', rescueSchema, 'rescue_collections');
//where rescue collection a=is name of collection in database
export default rescueSchemaModel;