import { NavLink } from 'react-router-dom';
import { Stack, Text, UnstyledButton } from '@mantine/core';
import { IconHome, IconUserPlus } from '@tabler/icons-react';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <Stack gap="md">
      <Text size="lg" fw={600} mb="md">
        Меню
      </Text>
      
      <NavLink to="/" className={({ isActive }) => 
        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
      }>
        <UnstyledButton className={styles.navButton}>
          <IconHome size={18} />
          <span>Главная</span>
        </UnstyledButton>
      </NavLink>

      <NavLink to="/user/create" className={({ isActive }) => 
        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
      }>
        <UnstyledButton className={styles.navButton}>
          <IconUserPlus size={18} />
          <span>Создать пользователя</span>
        </UnstyledButton>
      </NavLink>
    </Stack>
  );
}
