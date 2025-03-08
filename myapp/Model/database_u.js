import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const DataUser = (comments) => {
    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        const fetchUserNames = async () => {
            const newNames = {};
            for (const comment of comments) {
                if (comment.user_id) {
                    try {
                        const userRef = doc(db, 'users', comment.user_id);
                        const userDoc = await getDoc(userRef);
                        if (userDoc.exists()) {
                            newNames[comment.id] = userDoc.data().name; // Assuming 'name' field exists
                        }
                    } catch (error) {
                        console.error('Error fetching user name: ', error);
                    }
                }
            }
            setUserNames(newNames);
        };

        if (comments.length > 0) {
            fetchUserNames();
        }
    }, [comments]);

    return userNames;
};

export default DataUser;
