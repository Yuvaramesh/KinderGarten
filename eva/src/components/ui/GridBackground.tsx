import React from "react";

interface GridBackgroundDemoProps {
  children: React.ReactNode;
}

const GridBackgroundDemo: React.FC<GridBackgroundDemoProps> = ({
  children,
}) => {
  return (
    <div className="relative  flex h-[100vh] w-full items-center justify-center bg-grid-black/[0.2] ">
      {/* Radial gradient for the container to give a faded look */}
      {children}
      <div className="pointer-events-none absolute inset-0 -z-20  flex items-center justify-center bg-purple-300 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,red)] "></div>
      {/* <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8  font-bold text-transparent "></p> */}
    </div>
  );
};

export default GridBackgroundDemo;
