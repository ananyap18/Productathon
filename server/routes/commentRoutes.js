const { Router } = require('express')
const { requireAuth, checkUser} = require('../middleware/authMiddleware')
const router = Router()
const Comment = require('../models/Comment')
const User = require('../models/User')

// get all comments of a post
router.get('/allComments/:post_id', requireAuth, async(req, res) => {
  try{
    let responseArr = []
    const postId = req.params['post_id'].trim()
    const comments = await Comment.find({commentedOn: postId}).populate("commentedOn", "_id body title commentedBy").sort('-createdAt')
    // modified version of ForEach loop for async function
    for(const comment of comments){
      const user = await User.find({_id: comment.commentedBy}).populate("_id", "_id email nickname")
      const response = {comment,user: user[0]}
      responseArr.push(response)          
    }
    res.status(200).json(responseArr)
  }catch(err){
    console.log(err.message)
    res.status(500)
  }
})

// post a comment 
router.post('/addComment/:post_id', requireAuth, checkUser, async(req, res) => {
  const postId = req.params['post_id']
  const user = req.user
  const { body } = req.body
  try{
    const comment = await Comment.create({ body, reacts: [], commentedBy: user, commentedOn: postId})
    res.status(200).json({commentId: comment._id})
  }catch(err){
    console.log(err)
    res.status(500)
  }
})

router.delete('/deletecomment/:comment_id', requireAuth, checkUser, async (req, res) => {
  const commentId = req.params.comment_id.trim()
  try {
    const comment = await Comment.find({ _id: commentId }).populate("commentedBy", "_id")
    // user who posted, can only delete
    if(comment.commentedBy._id.toString() === req.user._id.toString()){
      comment.remove().then(result => {
        res.status(200).send({
          message: "sucessfully removed"
        }).catch(e => {
          res.status(404).send(e.message)
        })
      })
    }else{
      res.status(400).json({error: "user is not authorized to deleted this comment"})
    }
  }
  catch (err) {
    res.status(500)
  }
})

module.exports = router;