const server_url = "http://localhost:3001";

const request = (params: object, endpoint: string, method: string) => {
    fetch(`${server_url}/${endpoint}`, {
      method: method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'      
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((_) => {})
      .catch((error) => {
        throw error;
      });
};

export const create_user = (username: FormDataEntryValue | null, password: FormDataEntryValue | null, email: FormDataEntryValue | null) => {
  const user_data = {
    user: {
      username: username,
      password: password,
      email: email
    }
  };
  return request(user_data, 'signup', 'POST');
};
  
