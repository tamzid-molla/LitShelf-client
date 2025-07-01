import { createContext, useState } from "react";

export const RateContext = createContext();

import React from 'react';

export const RatingContext = ({ children }) => {
    const [ratings, setRatings] = useState([]);
     const [myReview, setMyReview] = useState("");
    const info = {
        ratings,
        setRatings,
        myReview,
        setMyReview,
    }
    return (
        <RateContext value={info}>
            {children}
    </RateContext>
    );
};

export default RatingContext;