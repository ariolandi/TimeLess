// import * as React from 'react';
import { login_user } from './utils';
import { useState } from 'react';
import { CredentialsForm } from './credentialsForm';


export default function LogIn() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login_user(data.get('username'), data.get('password')).then(_ => 
      console.log({
        password: data.get('password'),
      })
    ).catch(err => 
      console.log(err.message)
    );
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const params = [
    {
      name: 'username',
      value: username,
      state: setUsername,
      label: 'Потребителско име',
      type: ''
    },
    {
      name: 'password',
      value: password,
      state: setPassword,
      label: 'Парола',
      type: 'password'
    }
  ];

  return <CredentialsForm params={params} buttonText='Вход' handleSubmit={handleSubmit} />;
}
