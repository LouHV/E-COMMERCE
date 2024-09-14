import { useEffect, useState } from "react";
import { apiFindUsersById } from "../apis";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    
    const recipientId = chat?.members.find((id) => id !== user?._id); 
 
    const fetchRecipientUser = async () => {
        const response = await apiFindUsersById(recipientId);
        if (response?.error) {
            return setError(response);
        }
        setRecipientUser(response.rs);
    };

    useEffect(() => {
        if (!recipientId) return;
        fetchRecipientUser();
    }, [recipientId]);

    return { recipientUser, error };
}
