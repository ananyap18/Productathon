const { Router } = require('express')
const { requireAuth, checkUser} = require('../middleware/authMiddleware')
const router = Router()
const User = require('../models/User')
const Message = require('../models/Message')

// get all of my messages
router.get('/myMessages', requireAuth, checkUser, async(req, res) => {
  try{
    const myMessages = await Message.find({
      recievedBy: req.user._id
    }).populate("sentBy", "_id email nickname")
    res.status(200).json({myMessages})
  }catch(e){
    console.log(e)
    res.status(500)
  }
})

// send message
router.post('/sendMessage/:user_id', requireAuth, checkUser, async (req, res) => {
  const recievedBy = req.params['user_id']
  const sentBy = req.user
  const {body} = req.body
  try{
    const message = await Message.create({ body, recievedBy, sentBy })
    res.status(200).json({messageId: message._id})
  }catch(e){
    console.log(e)
    res.status(500)
  }
})

module.exports = router;