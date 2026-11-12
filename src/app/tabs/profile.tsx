import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('studentProfile');
      if (storedProfile) {
        const parsedData = JSON.parse(storedProfile);
        setStudentName(parsedData.name || '');
        setStudentId(parsedData.id || '');
        setProfileImage(parsedData.imageUri || null);
      }
    } catch (error) {
      console.error('Failed to load profile data', error);
    }
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        "You've refused to allow this app to access your photos!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect:[1,1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfileData = async () => {
    if (!studentName.trim() || !studentId.trim()) {
      Alert.alert('Error', 'Please enter both Name and Student ID.');
      return;
    }

    try {
      const profileData = {
        name: studentName,
        id: studentId,
        imageUri: profileImage,
      };
      await AsyncStorage.setItem('studentProfile', JSON.stringify(profileData));
      Alert.alert('Success', 'Profile details saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  // Function to clear all data in storage
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setStudentName('');
      setStudentId('');
      setProfileImage(null);
      Alert.alert('Success', 'All local data has been wiped.');
    } catch (error) {
      console.error('Failed to clear storage', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Wrap image in a TouchableOpacity to trigger the picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={{
            uri: profileImage
              ? profileImage
              : 'https://flaticon.com',
          }}
          style={styles.avatar}
        />
        <View style={styles.editBadge}>
          <Text style={styles.editBadgeText}>✎</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.headerText}>Student Profile</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={studentName}
          onChangeText={setStudentName}
        />

        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder="CS/2020/001"
          value={studentId}
          onChangeText={setStudentId}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfileData}>
        <Text style={styles.buttonText}>Save Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
        <Text style={styles.buttonText}>Clear All Tasks</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111',
  },
  formGroup: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    width: '100%',
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
