import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig'; // ปรับตามตำแหน่งของ FirebaseConfig ของคุณ
import { collection, getDocs } from 'firebase/firestore';

const Database = () => {
    const [courts, setCourts] = useState([]);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const courtSnapshot = await getDocs(collection(db, 'Court'));
                if (!courtSnapshot.empty) {
                    setCourts(courtSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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