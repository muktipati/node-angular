const Post = require("../models/post");
exports.createPosts = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host")
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });

    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
}
exports.updatePosts = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
     const url = req.protocol+'://'+req.get("host")
     imagePath = url+"/images/"+req.file.filename
    }
   const post = new Post({
     _id: req.body.id,
     title: req.body.title,
     content: req.body.content,
     imagePath:imagePath,
     creator:req.userData.userId
   });
   Post.updateOne({ _id: req.params.id,creator:req.userData.userId}, post).then(result => {
     if(result.n >0){
       res.status(200).json({ message: "Update successful!" });
     }
    res.status(401).json({message:"Unauthorized"})
   })
   .catch((error)=>{
     res.status(500).json({
       message:"Couldn't updated post!"
     })
   })
 }
 
 exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    
    const postQyery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
      postQyery
      .skip(pageSize*(currentPage-1))
      .limit(pageSize)
    }
    postQyery.then(documents => {
      fetchedPosts = documents;
    return Post.count()
    }).then(count =>{
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxCount:count
      });
    })
    .catch((erroe)=>{
      res.status(500).json({message:"Fatched Faild!"})
    });
  }

  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    }).catch((erroe)=>{
      res.status(500).json({message:"Fatched Faild!"})
    });
  }

  exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id,creator:req.userData.userId}).then(result => {
      if(result.n >0){
        res.status(200).json({ message: "Post deleted!" });
      }
      res.status(401).json({message: "unthrozied"})
      
    }).catch((erroe)=>{
      res.status(500).json({message:"Fatched Faild!"})
    });
  }