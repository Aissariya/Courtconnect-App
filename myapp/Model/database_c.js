import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const DataComment = (court_id) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                // console.log('=== Fetching Comment Data for court_id:', court_id);
                const commentsQuery = query(
                    collection(db, 'Comment'),
                    where('court_id', '==', court_id)
                );
                const commentSnapshot = await getDocs(commentsQuery);
                // console.log('Total Comments found for court_id:', court_id, commentSnapshot.size);

                if (!commentSnapshot.empty) {
                    const commentsData = commentSnapshot.docs.map(doc => {
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
                    setComments(commentsData);
                } else {
                    console.log('No comments found for the given court_id');
                }
            } catch (error) {
                console.error("Error fetching comments: ", error);
            }
        };

        if (court_id) {
            console.log('Fetching comments for court_id:', court_id);
            fetchComments();
        }
    }, [court_id]);

    return comments;
};

export default DataComment;
