import { request, authorizedRequest  } from "./requests";

export const createUser = async (
    username: FormDataEntryValue | null,
    password: FormDataEntryValue | null,
    email: FormDataEntryValue | null
) => {
    const user_data = {
        user: {
            username: username,
            password: password,
            email: email,
        },
    };

    return await request(user_data, "signup", "POST");
};

export const loginUser = async (
    username: FormDataEntryValue | null,
    password: FormDataEntryValue | null
) => {
    const user_data = {
        username: username,
        password: password,
    };

    return await request(user_data, "login", "POST");
};

export const userInformation = async (
    first_name: FormDataEntryValue | null,
    last_name: FormDataEntryValue | null,
    weekday_time: object,
    weekend_time: object
) => {
    const user_data = {
        first_name: first_name,
        last_name: last_name,
        weekday_time: weekday_time,
        weekend_time: weekend_time
    };

    return await authorizedRequest(user_data, "update_user", "POST");
};
