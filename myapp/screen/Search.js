import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function Search() {
  const recommendedFields = [
    { id: "1", name: "Football Stadium A" },
    { id: "2", name: "Basketball Arena B" },
    { id: "3", name: "Badminton Court C" },
    { id: "4", name: "Ping Pong Hall D" },
    { id: "5", name: "Tennis Court E" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Sports Fields</Text>
      <FlatList
        data={recommendedFields}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fieldItem}>
            <Text style={styles.fieldName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  fieldItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
