"use client";
import { Box } from "@/styles";
import HeroText from "./HeroText";
import SvgBg from "./SvgBg";

const Hero = () => {
    return (
        <Box
            bg='blue'
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            minHeight='100vh'
            overflow='hidden'
            px={3}
            py={5}
            position='relative'>
            <SvgBg />
            <HeroText />
        </Box>
    );
};

export default Hero;
