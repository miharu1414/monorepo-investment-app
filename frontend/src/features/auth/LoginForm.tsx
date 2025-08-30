import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      message
    }
  }
`;

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.success) {
        localStorage.setItem('token', data.login.token);
        toast({
          title: 'ログイン成功',
          description: data.login.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/');
      } else {
        toast({
          title: 'ログイン失敗',
          description: data.login.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'エラーが発生しました',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        variables: {
          username: email,
          password: password,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%" maxW="md">
      <Stack spacing={4}>
        <FormControl id="email" isRequired>
          <FormLabel>メールアドレス</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>パスワード</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          fontSize="md"
          isLoading={loading}
        >
          ログイン
        </Button>

        <Text align="center" color="gray.500">
          テストアカウント：
          <br />
          Email: test@example.com
          <br />
          Password: password
        </Text>
      </Stack>
    </Box>
  );
};
