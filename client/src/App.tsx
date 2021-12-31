import { observer } from 'mobx-react-lite';
import React, { FC, useContext, useEffect } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';

const App: FC = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return <div>Загрузка.......</div>
  }

  if (!store.isAuth) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Авторизуйтесь!'}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
    </div>
  );
};

export default observer(App);
