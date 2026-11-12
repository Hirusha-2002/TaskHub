import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const saveTask = async () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // 1. Fetch existing tasks
      const existingTasks = await AsyncStorage.getItem('tasks');
      let tasksArray = existingTasks ? JSON.parse(existingTasks) : [];

      // 2. Add the new task
      const newTask = {
        id: Date.now().toString(),
        taskName,
        taskDescription,
      };
      tasksArray.push(newTask);

      // 3. Save back to storage using JSON.stringify
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksArray));

      // 4. Trigger a local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Saved Successfully! 🎉',
          body: `Don't forget to complete your ${taskName}.`,
        },
        trigger: null, // trigger immediately
      });

      // 5. Navigate back to dashboard
      router.back();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://freepik.com',
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://vecteezy.com',
          }}
          style={styles.banner}
          resizeMode="contain"
        />

        <Text style={styles.label}>Task Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={taskName}
          onChangeText={setTaskName}
        />

        <Text style={styles.label}>Task Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter task description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  banner: {
    width: '100%',
    height: 160,
    marginBottom: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: '#138808',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
