import { authorizedRequest  } from "./requests";

export const createActivity = async (
    title: FormDataEntryValue | null,
    description: FormDataEntryValue | null,
    duration: string | null,
    repeat: string,
    start_time: string | null,
) => {
    const user_data = {
        title: title,
        description: description,
        duration: duration,
        repeat: repeat,
        start_time: start_time,
    };

    return await authorizedRequest(user_data, "activity", "POST");
};
