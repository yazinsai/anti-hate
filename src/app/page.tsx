'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function Page() {
  const [logoOpacity, setLogoOpacity] = React.useState(1);

  return (
    <div>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1, delay: 1 }}
        onAnimationComplete={() => setLogoOpacity(0)}
        className='grid place-items-center bg-black text-white w-full h-full inset-0 absolute'
      >
      </motion.div>

      <motion.div
        className='grid place-items-center h-screen relative z-1'
        initial={{ opacity: 1, x: "25px" }}
        animate={{ opacity: logoOpacity, x: "0px" }}
        transition={{ duration: .3, delay: 1 }}
      >
        <img src="/logo.svg" />
      </motion.div>
    </div>
  );
}