import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<any[]>([]);

  // useFocusEffect runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
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
        <Text style={styles.headerTitle}>Your Tasks</Text>

        <ScrollView style={styles.list}>
          {tasks.length === 0 ? (
            <Text style={styles.empty}>No tasks saved yet. Add one!</Text>
          ) : (
            tasks.map((task: any) => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.taskTitle}>{task.taskName}</Text>
                <Text style={styles.taskDesc}>{task.taskDescription}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-task')}
        >
          <Text style={styles.addButtonText}>+ Add New Task</Text>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111',
  },
  list: {
    flex: 1,
  },
  empty: {
    fontSize: 15,
    color: '#777',
    marginTop: 10,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1E64D8',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E64D8',
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 14,
    color: '#444',
  },
  addButton: {
    backgroundColor: '#138808',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
