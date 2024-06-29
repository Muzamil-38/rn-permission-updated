/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { List } from 'react-native-paper';
import { observer } from 'mobx-react-lite'; 
import { permissionStore } from './app/store/permissionStore'; // make sure the import path is correct

const PermissionScreen = observer(() => {
  useEffect(() => {
    console.log('Checking permissions...');
    permissionStore.checkPermissions();
  }, []);

  const toggleChangeCamera = () => {
    console.log('Toggling Camera Permission');
    permissionStore.togglePermission('camera');
  };

  const toggleChangeNotification = () => {
    console.log('Toggling Notification Permission');
    permissionStore.togglePermission('notification');
  };

  console.log('Current Camera Permission:', permissionStore.cameraPermission);
  console.log('Current Notification Permission:', permissionStore.notificationPermission);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.permissionsNeededText}>
          Permissions Needed: {permissionStore.permissionsNeeded}
        </Text>
        <List.Item
          title="Notification"
          right={() => (
            <TouchableOpacity onPress={toggleChangeNotification} activeOpacity={0.8}>
              <View style={[styles.container, permissionStore.notificationPermission === 'granted' && styles.containerActive]}>
                <View style={[styles.track, permissionStore.notificationPermission === 'granted' && styles.trackActive]} />
                <View style={[styles.thumb, permissionStore.notificationPermission === 'granted' && styles.thumbActive]} />
              </View>
            </TouchableOpacity>
          )}
        />
        <List.Item
          title="Camera"
          right={() => (
            <TouchableOpacity onPress={toggleChangeCamera} activeOpacity={0.8}>
              <View style={[styles.container, permissionStore.cameraPermission === 'granted' && styles.containerActive]}>
                <View style={[styles.track, permissionStore.cameraPermission === 'granted' && styles.trackActive]} />
                <View style={[styles.thumb, permissionStore.cameraPermission === 'granted' && styles.thumbActive]} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
});

export default PermissionScreen;

const styles = StyleSheet.create({
  content: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
  },
  permissionsNeededText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  containerActive: {
    backgroundColor: '#4CAF50', // Active background color
  },
  track: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#efefef',
  },
  trackActive: {
    backgroundColor: '#4CAF50', // Active track color
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 14,
    backgroundColor: '#fff',
    position: 'absolute',
    marginLeft: 2,
  },
  thumbActive: {
    backgroundColor: '#fff', // Active thumb color
    transform: [{ translateX: 22 }],
  },
});
