// import * as React from 'react';
import { loginUser } from "../../components/userRequests";
import { useState } from "react";
import { CredentialsForm } from "../../components/credentialsForm";
import { useNavigate } from "react-router-dom";
import { InputParams } from "../../components/textField";

export default function LogIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await loginUser(username, password);
    localStorage.setItem("current_user", result.data.token);

    if (!result.data.onboarded) navigate(`/information`);
    else navigate(`/dashboard`);
  };

  const params: InputParams[] = [
    {
      name: "username",
      value: username,
      state: setUsername,
      label: "Потребителско име",
    },
    {
      name: "password",
      value: password,
      state: setPassword,
      label: "Парола",
      type: "password",
    },
  ];

  return (
    <CredentialsForm
      params={params}
      buttonText="Вход"
      onSubmit={handleSubmit}
    />
  );
}
