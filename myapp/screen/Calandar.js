import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const BookingSection = ({ route }) => {
  const { court } = route.params || {};
  const [date, setDate] = useState(null); // เปลี่ยนจาก new Date() เป็น null

  // เพิ่ม console.log เพื่อตรวจสอบข้อมูลที่เข้ามา
  useEffect(() => {
    console.log('=================== Calendar Screen Data ===================');
    console.log('Route params:', route.params);
    console.log('Court data:', court);
    console.log('Current date:', date);
    console.log('Booked slots:', bookedSlots);
    console.log('User bookings:', userBookings);
    console.log('========================================================');
  }, [route.params, court, date, bookedSlots, userBookings]);

  // Add more detailed logging
  useEffect(() => {
    console.log('Full route params:', route.params);
    console.log('Court data received:', court);

    if (!court) {
      console.error('No court data received');
    } else if (!court.court_id) {
      console.error('Court ID is missing');
    }
  }, [route.params, court]);

  const [show, setShow] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);

  // Fetch booked slots from Firebase
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!court?.court_id) {
        console.log('No court_id available');
        return;
      }

      try {
        console.log('Fetching bookings for court:', court.court_id);

        const bookingsRef = collection(db, 'Booking');
        const q = query(
          bookingsRef,
          where('court_id', '==', court.court_id)
        );

        const querySnapshot = await getDocs(q);
        const slots = [];
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          console.log('Found booking:', booking);
          slots.push(booking);
        });

        console.log('Total bookings found:', slots.length);
        setBookedSlots(slots);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookedSlots();
  }, [court]);

  // Fetch user bookings from Firebase
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const bookingsRef = collection(db, 'Booking');
        const q = query(bookingsRef, where('user_id', '==', 'currentUserId')); // Replace 'currentUserId' with actual user ID

        const querySnapshot = await getDocs(q);
        const bookings = [];
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          bookings.push(booking);
        });

        setUserBookings(bookings);
        console.log('User bookings:', bookings);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    fetchUserBookings();
  }, []);

  // เพิ่ม useEffect สำหรับดึง user_id
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const auth = getAuth();
        if (!auth.currentUser) {
          console.log('No authenticated user found');
          return;
        }

        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUserId(userData.user_id);
          console.log('Current user_id:', userData.user_id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // แก้ไข isBooked function เพื่อเพิ่ม console.log
  const isBooked = (timeSlot) => {
    if (!date || !bookedSlots.length) {
      return false;
    }

    console.log(`Checking bookings for ${timeSlot} on ${date.toLocaleDateString()}`);

    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    const slotHour = parseInt(timeSlot.split(':')[0]);
    console.log('Checking hour:', slotHour);

    return bookedSlots.some(booking => {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);

      // เช็คว่าเป็นวันเดียวกัน
      if (bookingStart.toDateString() !== currentDate.toDateString()) {
        return false;
      }

      const bookingStartHour = bookingStart.getHours();
      const bookingEndHour = bookingEnd.getHours();

      console.log('Booking hours:', {
        start: bookingStartHour,
        end: bookingEndHour,
        slot: slotHour
      });

      return slotHour >= bookingStartHour && slotHour <= bookingEndHour;
    });
  };

  // แก้ไข onChange function เพื่อตรวจสอบการจองเมื่อเลือกวันที่
  const onChange = async (event, selectedDate) => {
    if (event.type === "dismissed") {
      setDate(null); // Reset date
      setBookedSlots([]); // Clear booked slots
    } else if (selectedDate) {
      setDate(selectedDate);
      fetchBookingsForDate(selectedDate);
    }
    setShow(false);
  };

  // เพิ่มฟังก์ชันใหม่สำหรับดึงข้อมูลการจองตามวันที่
  const fetchBookingsForDate = async (selectedDate) => {
    if (!court?.court_id) return;

    try {
      console.log('Fetching bookings for date:', selectedDate);
      const bookingsRef = collection(db, 'Booking');
      const q = query(bookingsRef, where('court_id', '==', court.court_id));
      const querySnapshot = await getDocs(q);

      // กรองข้อมูลตามวันที่
      const todayBookings = [];
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        // ดึงวันที่จาก start_time
        const bookingDateStr = booking.start_time.split(' at')[0];
        const selectedDateStr = selectedDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        console.log('Comparing dates:', {
          bookingDate: bookingDateStr,
          selectedDate: selectedDateStr,
          booking
        });

        if (bookingDateStr === selectedDateStr) {
          todayBookings.push(booking);
        }
      });

      console.log('Found bookings:', todayBookings);
      setBookedSlots(todayBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const renderBookedSlots = () => {
    if (!date || !bookedSlots.length) return null; // เพิ่มการตรวจสอบ date

    const parseDateTime = (dateTimeStr) => {
      try {
        console.log('Parsing datetime:', dateTimeStr);
        // Format: "March 7, 2025 at 10:00 AM UTC+7"
        const [monthDay, yearTime] = dateTimeStr.split(', ');
        const [year, timeStr] = yearTime.split(' at ');
        const [time, period, timezone] = timeStr.split(' ');
        const [month, day] = monthDay.split(' ');

        // Convert month name to month number (0-11)
        const months = {
          January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
          July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
        };

        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);

        // Convert to 24 hour format
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        const date = new Date(
          parseInt(year),
          months[month],
          parseInt(day),
          hour,
          parseInt(minutes)
        );

        console.log('Parsed date:', date);
        return date;
      } catch (error) {
        console.error('Error parsing date:', error);
        return null;
      }
    };

    return (
      <View style={styles.bookedSlotsContainer}>
        <Text style={styles.bookedSlotsTitle}>Booked Time Slots:</Text>
        {bookedSlots.map((slot) => {
          const startDate = parseDateTime(slot.start_time);
          const endDate = parseDateTime(slot.end_time);

          if (!startDate || !endDate) {
            console.error('Invalid date found:', slot);
            return null;
          }

          return (
            <View key={slot.booking_id} style={styles.bookedSlotItem}>
              <AntDesign name="clockcircle" size={16} color="#D32F2F" style={styles.clockIcon} />
              <View style={styles.bookedSlotContent}>
                <Text style={styles.bookedSlotDate}>
                  {startDate.toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <Text style={styles.bookedSlotTime}>
                  {startDate.toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                  {' - '}
                  {endDate.toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderUserBookings = () => {
    if (!userBookings.length) return null;

    // ใช้ฟังก์ชัน parseDateTime เดียวกับที่ใช้ใน renderBookedSlots
    const parseDateTime = (dateTimeStr) => {
      try {
        console.log('Parsing datetime:', dateTimeStr);
        // Format: "March 7, 2025 at 10:00 AM UTC+7"
        const [monthDay, yearTime] = dateTimeStr.split(', ');
        const [year, timeStr] = yearTime.split(' at ');
        const [time, period, timezone] = timeStr.split(' ');
        const [month, day] = monthDay.split(' ');

        const months = {
          January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
          July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
        };

        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        const date = new Date(
          parseInt(year),
          months[month],
          parseInt(day),
          hour,
          parseInt(minutes)
        );

        return date;
      } catch (error) {
        console.error('Error parsing date:', error, 'for string:', dateTimeStr);
        return null;
      }
    };

    return (
      <View style={styles.userBookingsContainer}>
        <Text style={styles.userBookingsTitle}>Your Bookings:</Text>
        {userBookings.map((booking) => {
          const startDate = parseDateTime(booking.start_time);
          const endDate = parseDateTime(booking.end_time);

          if (!startDate || !endDate) {
            console.error('Invalid booking dates:', booking);
            return null;
          }

          return (
            <View key={booking.booking_id} style={styles.userBookedSlotItem}>
              <AntDesign name="clockcircle" size={16} color="#388E3C" style={styles.clockIcon} />
              <View style={styles.bookedSlotContent}>
                <Text style={styles.userBookingDate}>
                  {startDate.toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <Text style={styles.userBookingTime}>
                  {startDate.toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                  {' - '}
                  {endDate.toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.timeSlot}>
      <Text style={styles.timeText}>{item}</Text>
      <View style={[styles.bookButton, isBooked(item) && styles.booked]}>
        {isBooked(item) && (
          <View style={styles.bookedContent}>
            <AntDesign name="close" size={24} color="red" style={styles.bookedIcon} />
            <Text style={styles.bookedText}>Booked</Text>
          </View>
        )}
      </View>
    </View>
  );

  // แก้ไขฟังก์ชัน parseBookingTime เพื่อแปลงรูปแบบเวลาให้ถูกต้อง
  const parseBookingTime = (timeStr) => {
    try {
      // แยกส่วนวันที่และเวลา
      const [datePart, timePart] = timeStr.split(' at ');
      const [time, period] = timePart.split(' UTC')[0].split(' ');
      let [hours, minutes] = time.split(':').map(num => parseInt(num));

      // แปลง 12-hour เป็น 24-hour format
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hour = 0;

      return { hours, minutes };
    } catch (error) {
      console.error('Error parsing booking time:', error);
      return null;
    }
  };

  // แก้ไขฟังก์ชัน checkTimeSlotAvailability
  const checkTimeSlotAvailability = (hour) => {
    if (!bookedSlots.length) return { isBooked: false };

    // เช็คการจองแต่ละรายการ
    for (const booking of bookedSlots) {
      try {
        // แยกเวลาออกจาก start_time และ end_time
        const startTimePart = booking.start_time.split(' at ')[1];
        const endTimePart = booking.end_time.split(' at ')[1];

        // แปลงเวลาเป็นชั่วโมง
        const startHour = parseInt(startTimePart.split(':')[0]);
        const endHour = parseInt(endTimePart.split(':')[0]);

        // ปรับค่าชั่วโมงตาม AM/PM
        const adjustedStartHour = startTimePart.includes('PM') && startHour !== 12
          ? startHour + 12
          : startHour;
        const adjustedEndHour = endTimePart.includes('PM') && endHour !== 12
          ? endHour + 12
          : endHour;

        console.log('Checking time slot:', {
          slotHour: hour,
          startHour: adjustedStartHour,
          endHour: adjustedEndHour,
          booking: booking
        });

        if (hour >= adjustedStartHour && hour < adjustedEndHour) {
          return {
            isBooked: true,
            isUserBooking: booking.user_id === currentUserId,
            booking: booking,
            timeRange: `${startTimePart.split(' UTC')[0]} - ${endTimePart.split(' UTC')[0]}`
          };
        }
      } catch (error) {
        console.error('Error checking time slot:', error);
      }
    }

    return { isBooked: false };
  };

  // แก้ไข renderTimeSlots function เพื่อแสดงสถานะการจอง
  const renderTimeSlots = () => {
    if (!date) return null;

    const timeSlots = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      display: `${String(i).padStart(2, '0')}:00`
    }));

    return (
      <View style={styles.timeSlotsContainer}>
        <Text style={styles.dateHeader}>
          {date.toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>

        {bookedSlots.length > 0 && (
          <Text style={styles.bookingsSummary}>
            การจองวันนี้: {bookedSlots.length} รายการ
          </Text>
        )}

        {timeSlots.map(({ hour, display }) => {
          const { isBooked, isUserBooking, timeRange } = checkTimeSlotAvailability(hour);

          return (
            <View key={hour} style={styles.timeSlotRow}>
              <Text style={styles.timeDisplay}>{display}</Text>
              <View style={[
                styles.statusIndicator,
                isBooked ?
                  (isUserBooking ? styles.userBookedSlot : styles.bookedSlot)
                  : styles.availableSlot
              ]}>
                <Text style={styles.statusText}>
                  {isBooked ?
                    (isUserBooking ? 'การจองของคุณ' : 'ไม่ว่าง')
                    : 'ว่าง'}
                </Text>
                {timeRange && <Text style={styles.timeRangeText}>{timeRange}</Text>}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // เพิ่ม styles ใหม่
  const newStyles = StyleSheet.create({
    userBookedSlot: {
      backgroundColor: '#C8E6C9',
      borderColor: '#81C784',
    },
    bookedSlot: {
      backgroundColor: '#FFEBEE',
      borderColor: '#FFCDD2',
    },
    availableSlot: {
      backgroundColor: '#E8F5E9',
      borderColor: '#A5D6A7',
    },
    bookingTimeRange: {
      fontSize: 11,
      color: '#666',
      marginTop: 4,
    }
  });

  const additionalStyles = StyleSheet.create({
    bookingsSummary: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
      backgroundColor: '#f5f5f5',
      padding: 8,
      borderRadius: 5,
    },
    timeRangeText: {
      fontSize: 12,
      color: '#666',
      marginTop: 2
    },
    // ...existing styles...
  });

  return (
    <FlatList
      keyExtractor={(item) => item}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleText}>Field Booking Schedule</Text>
          </View>

          {/* Court Card - similar to Booking screen */}
          <View style={styles.card}>
            {court && (
              <Image
                source={{ uri: court.image[0] }}
                style={styles.courtImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.courtDetails}>
              <Text style={[styles.courtTitle, styles.courtTitleBorder, { textAlign: 'center' }]}>{court ? court.field : 'Loading...'}</Text>
              <Text style={[styles.courtSubtitle, { fontWeight: 'bold' }]}>{court ? court.address : 'Loading...'}</Text>
              <Text style={[styles.fieldText, { textAlign: 'center', fontWeight: 'bold' }]}>Player : 6-15 people/court</Text>
              <Text style={[styles.fieldText, { textAlign: 'center', fontWeight: 'bold' }]}>Time : 8:00 - 14:00</Text>
              <Text style={[styles.fieldText, { textAlign: 'center', fontWeight: 'bold' }]}>Price : 1 Hour/ 500 Bath</Text>
            </View>
          </View>
          {renderTimeSlots()}
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Time</Text>
            <View style={styles.dateInputContainer}>
              <AntDesign name="calendar" size={18} color="black" style={styles.calendarIcon} />
              <TouchableOpacity onPress={showDatepicker} style={{ flex: 1 }}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="Select date"
                  value={date ? date.toLocaleDateString() : ''}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
              minimumDate={new Date()}
            />
          )}
          {renderBookedSlots()}
          {renderUserBookings()}
        </>
      }
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  scheduleContainer: {
    backgroundColor: "#A2F193",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fieldInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  fieldImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  fieldDetails: {
    flex: 1,
  },
  fieldName: {
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "black",
    color: "white",
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  fieldText: {
    color: "#333",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A2F193",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  timeLabel: {
    fontWeight: "bold",
    marginRight: 10,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#A2F193",
    flex: 1,
  },
  calendarIcon: {
    marginRight: 5,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 5,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  timeText: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
    width: 80,
    textAlign: "center",
  },
  bookButton: {
    flex: 1,
    height: 40,
    borderColor: "#A2F193",
    borderWidth: 2,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  booked: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  bookedIcon: {
    color: '#D32F2F',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
    fontSize: 16
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  courtImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  courtDetails: {
    marginTop: 10,
  },
  courtTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009900',
  },
  courtTitleBorder: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#000',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  courtSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bookedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookedText: {
    color: '#D32F2F',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookedSlotsContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    marginHorizontal: 15,
  },
  bookedSlotsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#D32F2F',
  },
  bookedSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  clockIcon: {
    marginRight: 10,
  },
  bookedSlotContent: {
    flex: 1,
  },
  bookedSlotDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  bookedSlotTime: {
    fontSize: 14,
    color: '#D32F2F',
  },
  userBookingsContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#C8E6C9', // พื้นหลังสีเขียวเข้ม
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF', // เส้นกรอบสีขาว
    borderRadius: 10,
  },
  userBookingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#388E3C', // สีข้อความสีเขียวเข้ม
  },
  userBookingText: {
    fontSize: 14,
    color: '#00796B',
  },
  userBookingDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '0000000', // สีข้อความ1
    marginBottom: 2,
  },
  userBookingTime: {
    fontSize: 14,
    color: '#388E3C', // สีข้อความ2
  },
  userBookedSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C', // สีขอบสีเขียวเข้ม
  },
});

export default BookingSection;
