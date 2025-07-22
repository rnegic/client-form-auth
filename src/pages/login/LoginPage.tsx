import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useLogin } from '@/shared/lib';
import { loginSchema } from '@/shared/lib/validation';
import type { LoginRequest } from '@/shared/types';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const form = useForm<LoginRequest>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        try {
          loginSchema.validateSyncAt('email', { email: value });
          return null;
        } catch (error) {
          return error instanceof Error ? error.message : 'Некорректный email';
        }
      },
      password: (value) => {
        try {
          loginSchema.validateSyncAt('password', { password: value });
          return null;
        } catch (error) {
          return error instanceof Error ? error.message : 'Некорректный пароль';
        }
      },
    },
  });

  const handleSubmit = async (values: LoginRequest) => {
    try {
      await login.mutateAsync(values);
      notifications.show({
        title: 'Успешно',
        message: 'Вы успешно вошли в систему',
        color: 'green',
      });
      navigate('/');
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Неверный email или пароль',
        color: 'red',
      });
    }
  };

  return (
    <div className={styles.container}>
      <Container size={420}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Title ta="center" className={styles.title}>
            Вход в систему
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Пароль"
                placeholder="Ваш пароль"
                required
                {...form.getInputProps('password')}
              />
              <Button 
                type="submit" 
                fullWidth 
                loading={login.isPending}
                mt="xl"
              >
                Войти
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
