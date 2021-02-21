const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');


//@desc       Get all bootcamps
//@route      Get /api/v1/bootcamps
//@access     Public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{


    let query;
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

   
    
        const bootcamps = await Bootcamp.find(req.query);
        
        res
            .status(200)
            .json({success: true, count: bootcamps.length, data: bootcamps });

    
    
   
});

//@desc       Get single bootcamps
//@route      Get /api/v1/bootcamps/:id
//@access     Public
exports.getBootcamp =asyncHandler( async (req,res,next) =>{
  
       const bootcamp = await Bootcamp.findById(req.params.id);

       if ( ! bootcamp ){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
       }
       res.status(200).json({ success:true, data: bootcamp });


  
})

//@desc       Create new bootcamp
//@route      Post /api/v1/bootcamps
//@access     Public
exports.createBootcamp = asyncHandler (async (req,res,next) =>{
 
      const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
        success: true,
        data: bootcamp
    });

 
});
//@desc       Update bootcamp
//@route      Put /api/v1/bootcamps/:id
//@access     Private
exports.updateBootcamp = asyncHandler(async (req,res,next) =>{

   
        const  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidatorts:true
    });
    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
    }
    res.status(200).json({ sucess:true, data: bootcamp })


  
    
    
});

//@desc       Delete single bootcamps
//@route      DELETE /api/v1/bootcamps/:id
//@access     Private
exports.deleteBootcamp = asyncHandler (async (req,res,next) =>{
   
        const  bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }
    res.status(200).json({ sucess:true, data: {} });

        
   
    
});

//@desc       Get bootcamps within a radius
//@route      GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access     Private
exports.getBootcampsInRadius = asyncHandler (async (req,res,next) =>{
   
   const { zipcode, distance } = req.params;

   //Get lat/lng from geocoder
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;

   //Calc radius using radians
   //Divide dist by radius of Earth
   //Earth Radius = 3,963 mi / 6,378 km
   const radius = distance / 3963;
   
   
   const bootcamps = await Bootcamp.find({

        location : { $geoWithin: { $centerSphere: [[ lng, lat], radius] } }

   });

   res.status(200).json({
       success: true,
       count: bootcamps.length,
       data: bootcamps
   })
   


});