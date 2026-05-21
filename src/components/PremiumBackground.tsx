import React from 'react';
import { motion } from 'framer-motion';

interface PremiumBackgroundProps {
  isPremium: boolean;
}

export const PremiumBackground: React.FC<PremiumBackgroundProps> = ({ isPremium }) => {
  if (!isPremium) return null;

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-premium/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '10%', right: '10%' }}
        />

        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 100, -80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ bottom: '10%', left: '10%' }}
        />

        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-br from-accent-purple/15 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, -100, 0],
            y: [0, -80, 100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '50%', left: '50%' }}
        />
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-premium/5 via-transparent to-accent/5 animate-grid-pulse" />
      </div>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-premium rounded-full"
            animate={{
              y: [0, -window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: '100%',
            }}
          />
        ))}
      </div>
    </>
  );
};
