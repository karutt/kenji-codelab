/* src/features/user/components/ProfileForm.js */
import {
    Avatar,
    Box,
    Button,
    Center,
    Field,
    Fieldset,
    Heading,
    Input,
    Presence,
    Separator,
    Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";

export default function ProfileForm() {
    const {
        displayName,
        setDisplayName,
        avatarUrl,
        setAvatarUrl,
        status,
        loading,
        logoutLoading,
        handleUpdate,
        handleLogout,
    } = useProfile();

    // Add local state to control message visibility
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        if (status === "error" || status === "success") {
            setShowStatus(true);
            const timer = setTimeout(() => setShowStatus(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <Box
            as='form'
            onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
            }}>
            <Stack spacing='6' gap={2}>
                <Center flexDir='column' gap={6}>
                    <Heading size='3xl'>Your Profile</Heading>
                    <Avatar.Root size='full' w={44} h={44} borderRadius='full'>
                        <Avatar.Fallback name={displayName} />
                        <Avatar.Image src={avatarUrl} />
                    </Avatar.Root>
                </Center>
                <Fieldset.Root size='lg'>
                    <Fieldset.Content>
                        <Field.Root gap={3}>
                            <Field.Label color='gray.600' fontWeight='thin'>
                                Name
                            </Field.Label>
                            <Input
                                value={displayName}
                                border='none'
                                bg='gray.100'
                                _focus={{ borderRadius: 4, bg: "none" }}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                        </Field.Root>

                        <Field.Root gap={3}>
                            <Field.Label color='gray.600' fontWeight='thin'>
                                Avatar Image URL
                            </Field.Label>

                            <Input
                                value={avatarUrl}
                                border='none'
                                bg='gray.100'
                                _focus={{ borderRadius: 4, bg: "none" }}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder='https://example.com/avatar.png'
                            />
                        </Field.Root>

                        <Presence
                            position='fixed'
                            top='90%'
                            right={"2%"}
                            present={showStatus && (status === "error" || status === "success")}
                            animationName={{
                                _open: "slide-from-right, fade-in",
                                _closed: "slide-to-right, fade-out",
                            }}
                            width='300px'
                            animationDuration='moderate'>
                            <Center
                                p='6'
                                borderRadius={"md"}
                                layerStyle='fill.muted'
                                bg={status === "error" ? "red.500" : "green.500"}
                                color='white'
                                fontSize='md'>
                                {status === "error"
                                    ? "プロフィールの更新に失敗しました。"
                                    : status === "success"
                                    ? "プロフィールを更新しました。"
                                    : null}
                            </Center>
                        </Presence>
                    </Fieldset.Content>
                </Fieldset.Root>

                <Button type='submit' colorScheme='blue' isLoading={loading} w='full' mt={3}>
                    更新する
                </Button>

                <Separator my={4} />
                <Button
                    variant='outline'
                    colorScheme='red'
                    onClick={handleLogout}
                    isLoading={logoutLoading}
                    w='full'>
                    ログアウト
                </Button>
            </Stack>
        </Box>
    );
}
