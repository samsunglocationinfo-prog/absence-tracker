import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { EntryDetailScreen } from '../screens/EntryDetailScreen';
import { ReelStudioScreen } from '../screens/ReelStudioScreen';
import { Button } from '../components/ui/Button';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function JournalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JournalList"
        component={JournalScreen}
        options={({ navigation }) => ({
          title: 'Journal',
          headerShown: true,
          headerRight: () => <Button title="جدید" onPress={() => navigation.navigate('JournalList', { create: true })} size="sm" />,
        })}
      />
      <Stack.Screen name="EntryDetail" component={EntryDetailScreen as React.ComponentType<any>} options={{ title: 'جزئیات' }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
          tabBarStyle: {
            backgroundColor: '#0b1226',
            borderTopColor: 'rgba(255,255,255,0.08)',
            height: 68,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === 'Home'
                ? 'home-outline'
                : route.name === 'Journal'
                  ? 'journal-outline'
                  : route.name === 'Reels'
                    ? 'film-outline'
                    : 'analytics-outline';

            return <Ionicons name={iconName as never} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Timeline' }} />
        <Tab.Screen name="Journal" component={JournalStack} options={{ title: 'Journal' }} />
        <Tab.Screen name="Reels" component={ReelStudioScreen} options={{ title: 'Reels' }} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Insights' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
