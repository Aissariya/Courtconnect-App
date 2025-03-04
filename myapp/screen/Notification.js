import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function BookingCard() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/basketball.jpg")} style={styles.image} />

      {/* ป้าย "จองแล้ว" */}
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Already Booking</Text>
      </View>

      {/* เวลาการแจ้งเตือน (เป็นนาฬิกา) */}
      <View style={styles.notificationTime}>
        <Text style={styles.notificationText}>13:45</Text>
      </View>

      {/* ป้ายชื่อสนาม */}
      <View style={styles.label}>
        <Text style={styles.labelText}>สนามบาสหนองงูเห่า</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
  notificationTime: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgb(255, 255, 255)", // สีเทาอ่อนโปร่งใส
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  notificationText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
  },
  label: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  labelText: {
    fontWeight: "bold",
  },
});



/*import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Notification() {
  return (
    <View style={styles.container}>
      
      <View style={styles.messageContainer}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>No notifications yet.</Text>
        </View>
      </View>

      
      <View style={styles.content}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 10,
  },
  messageContainer: {
    alignItems: "center",
    marginVertical: 10,
    
  },
  messageBox: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop:10,
  },
  messageText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
});

*/