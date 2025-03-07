import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Database = () => {
    const [courts, setCourts] = useState([]);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                console.log('=== Fetching Courts Data ===');
                const courtSnapshot = await getDocs(collection(db, 'Court'));
                console.log('Total courts found:', courtSnapshot.size);

                if (!courtSnapshot.empty) {
                    const courtsData = courtSnapshot.docs.map(doc => {
                        const data = { id: doc.id, ...doc.data() };
                        console.log('Court:', {
                            id: doc.id,
                            court_id: data.court_id,
                            field: data.field,
                            type: data.court_type
                        });
                        return data;
                    });
                    setCourts(courtsData);
                } else {
                    console.log('No courts found in database');
                }
            } catch (error) {
                console.error("Error fetching courts: ", error);
            }
        };

        fetchCourts();
    }, []);

    return courts;
};

export default Database;