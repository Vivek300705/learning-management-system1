import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'

import User from '../models/User.model.js'
// import Purchase from '../models/Purchase.js'


//update role of user to educator

export const updateRoleToEducator = async(req,res)=>{
    try{
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',
            }
        })
        res.json({success:true,message:'You can publish your course now '})
    }
    catch (error) {
        console.error("Error in updateRoleToEducator:", error);
        res.status(400).json({ success: false, message: error.message });
            }

}


//Add new Course

export const addCourse = async (req,res)=>{
    try {
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId 

        if(!imageFile){
            return res.json({ success : false, message: 'Thumbnail Not Attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse =  await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({success : true, message : 'Course was Added'})

    } catch (error) {

        res.json({success : false, message : error.message})
    }
} 

// Get educator courses 

export const getEducatorCourses = async (req,res)=>{
  try {
    const educator = req.auth.userId

    const courses = await Course.find({educator})

    res.json({ success : true, courses})
  } catch (error) {
     
    res.json({ success : false, message : error.message})
  }
}

// Educator Dashboard 

export const educatorDashboardData = async (req,res)=>{

    try {
        const educator = req.auth.userId;
        const courses  = await Course.find({educator});
        const totalCourses = courses.length ;

        const courseIds = courses.map(course => course._id)

        //calculate total earning from purchases 
        const purchases = await Purchase.find({
            courseId : {$in: courseIds},
            status : 'completed'
        });

        const totalEarnings = purchases.reduce((sum,purchase)=> sum + purchase.amount,0)

        // Collect Unique enrolled student IDs with their course Titles 

        const enrolledStudentsData = [];
        for(const course of courses ){
            const students = await User.find({
                _id: {$in :course.enrolledStudents}
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student 
                });
            });
        }
       res.json({success : true, dashboardData:{
        totalEarnings, enrolledStudentsData, totalCourses
       }})
    } catch (error) {
        res.json({success : false, message : error.message});

    }

}

// get enrolled students data

export const getEnrolledStudentsData = async (req, res)=>{
    try {
         const educator = req.auth.userId;
         const courses  = await Course.find({educator});
         const courseIds = courses.map(course => course._id)

         const purchases = await Purchase.find({
            courseId: { $in :courseIds},
            status : 'completed'
         }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

         const enrolledStudents = pruchase.map(purchase => ({
            student : purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
         }))
      
         res.json({success : true, enrolledStudents})
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}