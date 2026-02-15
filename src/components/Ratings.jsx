// 1st solution


// import React, { useState } from "react";
// import { FaStar } from "react-icons/fa";

// const StarRating = ({handleRatingChange}) => {
//   const [rating, setRating] = useState(null);
//   const [hover, setHover] = useState(null);
// console.log(handleRatingChange)
//   return (
//     <div className="flex items-center">
//       {[...Array(5)].map((star, index) => {
//         const currentRatingValue = index + 1;

//         return (
//           <label key={index}>
//             {/* Radio input for accessibility and form submission */}
//             <input
//               type="radio"
//               name="rating"
//               value={currentRatingValue}
//               onClick={() => setRating(currentRatingValue)}
//               className="hidden" // Hide the actual radio button
//               aria-label={`${currentRatingValue} star`}
//             />
//             {/* Star icon with dynamic styling for color and cursor */}
//             <FaStar
//               className={`cursor-pointer w-6 h-6 transition-colors ${
//                 currentRatingValue <= (hover || rating)
//                   ? "text-yellow-400" // Active color
//                   : "text-gray-400" // Inactive color
//               }`}
//               onMouseEnter={() => setHover(currentRatingValue)}
//               onMouseLeave={() => setHover(null)}
//             />
//           </label>
//         );
//       })}
//       {/* Optional: Display the selected rating */}
//       {/* {rating && <div className="ml-4 text-gray-700">You rated: {rating} stars</div>} */}
//     </div>
//   );
// };

// export default StarRating;





// 2nd solution


// import React, { useState } from "react";
// import { FaStar } from "react-icons/fa";

// const StarRating = ({ handleRatingChange }) => {
//   const [rating, setRating] = useState(null);
//   const [hover, setHover] = useState(null);

//   const handleClick = (value) => {
//     setRating(value);
//     handleRatingChange(value); // Call the parent's handler with the selected rating
//   };

//   return (
//     <div className="flex items-center">
//       {[...Array(5)].map((star, index) => {
//         const currentRatingValue = index + 1;

//         return (
//           <label key={index}>
//             <input
//               type="radio"
//               name="rating"
//               value={currentRatingValue}
//               onClick={() => handleClick(currentRatingValue)}
//               className="hidden"
//               aria-label={`${currentRatingValue} star`}
//             />
//             <FaStar
//               className={`cursor-pointer w-6 h-6 transition-colors ${
//                 currentRatingValue <= (hover || rating)
//                   ? "text-yellow-400"
//                   : "text-gray-400"
//               }`}
//               onMouseEnter={() => setHover(currentRatingValue)}
//               onMouseLeave={() => setHover(null)}
//             />
//           </label>
//         );
//       })}
//     </div>
//   );
// };

// export default StarRating;


// 3rd solution


// import React, { useState } from "react";
// import { FaStar } from "react-icons/fa";

// const StarRating = ({ handleRatingChange, initialRating = 0 }) => {
//   const [rating, setRating] = useState(initialRating);
//   const [hover, setHover] = useState(null);

//   const handleClick = (value) => {
//     // If clicking the same rating, clear it (toggle off)
//     const newRating = value === rating ? 0 : value;
//     setRating(newRating);
//     handleRatingChange(newRating);
//   };

//   return (
//     <div className="flex flex-col items-start space-y-2">
//       <div className="flex items-center">
//         {[...Array(5)].map((star, index) => {
//           const currentRatingValue = index + 1;

//           return (
//             <label key={index}>
//               <input
//                 type="radio"
//                 name="rating"
//                 value={currentRatingValue}
//                 onClick={() => handleClick(currentRatingValue)}
//                 className="hidden"
//                 aria-label={`${currentRatingValue} star`}
//               />
//               <FaStar
//                 className={`cursor-pointer w-6 h-6 transition-colors ${
//                   currentRatingValue <= (hover || rating)
//                     ? "text-yellow-400"
//                     : "text-gray-400"
//                 }`}
//                 onMouseEnter={() => setHover(currentRatingValue)}
//                 onMouseLeave={() => setHover(null)}
//               />
//             </label>
//           );
//         })}
//         {rating > 0 && (
//           <button 
//             onClick={() => handleClick(0)} 
//             className="ml-2 text-xs text-blue-500 hover:text-blue-700"
//           >
//             Clear
//           </button>
//         )}
//       </div>
//       {rating > 0 && (
//         <p className="text-sm text-gray-600">
//           Showing {rating}+ stars
//         </p>
//       )}
//     </div>
//   );
// };

// export default StarRating;



// 4th solution

import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ handleRatingChange, initialRating = 0, availableRatings = [] }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (value) => {
    const newRating = value === rating ? 0 : value;
    setRating(newRating);
    handleRatingChange(newRating);
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starValue) => {
          // Check if this rating value is available in the current category
          const isAvailable = availableRatings.includes(starValue);
          
          return (
            <label key={starValue}>
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => isAvailable && handleClick(starValue)}
                className="hidden"
                disabled={!isAvailable}
                aria-label={`${starValue} star`}
              />
              <FaStar
                className={`w-6 h-6 transition-colors ${
                  !isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  starValue <= (hover || rating)
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
                onMouseEnter={() => isAvailable && setHover(starValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>
      {rating > 0 && (
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-gray-600">
            Showing {rating}+ stars
          </p>
          <button 
            onClick={() => handleClick(0)} 
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default StarRating;