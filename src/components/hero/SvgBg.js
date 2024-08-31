import { Box, Icon } from "@/styles";

const SvgBg = () => (
    <>
        <Box position='absolute' left='-180px' top='-240px' display={["none", "block", "block"]}>
            <Icon name='shark_shape' width='663px' height='100%' />
        </Box>
        <Box position='absolute' right='-100px' bottom='-200px'>
            <Icon name='red_shape' width={624} height='100%' />
        </Box>
        <Box position='absolute' right='0px' bottom='0px'>
            <Icon name='white_shape' width='100vw' height='100%' />
        </Box>
    </>
);

export default SvgBg;
