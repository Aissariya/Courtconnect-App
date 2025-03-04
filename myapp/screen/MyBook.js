import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function MyBook() {
  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Upcoming</Text>
        </View>

        <Image source={require("../assets/football.jpg")} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>สนามบาสหนองงูเห่า</Text>
          <Text style={styles.text}>Date: 12 Dec 2024</Text>
          <Text style={styles.text}>Time: 13:00 - 14:00</Text>
          <Text style={styles.price}>Price: 200 THB</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative", 
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFA726",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#009900",
    marginTop: 5,
  },
});


/*import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyBook() {
  return (
    <View style={styles.container}>
      
      <View style={styles.messageContainer}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>No fields have been booked yet.</Text>
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
});*/