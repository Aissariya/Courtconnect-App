import { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const DatabaseTimeslots = () => {
    const [courts, setTimeslots] = useState([]);

    useEffect(() => {
        const fetchTimeslots = async () => {
            try {
                // console.log('=== Fetching Courts Data ===');
                const TimeslotsSnapshot = await getDocs(collection(db, 'Timeslot'));
                // console.log('Total Timeslot found:', TimeslotsSnapshot.size);

                if (!TimeslotsSnapshot.empty) {
                    const TimeslotsData = TimeslotsSnapshot.docs.map(doc => {
                        const data = { id: doc.id, ...doc.data() };
                        // console.log('Court:', {
                        //     id: doc.id,
                        //     available: data.available,
                        //     court_id: data.court_id,
                        //     day: data.day,
                        //     time_end: data.time_end,
                        //     time_start: data.time_start,
                        // });
                        return data;
                    });
                    setTimeslots(TimeslotsData);
                } else {
                    console.log('No Timeslots found in database');
                }
            } catch (error) {
                console.error("Error fetching Timeslots: ", error);
            }
        };

        fetchTimeslots();
    }, []);

    return courts;
};

export default DatabaseTimeslots;