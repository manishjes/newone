import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import mongoose from "mongoose";
import message from "./spinConstant";
import Spin from "../../../models/spin";
import User from "../../../models/user";
import RewardPOint from "../../../models/rewardPoint";
import Reward from "../../../models/reward";
import EarnPoint from "../../../models/earnRewardPOint";


const spin = async (req: any, res: Response, next: NextFunction) => {
  try {
    Spin.find(
      { isDeleted: false },
      { _id: 1, spinValue: 1, }
    )
      .then((data) => {
        if (!data.length) {
          throw {
            statusCode: constants.code.internalServerError,
            msg: constants.message.internalServerError,
          };
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.spinData,
            data: data,
          });
        }
      })
      .catch((err: any) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
}

const spinStatus = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userTime = await RewardPOint.findOne({ userId: new mongoose.Types.ObjectId(req.id) }, { createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(1);

    const spinTime = userTime?.createdAt;
    console.log(spinTime)
    const currentTime = new Date();

    let useStatus = false;

    if (spinTime) {
      const timeDiff = currentTime.getTime() - spinTime.getTime();
      const timeDiffInHours = timeDiff / (1000 * 3600);
      if (timeDiffInHours > 24) {
        useStatus = true;
      }
    } else {
      useStatus = true;
    }

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      userStatus: req.status,
      message: constants.message.success,
      data: {
        spinstatus: useStatus,
      },
    });
  } catch (error) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: error,
    });
  }
};

const addPoint = async (req: any, res: Response, next: NextFunction) => {
  try {

    RewardPOint.create(

      {
        userId: new mongoose.Types.ObjectId(
          req.id),
        points: req.body.points,
        activity: "by spin wheel",
        pointStatus: "added"
      },
    )
      .then((data) => {
        if (!data) {
          throw {
            statusCode: constants.code.internalServerError,
            msg: constants.message.internalServerError,
          };
        } else {
          User.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.id),
              isDeleted: false,
            },
            { $inc: { points: req.body.points } },
            {
              upsert: true,
              new: true
            }
          )
            .then(async (data) => {
              if (!data) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {

                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.pointAdded,
                });
              }
            })
            .catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.msg,
              });
            });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
}


const getPOints = async (req: any, res: Response, next: NextFunction) => {
  try {
    RewardPOint.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.id),
          isDeleted: false,

        },
      },

      {
        $lookup: {
          from: "users",
          let: { userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
                isDeleted: false,
              },
            },
          ],
          as: "userDetail",
        },
      },
      {
        $unwind: {
          path: "$userDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          existingPoint: { $first: "$userDetail.points" },
          data: {
            $push: {
              points: "$points",
              pointStatus: "$pointStatus",
              createdAt: "$createdAt",
              activity: "$activity",
            }
          },
          totalPoints: { $sum: { $cond: { if: { $eq: ["$pointStatus", "added"] }, then: "$points", else: 0 } } },
          usedPoints: { $sum: { $cond: { if: { $eq: ["$pointStatus", "deduction"] }, then: "$points", else: 0 } } },
        },
        

      },
      
      {
        $unwind: {
          path: "$data",
          preserveNullAndEmptyArrays: true,
        },
      },
      
      {
        $sort: { "data.createdAt": -1 }
      },
      
      {
        $group: {
          _id: null,
          existingPoint: { $first: "$existingPoint" },
          totalPoints: { $first: "$totalPoints" },
          usedPOints: {$first: "$usedPoints"},
          data: { $push: "$data" },
        }
      },
    ])
      .then((data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.pointHistory,
            data: data
          });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      });
  }
  catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}

const billPOints = async(req:any, res:Response, next:NextFunction)=>{
  try{
    const rewardData:any = await Reward.findOne({
      isDeleted:false
    }, {minimumAmount: 1, maximumPoints:1, maximumAmount:1, point:1, value:1})

    const userPoints:any = await User.findOne({
      _id: new mongoose.Types.ObjectId(req.id)
    }, {points:1})

    let redempoints =0;
    let rupees =0;
    let pointValue = Math.floor(rewardData.value/rewardData.point)
    if(req.body.amount<=rewardData.minimumAmount){
      // return res.status(constants.code.preconditionFailed).json({
      //   status: constants.status.statusFalse,
      //   message: message.amount,
      // });
      redempoints =0
    } else if (req.body.amount<=rewardData.maximumAmount){
      redempoints = Math.floor((req.body.amount*rewardData.maximumPoints)/rewardData.maximumAmount)
    }
    else{
      redempoints= rewardData.maximumPoints
    }

    if(userPoints?.points<=redempoints){
      // return res.status(constants.code.preconditionFailed).json({
      //   status: constants.status.statusFalse,
      //   message: message.point,
      // });
      rupees=0
      redempoints=0
    }
    else{
      rupees = redempoints*pointValue
    }
    const payamount = (req.body.amount-rupees)
    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      userStatus: req.status,
      message: constants.message.success,
      data: {
        totalBill: req.body.amount,
        redemPoint: redempoints,
        discountAmount: rupees,
        payAmount: payamount
      }
    });
  } catch(err){
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message:err
    })
  }
}

const earnPoint = async(req:any, res:Response, next:NextFunction)=>{
  try{
    const earnPointData:any = await EarnPoint.findOne({
      isDeleted:false
    }, {minimumAmount:1, maximumAmount:1, maximumPoints:1})

    let earnPoints = 0;

    if(req.body.amount<=earnPointData?.minimumAmount){
      earnPoints = 0
    }
    else if(req.body.amount<= earnPointData?.maximumAmount){
      earnPoints = Math.floor((req.body.amount*earnPointData?.maximumPoints)/earnPointData?.maximumAmount)
    }
    else{
      earnPoints = earnPointData?.maximumPoints
    }

    if(earnPoints>0){

   await RewardPOint.create(

      {
        userId: new mongoose.Types.ObjectId(
          req.id),
        points: earnPoints,
        activity: "by pay bill",
        pointStatus: "added"
      },
    )
      .then((data) => {
        if (!data) {
          throw {
            statusCode: constants.code.internalServerError,
            msg: constants.message.internalServerError,
          };
        } else {
          User.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.id),
              isDeleted: false,
            },
            { $inc: { points: earnPoints } },
            {
              upsert: true,
              new: true
            }
          )
            .then(async (data) => {
              if (!data) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {

                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.pointOnPayBill,
                  data: {
                    earnPoints:earnPoints
                  }
                });
              }
            })
            .catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.msg,
              });
            });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      });
    }
    else{
      res.status(constants.code.success).json({
        status: constants.status.statusTrue,
        userStatus: req.status,
        message: message.pointOnPayBill,
        data: {
          earnPoints:earnPoints
        }
      });
    }


  } catch(err){
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message:err
    })
  }
}


export default {
  spin,
  addPoint,
  spinStatus,
  getPOints,
  billPOints,
  earnPoint
}