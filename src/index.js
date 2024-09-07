import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
import "./index.css";
import App from "./App";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
      <p>This move rating {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App/>
    {/* <StarRating
      maxRating={5}
      message={["terrible", "bad", "okey", "good", "excellent"]}
    />
    <StarRating
      maxRating={5}
      size={24}
      color="red"
      className="test"
      defaultRating={3}
    />
    <Test /> */}
  </React.StrictMode>
);
