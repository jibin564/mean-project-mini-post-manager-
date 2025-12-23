const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const Posts = require('../models/post');
const multer = require('multer');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }
});



router.post("", checkAuth, multer({storage:storage}).single("image"),(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Posts({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator:req.userData.userId

    })
    post.save().then(createdpost =>{
        res.status(201).json({
        message: 'Post added successfully',
        post:{
            id: createdpost._id,
            title: createdpost.title,
            content: createdpost.content,
            imagePath: createdpost.imagePath
        }
    })
    }).catch(error =>{
        res.status(500).json({message:"creating post failed!"})
    });;  
});

router.put("/:id",checkAuth,multer({storage:storage}).single("image"),(req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }       
     Posts.updateOne({_id: req.params.id, creator:req.userData.userId},
        {
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath
        }
     ).then(result => { 
        if(result.matchedCount === 0){
            return res.status(401).json({message: 'Not authorized!'});         
        }
      res.status(200).json({message: 'Update successful!'});
        
    }).catch(error =>{
        res.status(500).json({message:"Couldn't update post!"})
    });
});

router.get("/:id",checkAuth,(req, res, next) => {
    Posts.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found!'});
        }});   
});

router.get("",(req, res, next) => {
    const pagesize = +req.query.pagesize;
    const currentpage = +req.query.page;
    const postQuery = Posts.find();
    let fetchedPosts;
    if(pagesize && currentpage) {
        postQuery.skip(pagesize * (currentpage - 1)).limit(pagesize);
    }
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Posts.countDocuments();     
    }).then(count => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error =>{
        res.status(500).json({message: "Fetching posts failed!" });
    })
});


router.delete("/:id",checkAuth,(req, res, next) => {
    console.log(req.params.id);
    Posts.deleteOne({_id: req.params.id, creator:req.userData.userId}).then(result => {
       if(result.deletedCount > 0){
            res.status(200).json({message: 'Post deleted!'});
        }else{
            res.status(401).json({message: 'Not authorized!'});
        }
    });
    //res.status(200).json({message: 'Post deleted!'});
});
    




module.exports = router;