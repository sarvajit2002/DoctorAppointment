const userModel = require('../model/userModel')
const doctorModel = require('../model/dataModel')
const appointmentModel = require('../model/appointmentModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require ('moment')
const registerController = async (req,res) => {
    try {
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message:"User already exists",success:false})
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(200).send({message:"Register Successfully",success: true})
    } catch (error) {
        console.log(error);
        res.status(200).send({success:false,message:`Register Controller ${error.message}`})
    }
}
const loginController = async (req,res) => {
  try {
    const user = await userModel.findOne({email:req.body.email})
    if(!user){
        return res.status(200).send({success:false,message:"user not found"})
    }
    const isMatch = await bcrypt.compare(req.body.password,user.password)
    if(!isMatch){
        return res.status(200).send({message:"Invalid email or password",success:false})
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
    res.status(200).send({message:"Login Success",success:true,token})
  } catch (error) {
     console.log(error);
     res.status.send({message:`Error in Login ctrl ${error.message}`})
  }
}
const authcontroller = async (req,res)=>{
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(201).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

const applydoctorcontroller = async (req,res) => {
   try {
     const newdoctor = await doctorModel({...req.body,status:'pending'})
     await newdoctor.save()
     const adminUser = await userModel.findOne({isAdmin:true})
     const notification = adminUser.notification
     notification.push({
        type:'apply-doctor-request',
        message:`${newdoctor.firstName} ${newdoctor.lastName} has applied for a Doctor Account`,
        data:{
            doctorId:newdoctor.id,
            name:newdoctor.firstName + " " + newdoctor.lastName,
            onClickPath: '/admin/doctors'
        }
     })   
     await userModel.findByIdAndUpdate(adminUser._id,{notification})
     res.status(201).send({
        success:true,
        message:"Doctor Account Applied Successfully"
     })
   } catch (error) {
     console.log(error);
     res.status(500).send({
        success:false,
        error,
        message:'Error while applying for doctors'
     })
   }
}

const getAllNotificationcontroller = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Notification",
      success: false,
      error,
    });
  }
};


const deleteAllNotificationcontroller = async(req,res) => {
  try {
    const user = await userModel.findOne({_id:req.body.userId})
    user.notification = []
    user.seennotification = []
    const updateUser = await user.save()
    updateUser.password = undefined
    res.status(200).send({
      success:true,
      message:"Notification deleted Successfully",
      data:updateUser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"unable to delete all notifications",
      error
    })
  }
}

const getAllDoctorsController = async (req,res) => {
  try {
    const doctors = await doctorModel.find({status:"Approved"})
    res.status(200).send({
      success:true,
      message:'Doctor Info fetched Successfully',
      data:doctors
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while fetching doctors"
    })
  }
}

const bookAppointmentController = async (req,res) => {
 try {
  req.body.date = moment(req.body.date,"DD-MM-YYYY").toISOString();
  req.body.time = moment(req.body.time,'HH:mm').toISOString();
   req.body.status = 'pending'
  const newAppointment = new appointmentModel(req.body)
  await newAppointment.save()
  const user = await userModel.findOne({_id:req.body.doctorInfo.userId})
  user.notification.push({
    type:'New-Appointment-request',
    message:`A New Appointment Request from ${req.body.userInfo.name}`,
    onClickPath:'/user/appointments'
  })
  await user.save()
  res.status(200).send({
    success:true,
    message:'Appointment Book Successfully'
  })
 } catch (error) {
   console.log(error);
   res.status(500).send({
    success:false,
    error,
    message:'Error while booking appointment'
   })
 }
}
const bookingAvailabilityController = async (req,res) => {
  try {
    const date = moment(req.body.date,'DD-MM-YYYY').toISOString()
    const fromTime = moment(req.body.time,'HH:mm').subtract(1,'hours').toISOString()
    const toTime = moment(req.body.time,'HH:mm').add(1,'hours').toISOString()
    const doctorId = req.body.doctorId
    const appointments = await appointmentModel.findOne({doctorId,date,time:{
      $gte:fromTime,$lte:toTime
    }})
    if(appointments !== null && appointments.length > 0){
      return res.status(200).send({
        message:"Appointments not available at this time",
        success:false
      })
    }else{
      return res.status(200).send({
        success:true,
        message:'Appointment available'
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:'Error in Loading'
    })
  }
}

const userAppointmentsController = async (req,res) => {
  try {
    const appointmnets = await appointmentModel.find({userId:req.body.userId})
    res.status(200).send({
      success:true,
      message:'User Appointments fetch sucessfully',
      data:appointmnets
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:'Error in User Appointment'
    })
  }
}
module.exports={loginController,registerController,authcontroller,applydoctorcontroller,
  getAllNotificationcontroller,
  deleteAllNotificationcontroller,getAllDoctorsController,bookAppointmentController,bookingAvailabilityController,userAppointmentsController}