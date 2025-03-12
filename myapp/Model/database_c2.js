import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const DatabaseComment2 = () => {
    const [Comment2, setComment2] = useState([]);

    useEffect(() => {
        const fetchComment2 = async () => {
            try {
                const Comment2Snapshot = await getDocs(collection(db, 'Comment'));

                if (!Comment2Snapshot.empty) {
                    const Comment2Data = Comment2Snapshot.docs.map(doc => {
                        const data = { id: doc.id, ...doc.data() };
                        console.log('Comment:', {
                            id: doc.id,
                            comment_id: data.comment_id,
                            court_id: data.court_id,
                            rating: data.rating,
                            text: data.text,
                            timestamp: data.timestamp,
                            user_id: data.user_id
                        });
                        return data;
                    });
                    setComment2(Comment2Data);
                } else {
                    console.log('No courts found in database');
                }
            } catch (error) {
                console.error("Error fetching courts: ", error);
            }
        };

        fetchComment2();
    }, []);

    return Comment2;
};

export default DatabaseComment2;