import { Group, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/shared/lib';

export function Header() {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Group justify="space-between">
      <Text size="xl" fw={600}>
        Управление пользователями
      </Text>
      <Button variant="outline" onClick={handleLogout} loading={logout.isPending}>
        Выйти
      </Button>
    </Group>
  );
}
