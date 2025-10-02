import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BaseLayout from '../components/BaseLayout';
import { createNote, deleteNote, fetchNotes, updateNote } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STACK_ROUTES } from '../navigation/StackRoutes';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();
        setNotes(data.data);
      } catch (err) {
        console.log('Error loading notes', err);
      }
    };
    loadNotes();
  }, [noteTitle]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    navigation.replace(STACK_ROUTES.SPLASH_SCREEN);
  };

  // Save note
  const handleSaveNote = async () => {
    if (!noteTitle || !noteContent) {
      Alert.alert('Error', 'Please fill both title and content');
      return;
    }

    try {
      // Optional: show loading if needed
      setLoading(true);

      const response = await createNote(noteTitle, noteContent);

      if (response.success) {
        // Add note to local state
        // const newNote = {
        //   id: response.note.id, // assuming API returns note object with id
        //   title: response.note.title,
        //   content: response.note.content,
        // };
        // setNotes([newNote, ...notes]);

        Alert.alert('Success', 'Note added successfully!');
        setNoteTitle('');
        setNoteContent('');
        setModalVisible(false);
      } else {
        // Handle structured API error
        Alert.alert(`Error ${response.error_code}`, response.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNoteId) return;

    try {
      setLoading(true);
      const response = await deleteNote(selectedNoteId); // call your API
      if (response.success) {
        setNotes(notes.filter(note => note.id !== selectedNoteId));
        Alert.alert('Success', 'Note deleted successfully!');
      } else {
        Alert.alert(`Error ${response.error_code}`, response.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while deleting note.');
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedNoteId(null);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote.title || !editingNote.content) {
      Alert.alert('Error', 'Please fill both title and content');
      return;
    }

    try {
      setLoading(true);

      // Call your updateNote API
      const response = await updateNote(
        editingNote.id,
        editingNote.title,
        editingNote.content,
      );

      if (response.success) {
        // Update local state
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === editingNote.id ? response.data : note,
          ),
        );

        Alert.alert('Success', 'Note updated successfully!');
        setEditModalVisible(false);
        setEditingNote(null);
      } else {
        Alert.alert(`Error ${response.error_code}`, response.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout>
      <View className="flex-1 bg-white px-4">
        <View className="flex-row justify-between items-center mt-4 mb-2">
          <Text className="text-2xl font-bold">📒 Your Notes</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text className="text-red-500 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-green-600 rounded-xl py-3 items-center mb-6 px-3"
        >
          <Text className="text-white text-lg font-semibold">Add Note</Text>
        </TouchableOpacity>

        <FlatList
          data={notes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onLongPress={() => {
                setSelectedNoteId(item.id); // store the note ID to delete
                setDeleteModalVisible(true); // show delete confirmation modal
              }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center border border-gray-200 rounded-xl p-4 mb-3 justify-between">
                <View>
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-gray-600 mt-1">{item.content}</Text>
                </View>

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={() => {
                    setEditingNote(item);
                    setEditModalVisible(true);
                  }}
                >
                  <Text className="text-blue-600 font-bold text-lg">✏️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text className="text-gray-500 text-center mt-10">
              No notes found.
            </Text>
          )}
          contentContainerStyle={
            notes.length === 0 && { flex: 1, justifyContent: 'center' }
          }
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-4">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-xl font-bold mb-4">Add New Note</Text>

            {/* Note Title */}
            <Text className="text-gray-700 mb-2">Title</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Enter note title"
              value={noteTitle}
              onChangeText={setNoteTitle}
            />

            {/* Note Content */}
            <Text className="text-gray-700 mb-2">Content</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Enter note content"
              value={noteContent}
              onChangeText={setNoteContent}
              multiline
              numberOfLines={4}
            />

            {/* Buttons */}
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-400 rounded-xl py-2 px-4"
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveNote}
                className="bg-blue-600 rounded-xl py-2 px-4"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-4">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-lg font-bold mb-4 text-center">
              Are you sure you want to delete this note?
            </Text>

            <View className="flex-row justify-center space-x-4 mt-4">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="bg-gray-400 rounded-xl py-2 px-6"
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteNote}
                className="bg-red-600 rounded-xl py-2 px-6"
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit model */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-4">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-xl font-bold mb-4">Edit Note</Text>

            {/* Title Input */}
            <Text className="text-gray-700 mb-2">Title</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Enter note title"
              value={editingNote?.title || ''}
              onChangeText={text =>
                setEditingNote(prev => ({ ...prev, title: text }))
              }
            />

            {/* Content Input */}
            <Text className="text-gray-700 mb-2">Content</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              placeholder="Enter note content"
              value={editingNote?.content || ''}
              onChangeText={text =>
                setEditingNote(prev => ({ ...prev, content: text }))
              }
              multiline
              numberOfLines={4}
            />

            {/* Buttons */}
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="bg-gray-400 rounded-xl py-2 px-4"
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateNote}
                className="bg-blue-600 rounded-xl py-2 px-4"
              >
                <Text className="text-white font-semibold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </BaseLayout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
