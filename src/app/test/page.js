"use client";

import { toaster } from "@/components/ui/toaster";
import { Button, Center } from "@chakra-ui/react";

const Demo = () => {
    return (
        <Center h='100vh'>
            <Button
                variant='outline'
                size='sm'
                onClick={() => {
                    toaster.create({
                        description: "File saved successfully",
                        type: "success",
                    });
                }}>
                Show Toast
            </Button>
        </Center>
    );
};

export default Demo;
