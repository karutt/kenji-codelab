'use client';

import { Box } from '@chakra-ui/react';

const Bg = () => {
    return (
        <Box pos="absolute" top={0} left={0} w="100vw" h="100vh" bg="brand.blue">
            <Box pos="absolute" left={0}>
                <svg
                    width="652"
                    height="229"
                    viewBox="0 0 652 229"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M277.042 107.561C389.792 75.077 520.929 102.603 614.737 32.1343C627.896 22.2494 640.244 11.4975 651.826 8.63167e-05L0 0V228.802C94.0309 218.039 180.709 135.316 277.042 107.561Z"
                        fill="#1B1F3B"
                    />
                </svg>
            </Box>
            <Box pos="absolute" right={0} bottom={0}>
                <svg
                    width="822"
                    height="335"
                    viewBox="0 0 822 335"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M568.109 187.844C406.902 253.82 211.075 191.559 66.0296 288.008C44.1111 302.583 21.9683 317.933 0 334.051L821.236 334.051L821.236 0C740.874 67.5282 665.019 148.183 568.109 187.844Z"
                        fill="#F68984"
                    />
                </svg>
            </Box>
        </Box>
    );
};

export default Bg;
