import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'

function Comment({commentInfo}) {
  const {state, dispatch} = useContext(UserContext)  
  return (
    <div className="comment">
     {/* redirect to '/profile' if user clicks on his own nickname */}
    <Link to={(commentInfo.user._id._id === state._id)?'/profile' : `/profile/${commentInfo.user._id._id}`} > <h5>{commentInfo.user.nickname}</h5> </Link>
    <p>{commentInfo.comment.body}</p>
  </div>
  )
}

export default Comment
