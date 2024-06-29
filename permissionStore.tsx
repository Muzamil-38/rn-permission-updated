/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { makeAutoObservable } from "mobx";
import { Platform, AppState, Alert } from "react-native";
import {
  check,
  request,
  openSettings,
  PermissionStatus,
  PERMISSIONS,
} from "react-native-permissions";

type PermissionKey = 'cameraPermission' | 'notificationPermission';

class PermissionStore {
  cameraPermission: PermissionStatus = 'unavailable';
  notificationPermission: PermissionStatus = 'unavailable';

  constructor() {
    makeAutoObservable(this);
    this.checkPermissions();

    AppState.addEventListener('change', this.handleAppStateChange);
  }

  get permissionsNeeded() {
    let count = 0;
    if (this.cameraPermission !== 'granted') count++;
    if (this.notificationPermission !== 'granted') count++;
    return count;
  }

  async checkPermissions() {
    const camera = await check(
      Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
    );
    const notifications = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECEIVE_WAP_PUSH
        : PERMISSIONS.IOS.BLUETOOTH
    );

    this.cameraPermission = camera;
    this.notificationPermission = notifications;
  }

  async requestPermission(permission: 'camera' | 'notification') {
    const permissionType =
      permission === 'camera'
        ? (Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA)
        : (Platform.OS === 'android' ? PERMISSIONS.ANDROID.RECEIVE_WAP_PUSH : PERMISSIONS.IOS.BLUETOOTH);

    const result = await request(permissionType);

    if (result === 'blocked') {
      this.showSettingsAlert();
    } else {
      this.checkPermissions();
    }
  }

  openAppSettings() {
    openSettings().catch(() => console.warn('Cannot open settings'));
  }

  togglePermission(permission: 'camera' | 'notification') {
    const permissionKey: PermissionKey = `${permission}Permission`;

    if (this[permissionKey] === 'granted') {
      this.showSettingsAlert();
    } else {
      this.requestPermission(permission);
    }
  }

  showSettingsAlert() {
    Alert.alert(
      "Permission Required",
      "The app permissions can only be changed from the app settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open App Settings", onPress: () => this.openAppSettings() }
      ],
      { cancelable: false }
    );
  }

  handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      this.checkPermissions();
    }
  };
}

export const permissionStore = new PermissionStore();
