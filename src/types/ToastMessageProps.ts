export interface ToastMessageProps {
  message: string;
  duration?: number;
  onClose?: () => void;
  variant?: 'error' | 'success';
}