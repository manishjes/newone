import Validator from "validatorjs";
import constants from "../utils/constants";
import User from "../models/user";

import Location from "../models/location";


const validator = async (
  body: any,
  rules: any,
  customMessages: any,
  callback: any
) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

const regex = /^((\+91?)|\+)?[6-9][0-9]{9}$/;
Validator.register(
  "verifyPhone",
  (value: any) => regex.test(value) === true,
  constants.message.invalidPhone
);

Validator.register(
  "OTP",
  (value: any) => value.toString().length === 6,
  constants.message.otpLength
);

const regex1 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
Validator.register(
  "checkPSW",
  (value: any) => regex1.test(value) === true,
  constants.message.invalidPSW
);

Validator.registerAsync(
  "validatePassword",
  async function (value: any, attribute, req, passes) {
    if (value === attribute) {
      passes();
    } else {
      passes(false, constants.message.pswNotMatched);
    }
  },
  ""
);

const regex2 = /^[A-Z\s]*$/i;
Validator.register(
  "checkString",
  (value: any) => regex2.test(value) === true,
  constants.message.invalidValue
);

const regex3 = /^[A-Z]+$/i;
Validator.register(
  "checkPlainString",
  (value: any) => regex3.test(value) === true,
  constants.message.invalidValue
);

Validator.registerAsync(
  "checkEmail",
  async function (value: any, attribute, req, passes) {
    const emailExists = await User.exists({
      "email.value": await value.toLowerCase()
    });
    if (!emailExists) {
      passes();
    } else {
      passes(false, constants.message.emailTaken);
    }
  },
  ""
);

Validator.registerAsync(
  "checkPhone",
  async function (value: any, attribute, req, passes) {
    const phoneExists = await User.exists({ "phone.value": value });
    if (!phoneExists) {
      passes();
    } else {
      passes(false, constants.message.phoneTaken);
    }
  },
  ""
);

Validator.registerAsync(
  "checkPinCode",
  async function (value, attribute, req, passes) {
    const pinExists = await Location.exists({ pinCode: value });
    if (!pinExists) {
      passes(false, constants.message.invalidPinCode);
    } else {
      passes();
    }
  },
  ""
);

const regex4 =
  /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/;
Validator.register(
  "checkISOstring",
  (value: any) => regex4.test(value) === true,
  constants.message.invalidISOstring
);

Validator.registerAsync(
  "checkAge",
  async function (value: any, attribute, req, passes) {
    const today: any = new Date();
    const birth: any = new Date(value);
    const years = new Date(today - birth).getFullYear() - 1970;
    if (years >= 18) {
      passes();
    } else {
      passes(false, constants.message.notOldEnough);
    }
  },
  ""
);

// Validator.registerAsync(
//   "checkAadhar",
//   async function (value: any, attribute, req, passes) {
//     const regex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
//     if (regex.test(value) !== true) {
//       passes(false, constants.message.invalidAadhar);
//     } else if (await checkAadhar(value.toString())) {
//       passes(false, constants.message.aadharTaken);
//     } else {
//       passes();
//     }
//   },
//   ""
// );

// Validator.registerAsync(
//   "checkPan",
//   async function (value: any, attribute, req, passes) {
//     const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     if (regex.test(value) !== true) {
//       passes(false, constants.message.invalidPan);
//     } else if (await checkPan(value.toString())) {
//       passes(false, constants.message.panTaken);
//     } else {
//       passes();
//     }
//   },
//   ""
// );
;

Validator.registerAsync(
  "checkPrivileges",
  async function (value: any, attribute, req, passes) {
    const privileges: any = new Map([
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
        constants.privileges.category_management,
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
    ]);

    const data: any = new Map(value);

    const compareMap = (privileges: any, data: any) => {
      for (const [key, value] of data) {
        if (!privileges.has(key)) {
          passes(false, `The selected privilege ${key} is invalid.`);
          return;
        } else {
          for (let i = 0; i < value.length; i++) {
            if (!privileges.get(key).includes(value[i])) {
              passes(
                false,
                `The selected right ${value[i]} is invalid in privilage ${key}.`
              );
              return;
            }
          }
        }
      }
      passes();
    };

    compareMap(privileges, data);
  },
  ""
);

const regex6 = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/; // /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;
Validator.register(
  "checkGSTNumber",
  (value: any) => regex6.test(value) === true,
  constants.message.invalidGSTNum
);

Validator.registerAsync(
  "checkTime",
  async function (value, attribute, req, passes) {
    const date = new Date();
    if (value < date.toISOString()) {
      passes(false, constants.message.timeIsGreater);
    } else {
      passes();
    }
  },
  ""
);

const regex7 = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
Validator.register(
  "checkVehicleNumber",
  (value: any) => regex7.test(value) === true,
  constants.message.invalidVehicleNumber
);

export default validator;
