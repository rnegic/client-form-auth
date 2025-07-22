import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Stack, Group } from '@mantine/core';
import { Formik, Form, Field } from 'formik';
import { notifications } from '@mantine/notifications';
import { useCreateUser } from '@/shared/lib';
import { createUserSchema, generateFullName } from '@/shared/lib/validation';
import type { CreateUserRequest } from '@/shared/types';
import styles from './CreateUserPage.module.css';

export function CreateUserPage() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const initialValues: CreateUserRequest = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    fullName: '',
  };

  const handleSubmit = async (values: CreateUserRequest) => {
    try {
      await createUser.mutateAsync(values);
      notifications.show({
        title: 'Успешно',
        message: 'Пользователь создан',
        color: 'green',
      });
      navigate('/');
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать пользователя',
        color: 'red',
      });
    }
  };

  return (
    <div className={styles.container}>
      <Container size="md">
        <Paper withBorder shadow="md" p={30} radius="md">
          <Title order={2} mb="xl" ta="center">
            Создание пользователя
          </Title>
          
          <Formik
            initialValues={initialValues}
            validationSchema={createUserSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form>
                <Stack gap="md">
                  <Field name="email">
                    {({ field }: any) => (
                      <TextInput
                        {...field}
                        label="Email"
                        placeholder="your@email.com"
                        required
                        error={touched.email && errors.email}
                      />
                    )}
                  </Field>

                  <Group grow>
                    <Field name="firstName">
                      {({ field }: any) => (
                        <TextInput
                          {...field}
                          label="Имя"
                          placeholder="Иван"
                          required
                          error={touched.firstName && errors.firstName}
                          onChange={(e) => {
                            field.onChange(e);
                            const fullName = generateFullName(e.target.value, values.lastName);
                            setFieldValue('fullName', fullName);
                          }}
                        />
                      )}
                    </Field>

                    <Field name="lastName">
                      {({ field }: any) => (
                        <TextInput
                          {...field}
                          label="Фамилия"
                          placeholder="Иванов"
                          required
                          error={touched.lastName && errors.lastName}
                          onChange={(e) => {
                            field.onChange(e);
                            const fullName = generateFullName(values.firstName, e.target.value);
                            setFieldValue('fullName', fullName);
                          }}
                        />
                      )}
                    </Field>
                  </Group>

                  <Field name="fullName">
                    {({ field }: any) => (
                      <TextInput
                        {...field}
                        label="Полное имя"
                        placeholder="Иван Иванов"
                        required
                        error={touched.fullName && errors.fullName}
                      />
                    )}
                  </Field>

                  <Field name="password">
                    {({ field }: any) => (
                      <PasswordInput
                        {...field}
                        label="Пароль"
                        placeholder="Ваш пароль"
                        required
                        error={touched.password && errors.password}
                      />
                    )}
                  </Field>

                  <Field name="confirmPassword">
                    {({ field }: any) => (
                      <PasswordInput
                        {...field}
                        label="Подтверждение пароля"
                        placeholder="Повторите пароль"
                        required
                        error={touched.confirmPassword && errors.confirmPassword}
                      />
                    )}
                  </Field>

                  <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={() => navigate('/')}>
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      loading={isSubmitting || createUser.isPending}
                    >
                      Создать
                    </Button>
                  </Group>
                </Stack>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </div>
  );
}
