"use client";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/utils/firebase";
import { Box, Button, Center, Field, Fieldset, Heading, Input, Stack } from "@chakra-ui/react";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // user 情報が取れたらフォームに初期値をセット
    useEffect(() => {
        if (!loading && user) {
            setDisplayName(user.displayName || "");
            setAvatarUrl(user.photoURL || "");
        }
    }, [user, loading]);

    // プロフィール更新
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            await updateProfile(auth.currentUser, {
                displayName,
                photoURL: avatarUrl.trim() || undefined,
            });
            setSuccess("プロフィールを更新しました。");
        } catch (err) {
            console.error(err);
            setError("更新に失敗しました。もう一度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ログアウト
    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    if (loading) {
        return <Box p={8}>読み込み中…</Box>;
    }
    if (!user) {
        router.replace("/login");
        return null;
    }

    return (
        <Center minH='100vh' bg='gray.50' py={12}>
            <Box w='full' maxW='md' mx='auto' p={8} bg='white' borderRadius='xl' boxShadow='lg'>
                <Heading size='lg' mb={6} textAlign='center'>
                    マイプロフィール
                </Heading>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={6}>
                        <Fieldset.Root size='lg'>
                            <Fieldset.Content>
                                <Field.Root>
                                    <Field.Label>ニックネーム</Field.Label>
                                    <Input
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder='表示名を入力'
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

                                {error && (
                                    <Box color='red.500' fontSize='sm' mt={2}>
                                        {error}
                                    </Box>
                                )}
                                {success && (
                                    <Box color='green.500' fontSize='sm' mt={2}>
                                        {success}
                                    </Box>
                                )}
                            </Fieldset.Content>
                        </Fieldset.Root>

                        <Button type='submit' colorScheme='blue' isLoading={isSubmitting} w='full'>
                            更新する
                        </Button>

                        <Button variant='outline' colorScheme='red' onClick={handleLogout} w='full'>
                            ログアウト
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Center>
    );
}
