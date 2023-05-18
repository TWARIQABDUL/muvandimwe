import { Plugins } from '@capacitor/core';
const { Alert } = Plugins;

export async function ShowPopup() {
  const result = await Alert.show({
    title: 'Location permission required',
    message: 'Please allow the app to access your location',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'OK'
      }
    ]
  });
  console.log('User clicked ' + result);
}