'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const keywords = ['Refund', 'Eligibility', 'Exchange', 'Warranty', 'Return'];

export default function DynamicText() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % keywords.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <span style={{
            display: 'inline-block',
            minWidth: '240px',
            color: 'var(--primary)',
            position: 'relative',
            height: '1.2em',
            verticalAlign: 'bottom',
            overflow: 'hidden'
        }}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={keywords[index]}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ position: 'absolute', left: 0, right: 0 }}
                >
                    {keywords[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
