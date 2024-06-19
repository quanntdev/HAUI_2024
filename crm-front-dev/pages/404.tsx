import React from "react";

const Custom404Page = (props: any) => {
  return (
    <div
      className="d-flex flex-column algin-items-between justify-content-between"
      style={{ height: "100vh" }}
    >
      <div
        className="d-flex align-items-center justify-content-center h-screen overflow-hidden h-100"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <div className="px-6 py-4 rounded">
          <div className="h-100 text-center">
            <h1>404 Not Found</h1>
            <p>Page Not Found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom404Page;
