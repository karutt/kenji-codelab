/* src/features/user/components/ProfileForm.js */
import { Box, Button, Field, Fieldset, Heading, Input, Stack } from "@chakra-ui/react";
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

    return (
        <Box
            as='form'
            onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
            }}>
            <Stack spacing='6' gap={8}>
                <Heading size='lg' textAlign='center'>
                    マイプロフィール
                </Heading>

                <Fieldset.Root size='lg'>
                    <Fieldset.Content>
                        <Field.Root>
                            <Field.Label>ニックネーム</Field.Label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>アバター画像URL</Field.Label>
                            <Input
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder='https://example.com/avatar.png'
                            />
                        </Field.Root>

                        {status === "error" && (
                            <Box color='red.500' fontSize='sm'>
                                プロフィールの更新に失敗しました。
                            </Box>
                        )}
                        {status === "success" && (
                            <Box color='green.500' fontSize='sm'>
                                プロフィールを更新しました。
                            </Box>
                        )}
                    </Fieldset.Content>
                </Fieldset.Root>

                <Button type='submit' colorScheme='blue' isLoading={loading} w='full'>
                    更新する
                </Button>
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
