// Notification utility for admin alerts

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Send browser notification
export function sendNotification(data: NotificationData): void {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      tag: data.tag || 'scrap-square-notification',
      badge: data.icon || '/favicon.ico',
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

// Send notification to admin about new pickup request
export function notifyAdminNewRequest(userName: string, scrapTypes: string[]): void {
  const scrapList = scrapTypes.join(', ');
  sendNotification({
    title: '🔔 New Pickup Request - Scrap Square',
    body: `${userName} has requested pickup for: ${scrapList}`,
    tag: 'new-pickup-request',
  });
}

// Play notification sound (optional)
export function playNotificationSound(): void {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSBY=');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio play errors (user interaction required in some browsers)
    });
  } catch (error) {
    console.log('Could not play notification sound');
  }
}

// Store admin notification preference
export function setAdminNotificationEnabled(enabled: boolean): void {
  localStorage.setItem('adminNotificationsEnabled', enabled ? 'true' : 'false');
}

// Check if admin notifications are enabled
export function isAdminNotificationEnabled(): boolean {
  const enabled = localStorage.getItem('adminNotificationsEnabled');
  return enabled !== 'false'; // Default to true
}

// Initialize notification system for admin
export async function initializeAdminNotifications(): Promise<void> {
  if (isAdminNotificationEnabled()) {
    await requestNotificationPermission();
  }
}
