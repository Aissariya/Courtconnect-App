import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const DataUser = (comments) => {
    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        const fetchUserNames = async () => {
            if (!comments || comments.length === 0) return;

            const newUserData = {};
            for (const comment of comments) {
                if (comment.user_id) {
                    try {
                        const userRef = doc(db, 'users', comment.user_id);
                        const userDoc = await getDoc(userRef);
                        if (userDoc.exists()) {
                            const user = userDoc.data();
                            newUserData[comment.id] = {
                                name: user.name || 'Unknown',
                                profileImage: user.profileImage || null,
                            };
                        }
                    } catch (error) {
                        console.error('Error fetching user name: ', error);
                    }
                }
            }
            console.log('Fetched user names:', newUserData);
            setUserNames(newUserData);
        };

        if (comments.length > 0) {
            fetchUserNames();
        }
    }, [comments]);

    return userNames;
};

export default DataUser;
