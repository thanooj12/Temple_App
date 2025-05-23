import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { goBack } from 'expo-router/build/global-state/routing';

const sevaItems = [
  'Cooking Seva',
  'Venue Arrangement',
  'Kids Club',
  'Cleaning',
  'Parking Lookup',
];

export default function App() {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [showRecurring, setShowRecurring] = useState(false);
  const [recurringFrom, setRecurringFrom] = useState(new Date());
  const [recurringTo, setRecurringTo] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleSave = async () => {
    if (!email || !selectedMenu || !duration) {
      alert('Please fill in all required fields.');
      return;
    }

    const sevaDetails = {
      email,
      seva: selectedMenu,
      dateTime: `${date.toISOString().split('T')[0]}T${time.toTimeString().split(' ')[0]}`,
      duration,
      recurring: showRecurring
        ? {
            from: recurringFrom.toISOString().split('T')[0],
            to: recurringTo.toISOString().split('T')[0],
          }
        : null,
    };

    try {
      const response = await fetch("http://192.168.29.134:8081/api/seva/save".trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sevaDetails),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong.');
      }

      const data = await response.json();
      console.log('Saved Seva:', data);
      alert('Seva saved successfully!');

      // Reset form
      setSelectedMenu('');
      setEmail('');
      setDate(new Date());
      setTime(new Date());
      setDuration('');
      setShowRecurring(false);
      setRecurringFrom(new Date());
      setRecurringTo(new Date());
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error(err);
    }
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>Select a Seva</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View>
          {sevaItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.sevaButton,
                selectedMenu === item && styles.selectedSevaButton,
              ]}
              onPress={() => setSelectedMenu(selectedMenu === item ? '' : item)}
            >
              <Text
                style={[
                  styles.sevaButtonText,
                  selectedMenu === item && styles.selectedSevaButtonText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMenu !== '' && (
          <>
            <Text style={styles.title}>{selectedMenu}</Text>

            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.label}>Select Date: {date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.label}>Select Time: {time.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(_, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTime(selectedTime);
                }}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Duration (e.g., 2 hours)"
              placeholderTextColor="#999"
              value={duration}
              onChangeText={setDuration}
            />

            <View style={styles.recurringRow}>
              <Text style={styles.label}>Recurring Seva?</Text>
              <Switch
                value={showRecurring}
                onValueChange={setShowRecurring}
                trackColor={{ false: '#767577', true: '#FFA726' }}
                thumbColor={showRecurring ? 'white' : '#f4f3f4'}
              />
            </View>

            {showRecurring && (
              <>
                <TouchableOpacity style={styles.input} onPress={() => setShowFromPicker(true)}>
                  <Text style={styles.label}>Repeat From: {recurringFrom.toDateString()}</Text>
                </TouchableOpacity>
                {showFromPicker && (
                  <DateTimePicker
                    value={recurringFrom}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      setShowFromPicker(false);
                      if (date) setRecurringFrom(date);
                    }}
                  />
                )}

                <TouchableOpacity style={styles.input} onPress={() => setShowToPicker(true)}>
                  <Text style={styles.label}>Repeat Until: {recurringTo.toDateString()}</Text>
                </TouchableOpacity>
                {showToPicker && (
                  <DateTimePicker
                    value={recurringTo}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      setShowToPicker(false);
                      if (date) setRecurringTo(date);
                    }}
                  />
                )}
              </>
            )}

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Seva</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    justifyContent: 'space-between',
  },
  titleHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 120,
    color: 'black',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  sevaButton: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  selectedSevaButton: {
    backgroundColor: '#FF9800',
  },
  sevaButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedSevaButtonText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFA726',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  label: {
    color: '#000',
    fontSize: 16,
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
