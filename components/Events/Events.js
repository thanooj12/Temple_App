import React, { useState } from 'react';
import {
  View,Text,Modal,TextInput,TouchableOpacity,FlatList,StyleSheet,Platform,Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack } from 'expo-router/build/global-state/routing';

export default function CalendarScreen({ navigation }) {
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const colorPalette = ['#FFCDD2', '#C8E6C9', '#FFE0B2', '#FFF9C4', '#D1C4E9', '#FFE082'];

  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);

    let seconds = total_seconds % 60;
    total_seconds -= seconds;

    let hours = Math.floor(total_seconds / 3600);
    let minutes = Math.floor((total_seconds - hours * 3600) / 60);

    date_info.setHours(hours);
    date_info.setMinutes(minutes);
    date_info.setSeconds(seconds);

    return date_info;
  };

  const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];
  const formatTime = (dateObj) => dateObj.toTimeString().slice(0, 5);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleAddEvent = () => {
    if (!eventTitle || !selectedDate) return;

    const newEvent = {
      title: eventTitle,
      time: eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setEvents((prev) => {
      const updated = { ...prev };
      if (!updated[selectedDate]) updated[selectedDate] = [];
      updated[selectedDate].push(newEvent);

      console.log('Saved Events:', updated); // ✅ log events

      return updated;
    });

    setMarkedDates((prev) => ({
      ...prev,
      [selectedDate]: {
        marked: true,
        dotColor: 'red',
        customStyles: {
          container: { backgroundColor: '#FF9800', borderRadius: 16 },
          text: { color: '#fff' },
        },
      },
    }));

    setEventTitle('');
    setEventTime(new Date());
    setModalVisible(false);
  };

  const deleteEvent = (date, index) => {
    const updatedEvents = { ...events };
    updatedEvents[date].splice(index, 1);
    if (updatedEvents[date].length === 0) {
      delete updatedEvents[date];
      const updatedMarks = { ...markedDates };
      delete updatedMarks[date];
      setMarkedDates(updatedMarks);
    }
    setEvents(updatedEvents);
  };

  const handleBulkUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ],
        copyToCacheDirectory: true,
      });

      if (result.type === 'cancel') return;
      if (result.canceled){
        console.log('User canceled the document picker');
        return;
      }

      const fileUri = result.uri || result.assets?.[0]?.uri;
      const fileSize = result.size || result.assets?.[0]?.size;

      if (fileSize && fileSize > 1048576) {
        Alert.alert('File Too Large', 'Please select a file smaller than 1MB.');
        return;
      }

      
      if (!fileUri) throw new Error('File URI not found');

      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileData, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const newEvents = { ...events };
      const newMarked = { ...markedDates };

      data.forEach((item) => {
        let { date, title, time } = item;
        if (!date || !title || !time) return;

        if (typeof date === 'number') {
          const d = excelDateToJSDate(date);
          date = formatDate(d);
        }

        if (typeof time === 'number') {
          const t = excelDateToJSDate(time);
          time = formatTime(t);
        }

        if (!newEvents[date]) newEvents[date] = [];
        newEvents[date].push({ title, time });

        newMarked[date] = {
          marked: true,
          dotColor: 'red',
          customStyles: {
            container: { backgroundColor: '#FF9800', borderRadius: 16 },
            text: { color: '#fff' },
          },
        };
      });

      setEvents(newEvents);
      setMarkedDates(newMarked);

      console.log('Events after Excel upload:', newEvents); 

      Alert.alert('Success', 'Events loaded from Excel.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load Excel file.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={{ width: 24 }} />
      </View>

      <Calendar
        markedDates={markedDates}
        markingType={'custom'}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#FF9800',
          arrowColor: '#FF9800',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayFontSize: 16,
          textMonthFontSize: 16,
        }}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handleBulkUpload}>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
          Upload Bulk Events
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <FlatList
        data={Object.entries(events)
          .sort(([a], [b]) => a.localeCompare(b))
          .flatMap(([date, evts]) =>
            evts.map((evt, i) => ({
              ...evt,
              date,
              index: i,
              color: colorPalette[i % colorPalette.length],
            }))
          )}
        keyExtractor={(item, index) => item.date + index}
        renderItem={({ item }) => (
          <View style={[styles.eventCard, { backgroundColor: item.color }]}>
            <View style={styles.eventRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>
                  {item.date} - {item.time}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteEvent(item.date, item.index)}>
                <AntDesign name="delete" size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 16 }}>No events added yet.</Text>}
        contentContainerStyle={{ paddingBottom: 150 }} // ✅ more footer space
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          const today = new Date().toISOString().split('T')[0];
          setSelectedDate(today);
          setModalVisible(true);
        }}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Event</Text>
            <Text>Date: {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={eventTitle}
              onChangeText={setEventTitle}
            />
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
              <Text style={styles.timeText}>
                Time: {eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={eventTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setEventTime(selectedTime);
                }}
              />
            )}
            <TouchableOpacity style={styles.modalButton} onPress={handleAddEvent}>
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor:'white',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: 'black', fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 8, marginHorizontal: 16 },
  eventCard: { borderRadius: 10, padding: 12, marginBottom: 8, marginHorizontal: 16 },
  eventRow: { flexDirection: 'row', alignItems: 'center' },
  eventTitle: { fontSize: 16, fontWeight: '600' },
  eventDate: { fontSize: 14, color: '#333' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#FF9800',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  timeButton: { marginBottom: 10 },
  timeText: { fontSize: 16, color: '#FF9800' },
  modalButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  uploadButton: {
    backgroundColor: '#FFCC80',
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
