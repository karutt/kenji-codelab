import { Box, Heading, Text } from '@chakra-ui/react';

export default function OfflinePage() {
    return (
        <Box maxW="2xl" mx="auto" p={8}>
            <Heading mb={4}>オフライン機能</Heading>
            <Text>
                PWA（Progressive Web App）機能により、このアプリはオフラインでも動作します。 Service
                Workerがインストールされ、キャッシュ機能が有効になっています。
            </Text>
        </Box>
    );
}
