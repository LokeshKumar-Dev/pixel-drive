import React, { useState } from "react";

export default React.memo(function MemoImage({ src }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <div class="loader" />}
      <img src={src} className="content-box--image" onLoad={handleImageLoad} />
    </>
  );
});
