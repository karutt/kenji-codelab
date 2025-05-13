"use client";

import { Box, Button, Center } from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";

function FadeInOnScroll({ children, delay = 0.3 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <Box
            ref={ref}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? "none" : "translateY(40px)"}
            transition={`opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`}>
            {children}
        </Box>
    );
}

const Demo = () => {
    return (
        <Box>
            <Box h='100vh' bg='blue.100' />
            <Box h='100vh' bg='red.100' />
            <Center h='100vh'>
                <FadeInOnScroll>
                    <Button>Show Toast</Button>
                </FadeInOnScroll>
            </Center>
        </Box>
    );
};

export default Demo;
