import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name = "index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name = "Login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name = "Signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Home" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="donation" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="donation-success" 
          options={{ 
            headerShown: false,
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen
          name='events'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='seva'
          options={{
            headerShown: false,
          }}
          />
      </Stack>
    </>
  );
}