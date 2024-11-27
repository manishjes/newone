// Messages
const message = {
    dbConnect: "MONGODB::Connected to database.",
    clConnect: "MONGODB::Connected to cluster.",
    retry: "Kindly Re-try After 10 Seconds.",
    success: "Success",
    failed: "failed",
    dataNotFound: "Data not found.",
    internalServerError: "Internal server error. Please try after some time.",
    unAuthAccess: "Unauthorized access.",
    reqAccessKey: "Access Key is required.",
    invalidAccesskey: "Invalid Access Key.",
    unwantedData: "Unwanted data found.",
    invalidEmail: "Invalid email address.",
    invalidPhone: "Invalid phone number.",
    superAdmin: "Super Admin Created Successfully.",
    otpLength: "OTP length should be 6 digits.",
    otpSent:
      "A mail/message with 4 digit verification code is sent successfully.",
    otpMessageSent:
      "A message with 4 digit verification code is sent successfully.",
    otpMailSent: "A mail with 4 digit verification code is sent successfully.",
    invalidOTP: "Invalid OTP.",
    otpExpire:
      "The code has expired. Please re-send the verification code to try again.",
    otpSuccess: "Code verified successfully.",
    invalidAuthToken: "Invalid authentication token.",
    invalidVerifyToken: "Invalid verification token.",
    tokenExpire:
      "The token has expired. Please re-send the verification token to try again.",
    tokenSuccess: "Token verified successfully.",
    reqAccessToken: "Access Token is required.",
    invalidAccessToken: "Invalid Access Token.",
    emailTaken: "Email is already taken.",
    phoneTaken: "Phone number is already taken.",
    invalidPinCode: "Not a valid pincode.",
    invalidPSW: "Invalid password.",
    pswNotMatched: "The password confirmation does not match.",
    invalidValue: "Invalid value.",
    userSuccess: "Registered successfully.",
    invalidPassword: "Invalid password.",
    userInactive: "Your account is disabled.",
    userDeleted: "Your account is suspended.",
    invalidUser: "You are not a valid user.",
    userLogin: "User logged in successfully.",
    userDetail: "User details get successfully.",
    userUpdate: "User details updated successfully.",
    userDisable: "Your Account deactivated successfully.",
    userRemove: "Your Account deleted successfully.",
    logout: "Logout successfully.",
    logoutAll: "Logout from all devices successfully.",
    resetEmail: "A mail with reset link sent successfully.",
    reqProfilePic: "Profile Picture is required.",
    reqProductImages: "Product images is required.",
    diffPassword: "New password should be different from old password.",
    invalidOldPassword: "Invalid old password.",
    passChange: "Password changed Successfully.",
    twoFactoreOn: "Two-factor authentication turn on successfully.",
    twoFactorOff: "Two-factor authentication turn off successfully.",
    invalidType: "The selected type is invalid.",
    profileSuccess: "Profile picture updated successfully.",
    invalidDateTimeFormat: "Invalid date time format.",
    invalidTimeFormat: "Invalid time format.",
    invalidISOstring: "Invalid ISO string.",
    notOldEnough: "You must be of age 18 years or above.",
    emailVerified: "Email verified successfully.",
    phoneVerified: "Phone verified successfully.",
    emailUpdated: "Email address changed successfully.",
    phoneUpdated: "Phone number changed successfully.",
    addressExist: "Address already exist.",
    pushNotificationOn: "Push notification turn on successfully.",
    pushNotificationOff: "Push notification turn off successfully.",
    emailNotificationOn: "Email notification turn on successfully.",
    emailNotificationOff: "Email notification turn off successfully.",
    messageNotificationOn: "Message notification turn on successfully.",
    messageNotificationOff: "Message notification turn off successfully.",
    invalidPan: "Invalid pan number.",
    invalidAadhar: "Invalid aadhar number.",
    aadharTaken: "Aadhar Number already taken.",
    verifyEmail: "Kindly, verify your email address and try again.",
    verifyPhone: "Kindly, verify your phone number and try again.",
    panTaken: "Pan is already taken.",
    invalidAccNum: "Invalid account number.",
    invalidGSTNum: "Invalid GST number.",
    invalidIFSCCode: "Not a valid ifsc code.",
    reqVerified: "Kindly, verify your details and try again.",
    invalidCountryId: "Not a valid country_id.",
    invalidFileType: "Invalid file type.",
    excelFileReq: "Excel file is required.",
    recordNotFound: "No records found.",
    columnMissing: "Some of columns are missing.",
    unwantedColumns: "Unwanted columns found.",
    productVerifyReq: "Kindly, verify this product and try again.",
    addressNotLinked: "This address not associated with you.",
    addressVerifyReq: "Kindly, verify this address and try again.",
    timeIsGreater: "Time should be greater than current time.",
    badRequest: "Couldn't parse the specified URI.",
    invalidCategoryId: "Invalid category id.",
    invalidSubCategoryId: "Invalid sub category id.",
    invalidVehicleNumber: "Invalid vehicle number.",
  };
  
  // Response Status
  const status = {
    statusTrue: true,
    statusFalse: false,
  };
  
  // Response Code
  const code = {
    success: 200,
    FRBDN: 403,
    dataNotFound: 404,
    badRequest: 400,
    reqTimeOut: 408,
    unAuthorized: 401,
    PaymentRequired: 402,
    badMethod: 405,
    notAcceptable: 406,
    preconditionFailed: 412,
    unprocessableEntity: 422,
    tooManyRequests: 429,
    internalServerError: 500,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeOut: 504,
    expectationFailed: 417,
  };
  
  // Registration Type
  const registrationType = {
    normal: "normal",
    google: "google",
  };
  
  // email titles
  const emailTitle = {
    otp: "Send OTP",
    resetPassword: "Reset Password",
    credential: "Credential",
    acceptRequest: "Accept Request",
    rejectRequest: "Reject Request",
  };
  
  // sms titles
  const smsTitle = {
    otp: "Send OTP",
  };
  
  // User level
  const accountLevel = {
    superAdmin: 1,
    admin: 2,
    manager:3,
    user: 4,
    
  };
  
  
  
  // Privileges
  const privileges = {
    user_management: "user_management",
    customer_management:"customer_management",
    email_management: "email_management",
    cms_management: "cms_management",
    brand_management: "brand_management",
    outlet_management: "outlet_management",
    catalouge_management: "catalouge_management",
    category_management: "category_management",
    cuisine_management: "cuisine_management",
    foodtype_management: "foodtype_management",
    ingredients_management: "ingredients_management",
    food_management: "food_management",
    item_management: "item_management",
    variant_management: "variant_management",
    menu_management: "menu_management",
    booking_management: "booking_management",
    offer_management: "offer_management",
    payment_management: "payment_management",
    notification_management: "notification_management",
    reward_management: "reward_management",
    feedback_management: "feedback_management",
    setting_management: "setting_management",
    payment_setting: "payment_setting",
    notification_setting: "notification_setting",
    spinner_management:  "spinner_management"
  };
  
  // Rights
  const rights = {
    read: "read",
    write: "write",
    delete: "delete",
  };
  
  // Constraints
  const constraint = {
    primary: "primary",
    secondary: "secondary",
  };
  
  // Address Types
  const addressTypes = {
    home: "home",
    work: "work",
    other: "other",
  };
  
  // Device Types
  const deviceTypes = {
    android: "Android",
    iphone: "iOS",
    web: "web",
  };
  
 
// week day


const week = {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
  sunday: "sunday"
}



  // Product origin
  const productOrigin = {
    oem: "OEM",
    afterMarket: "afterMarket",
  };
  

  
  // Request Status
  const requestStatus = {
    pending: 1,
    approved: 2,
    rejected: 3,
    cancelled: 5
  };

  const discountType = {
    flat: "flat",
    upto: "upto"
  }

  const unit = {
    percentage: "percentage",
    value: "value"
  }
  
  export default {
    message,
    status,
    code,
    emailTitle,
    smsTitle,
    registrationType,
    accountLevel,
    privileges,
    rights,
    constraint,
    addressTypes,
    deviceTypes,
    productOrigin,
    requestStatus,
    week,
    discountType,
    unit
  };
  