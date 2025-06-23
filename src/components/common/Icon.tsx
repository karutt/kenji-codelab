import { Flex, Image } from '@chakra-ui/react';

interface IconProps {
    name: string;
    width?: number | string;
    height?: number | string;
    alt?: string;
    m?: number | string;
}

export const Icon = ({ name, width = 100, height = 100, alt = '', m = 0 }: IconProps) => {
    return (
        <Flex align="center" justify="center" w={width} h={height}>
            <Image
                w={width}
                maxW="100%"
                h={height}
                maxH="100%"
                m={m}
                objectFit="cover"
                alt={alt || name}
                src={`/svg/${name}.svg`}
            />
        </Flex>
    );
};
