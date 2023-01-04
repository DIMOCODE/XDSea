import React, { useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";

function Checkmark({ selected, completed }) {
  return (
    <div style={{ cursor: "pointer" }}>
      <motion.svg
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        width="26"
        height="26"
        viewBox="0 0 26 26"
      >
        {completed ? (
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Check"
            stroke="#FFFFFF"
            stroke-width="2"
          >
            <rect
              id="Circle"
              fill="#1F42F8"
              x="1"
              y="1"
              width="24"
              height="24"
              rx="12"
            />

            <polyline
              id="Line"
              stroke-linecap="round"
              stroke-linejoin="round"
              points="7.09450312 13.6324551 11.2786359 17.4562865 18.8267983 8.45628655"
            />
          </g>
        ) : selected ? (
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Check"
            stroke="rgba(0,0,0,0.26)"
            stroke-width="2"
          >
            <rect
              id="Circle"
              fill="rgba(0,0,0,0.26)"
              x="1"
              y="1"
              width="24"
              height="24"
              rx="12"
            />
          </g>
        ) : (
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Check"
            stroke="#FFFFFF"
            stroke-width="2"
          >
            <rect
              id="Circle"
              fill="rgba(255,255,255,0.26)"
              x="1"
              y="1"
              width="24"
              height="24"
              rx="12"
            />
          </g>
        )}
      </motion.svg>
    </div>
  );
}
export { Checkmark };
