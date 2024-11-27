import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime, getUsername, hashPassword } from "../helpers/helper";

const userSchema = new Schema(
  {
    profilePicture: { type: String },
    profilePictureUrl: { type: String },
    fname: { type: String },
    lname: { type: String },
    fullName: {type: String },
    username: { type: String, required: true, unique: true },
    email: {
      value: { type: String, required: true, unique: true },
      is_verified: { type: Boolean, required: true, default: false },
    },
   // outletId: { type: Schema.Types.ObjectId, ref: "Outlet" },
    phone: {
      value: { type: String, required: true, unique: true },
      is_verified: { type: Boolean, required: true, default: false },
    },
    password: { type: String,
      // required: true 
    },
    gender: { type: String },
    deactivateReason: { type: String },
    deleteReason: { type: String },
    dob: { type: Date },
    is_2FA: {
      value: { type: Boolean, required: true, default: false },
      is_verified: { type: Boolean, required: true, default: false },
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    notification: {
      push_notification: { type: Boolean, required: true, default: true },
      email_notification: { type: Boolean, required: true, default: true },
      sms_notification: { type: Boolean, required: true, default: true },
    },
    acceptance: { type: Boolean, required: true, default: false },
    role: {
      type: Number,
      enum: [
        constants.accountLevel.superAdmin,
        constants.accountLevel.admin,
        constants.accountLevel.user,
        constants.accountLevel.manager,
      ],
      default: constants.accountLevel.user,
      required: true,
    },
    privileges: {
      type: Map,
      of: Array,
    },
    verifyToken: { type: String },
    registrationVia: {
      type: String,
      enum: [
        constants.registrationType.google,
        constants.registrationType.normal,
      ],
      default: constants.registrationType.normal,
    },
    // pan: {
    //   value: { type: Schema.Types.ObjectId, ref: "PAN" },
    //   is_verified: { type: Boolean },
    // },
    // aadhar: {
    //   value: { type: Schema.Types.ObjectId, ref: "Aadhar" },
    //   is_verified: { type: Boolean },
    // },
    availability: {
      type: Boolean,
    },
    registrationNumber: { type: String },
    platform: { type: String },
    points: {type:Number, default: 0,},
    // referral_id: { type: String },
    status: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

userSchema.method("getUserDetail", async function getUserDetail() {
  return {
    _id: this._id,
    profilePicture: this.profilePicture,
    profilePictureUrl: this.profilePictureUrl,
    fullName: this.fullName,
    fname: this.fname,
    lname: this.lname,
    email: this.email,
    username: this.username,
    gender: this.gender,
    dob: await unixTime(this.dob),
    phone: this.phone,
    role: this.role,
    points: this.points,
    is_2FA: this.is_2FA,
    privileges: this.privileges,
    notification: this.notification,
    status: this.status,
    isDeleted: this.isDeleted,
    createdBy: this.createdBy,
    updatedBy: this.updatedBy,
    deletedBy: this.deletedBy,
    createdAt: await unixTime(this.createdAt),
    updatedAt: await unixTime(this.updatedAt),
  };
});

userSchema.method("getAuthDetail", async function getAuthDetail() {
  return {
    email: this.email?.value,
    phone: this.phone?.value,
    fullName:this.fullName,
    role: this.role,
    is_2FA: this.is_2FA,
    privileges: this.privileges,
  };
});

const User = model("user", userSchema);

User.exists({
  "email.value": `admin@sankalp.com`,
}).then(async (data) => {
  if (!data) {
    await User.create({
      fname: "Super",
      lname: "Admin",
      username: await getUsername("admin@sankalp.com"),
      email: {
        value: `admin@sankalp.com`,
      },
      password: await hashPassword("Super@1234"),
      phone: {
        value: "+910101010101",
      },
      role: constants.accountLevel.superAdmin,
      privileges: [
        [
          constants.privileges.user_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.customer_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.notification_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.reward_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.setting_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.feedback_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.payment_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.outlet_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.offer_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.menu_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.notification_setting,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.payment_setting,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.food_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.item_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.variant_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.email_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.cms_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.catalouge_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.cuisine_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.foodtype_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.category_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.ingredients_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.brand_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.booking_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
        [
          constants.privileges.spinner_management,
          [
            constants.rights.read,
            constants.rights.write,
            constants.rights.delete,
          ],
        ],
      ],
    })
      .then((data) => {
        console.log(constants.message.superAdmin);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

export default User;
