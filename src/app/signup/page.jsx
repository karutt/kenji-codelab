"use client";
import { auth } from "@/utils/firebase";
import { Box, Button, Field, Fieldset, Heading, Input, Stack } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const DEFAULT_AVATAR_URL = "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("パスワードが一致しません。");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1) メール／パスワードでユーザー作成
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // 2) Auth プロファイルを更新（デフォルトのアバターURLを設定）
            await updateProfile(user, {
                displayName,
                photoURL: DEFAULT_AVATAR_URL,
            });

            // 3) 登録完了後トップにリダイレクト
            router.replace("/");
        } catch (err) {
            console.error(err);
            setError(
                "登録に失敗しました。既に登録済みのメールアドレスか、パスワードが弱すぎる可能性があります。"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box minH='100vh' bg='gray.50' py={12}>
            <Box w='full' maxW='md' mx='auto' p={8} bg='white' borderRadius='xl' boxShadow='lg'>
                <Heading size='lg' mb={6} textAlign='center'>
                    サインアップ
                </Heading>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={6}>
                        <Fieldset.Root size='lg'>
                            <Fieldset.Content>
                                {/* ニックネーム */}
                                <Field.Root>
                                    <Field.Label>ニックネーム</Field.Label>
                                    <Input
                                        name='displayName'
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder='表示名を入力'
                                        required
                                    />
                                </Field.Root>

                                {/* メールアドレス */}
                                <Field.Root>
                                    <Field.Label>メールアドレス</Field.Label>
                                    <Input
                                        name='email'
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete='email'
                                        required
                                    />
                                </Field.Root>

                                {/* パスワード */}
                                <Field.Root>
                                    <Field.Label>パスワード</Field.Label>
                                    <Input
                                        name='password'
                                        type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete='new-password'
                                        required
                                    />
                                </Field.Root>

                                {/* パスワード（確認） */}
                                <Field.Root>
                                    <Field.Label>パスワード（確認）</Field.Label>
                                    <Input
                                        name='confirmPassword'
                                        type='password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete='new-password'
                                        required
                                    />
                                </Field.Root>

                                {error && (
                                    <Box color='red.500' fontSize='sm' mt={2}>
                                        {error}
                                    </Box>
                                )}
                            </Fieldset.Content>
                        </Fieldset.Root>

                        <Button type='submit' colorScheme='blue' w='full' isLoading={isSubmitting}>
                            サインアップ
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
}
