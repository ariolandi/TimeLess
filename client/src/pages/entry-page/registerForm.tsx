// import * as React from 'react';
import { UserService } from "../../services/userService";
import { useState } from "react";
import { CredentialsForm } from "../../components/credentialsForm";
import { useNavigate } from "react-router-dom";
import { InputParams } from "../../components/textField";

const userService = new UserService();

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await userService.create({username, password, email});
    localStorage.setItem("current_user", result.data.token);
  
    navigate(`/information`);
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
    {
      name: "email",
      value: email,
      state: setEmail,
      label: "Имейл",
      type: "email",
    },
  ];

  return (
    <CredentialsForm
      params={params}
      buttonText="Регистрация"
      onSubmit={handleSubmit}
    />
  );
}
