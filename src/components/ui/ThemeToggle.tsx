"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-800 transition-colors opacity-50" aria-hidden="true" disabled>
                <div className="h-5 w-5 bg-transparent" />
            </button>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600 dark:text-gray-300" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-600 dark:text-gray-300" />
            <span className="sr-only">Toggle theme</span>
        </motion.button>
    );
}
