import axios from "axios";
import React, { useContext, useEffect } from "react";
import { RateContext } from "../../context/RatingContext";
import SingleRating from "./SingleRating";
import { AuthContext } from "../../context/FirebaseContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Rating = ({ book_id }) => {
  const { user } = useContext(AuthContext);
  const { setMyReview } = useContext(RateContext);
  const { ratings, setRatings } = useContext(RateContext);
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    axiosSecure(`/rating/${book_id}`).then((data) => {
      setRatings(data.data);
    });
  }, [book_id, setRatings,axiosSecure]);

  useEffect(() => {
    setMyReview(
      ratings.find((r) => r.reviewer_email === user.email)?.review || ""
    );
  }, [ratings, user.email, setMyReview]);

  return (
    <div>
      <div className="flex gap-5 items-center mb-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
      </div>
      <div className="">
        {ratings.length === 0 ? (
          <p className="text-lg font-bold border py-5 px-2 rounded-lg">
            No rating yet
          </p>
        ) : (
          <>
            {ratings.map((rating) => (
              <SingleRating
                key={rating._id}
                SingleRating={rating}></SingleRating>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Rating;
