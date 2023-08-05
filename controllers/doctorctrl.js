const doctorModel = require('../model/dataModel')
const appointmentModel = require('../model/appointmentModel')
const userModel = require('../model/userModel')
const getDoctorInfoController = async (req,res) => {
 try {
    const doctor = await doctorModel.find({userId:req.body.userId})
    res.status(200).send({
        success:true,
        message:'doctor data fetch success',
        data:doctor,
    })
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:`Error in fetching doctor details`
    })
 }
}
const updateProfileController = async (req,res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body)
        res.status(201).send({
            success:true,
            message:'doctor profile upload',
            data:doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:`doctor profile update issue`
        })
    }
}
const getDoctorByIdController = async (req,res) => {
    try {
        const doctor = await doctorModel.findOne({_id:req.body.doctorId});
        res.status(200).send({
            success:true,
            message:'Single Doc Info fetched',
            data:doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
         success:false,
         error,
         message:"Error in Single Doct Info"
        })
    }
}
const doctorAppointmentsController = async (req,res) => {
    try {
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        const appointments = await appointmentModel.find({doctorId:doctor._id})
        res.status(200).send({
            success:true,
            message:"Doctor Appoitnment fetch Successfully",
            data:appointments,
            
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in Doc Appointments"
        })
    }
}
const updateStatusController = async (req,res) => {
 try {
    const {appointmentsId,status} = req.body
    const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
    const user = await userModel.findOne({_id:appointments.userId})
    const notification = user.notification
    notification.push({
        type:"status updated",
        message:"your appointment has been updated",
        onClickPath:"/doctor-appointments"
    })
    await user.save();
    res.status(200).send({
        success:true,
        message:"Appointment Status Updated"
    })
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:"Error in Update status"
    })
 }
}
module.exports = {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController}