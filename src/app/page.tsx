'use client';

import { motion } from 'framer-motion';
import React from 'react';
import AnimatedAppShell from '@/app/components/AnimatedAppShell';

export default function Page() {
  const [showContent, setShowContent] = React.useState(false); // [1
  const [logoOpacity, setLogoOpacity] = React.useState(1);

  return (
    <div>
      <AnimatedAppShell>
        <img src="/logo.svg" />
        <h1 className='text-xl mt-4'>Welcome</h1>
      </AnimatedAppShell>
    </div>
  );
}