import React, {useState} from "react";
import { FaStar } from 'react-icons/fa';
const StarRating = () => {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    return (
        <>
        {[ ...Array(5)].map((star, i) => 
        {
            const ratingValue = i + 1;

          return (
          <label> 
            <input 
                type = "radio" 
                name="ratings" 
                value={ratingValue} 
                onClick={() => setRating(ratingValue)}
                onMouseEnter={()=>setHover(ratingValue)}
                onMouseLeave={()=> setHover(null)}
                />
            <FaStar 
                className="star" 
                color={ratingValue <= (hover || rating) ? "#7209eb" : "#cfaafa"}
                size = {22}/>
          </label>
          )
        })}

      </>
    )
}


export default StarRating