import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import message from "./spinConstant";
import Spin from "../../../models/spin";
import Outlet from "../../../models/outlet";
import mongoose from "mongoose";


// const addSpinValue = async(req:any, res:Response, next:NextFunction)=>{
//     try{
  
//       const spinValues:any = [];
//       for (let i = 0; i < req.body.spinValues.length; i++) {
//         const spinValue = {
//           value: req.body.spinValues[i].value,
//           probability: req.body.spinValues[i].probability,
//           color: req.body.spinValues[i].color
//         };
//         spinValues.push(spinValue);
//       }
//       Spin.create({
//         spinValue: spinValues,
//         createdBy: req.id
//       }).then((spinData)=>{
//         if(!spinData){
//           throw {
//             statusCode: constants.code.dataNotFound,
//             msg: constants.message.dataNotFound,
//           };
//         }
//         else{
//           res.status(constants.code.success).json({
//             status: constants.status.statusTrue,
//             userStatus: req.status,
//             message: message.addSpinData,
//           });
//         }
//       }).catch((err) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err.msg,
//         });
//       });
//     } catch (err) {
//       res.status(constants.code.internalServerError).json({
//         status: constants.status.statusFalse,
//         userStatus: req.status,
//         message: err,
//       });
//     }
//   }



const updateSpinValue = async(req:any, res:Response, next:NextFunction)=>{
    try{
        const spinValues:any = [];
        for (let i = 0; i < req.body.spinValues.length; i++) {
          const spinValue = {
            value: req.body.spinValues[i].value,
            probability: req.body.spinValues[i].probability,
            color: req.body.spinValues[i].color
          };
          spinValues.push(spinValue);
       }
        Spin.findOneAndUpdate(
            {
                isDeleted: false,
        },
        {
            spinValue: spinValues
        },
        {
          upsert:true,
            new:true
        }
    ).then((spinData)=>{
        if(!spinData){
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        }
        else{
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.updateSpinData,
          });
        }
      }).catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      });
    }  catch (err) {
        res.status(constants.code.internalServerError).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err,
        });
      }
}

const spin = async(req:any, res:Response, next:NextFunction)=>{
    try {
      Spin.find(
        { isDeleted: false },
        { _id: 1, spinValue: 1, }
      )
        .then((data) => {
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: constants.message.success,
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




  export default {
    //addSpinValue,
    updateSpinValue,
    spin
  }