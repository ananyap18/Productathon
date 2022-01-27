const { Router } = require('express')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const router = Router()
const Post = require('../models/Post')

// handle errors
const handleErrors = (err) => {

  let errors = { postError: "" }

  // Validation Error
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    })
  }

  return errors
}

router.get('/myposts', requireAuth, checkUser, async (req, res) => {
  try {
    const myPosts = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id email nickname")
    res.status(200).json({ userPosts: myPosts })

  } catch (err) {
    console.log(err)
    res.status(500)
  }
})

// get all the post on the app
router.get('/allposts', requireAuth, checkUser, async (req, res) => {
  try {
    const posts = await Post.find().populate("postedBy", "_id email nickname").sort('-createdAt')
    res.status(200).json( posts )
  } catch (err) {
    console.log(err)
    res.status(500)
  }
})

// get post of all the people that user follow
router.get('/subposts', requireAuth, checkUser, async (req, res) => {
  try {
    const posts = await Post.find({postedBy: {$in: req.user.following}}).populate("postedBy", "_id email nickname").sort('-createdAt')
    res.status(200).json(posts)
  } catch (err) {
    console.log(err)
    res.status(500)
  }
})

router.post('/createpost', requireAuth, checkUser, async (req, res) => {
  const { title, body, photoLink } = req.body
  try {
    const post = await Post.create({ title, body, postedBy: req.user, photoLink })
    res.status(201).json({ post: post._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
})

router.delete('/deletepost/:post_id', requireAuth, checkUser, async (req, res) => {
  const postId = req.params.post_id.trim()
  try {
    const post = await Post.find({ _id: postId }).populate("postedBy", "_id")
    // user who posted, can only delete
    if(post.postedBy._id.toString() === req.user._id.toString()){
      post.remove().then(result => {
        res.status(200).send({
          message: "sucessfully removed"
        }).catch(e => {
          res.status(404).send(e.message)
        })
      })
    }else{
      res.status(400).json({error: "not authorized to deleted this post"})
    }
  }
  catch (err) {
    res.status(500)
  }
})

router.put('/like', requireAuth, checkUser,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

router.put('/unlike', requireAuth, checkUser,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

module.exports = router;