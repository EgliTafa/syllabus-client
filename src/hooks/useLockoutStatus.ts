import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export const useLockoutStatus = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const isLockedOut = () => {
    if (!user) return false;
    
    // Check if user is locked out
    if (!user.lockoutEnabled) return false;
    
    // If lockoutEnd is null, it's a permanent lockout
    if (!user.lockoutEnd) return true;
    
    // Check if temporary lockout has expired
    const lockoutEndDate = new Date(user.lockoutEnd);
    const now = new Date();
    
    return lockoutEndDate > now;
  };

  const getLockoutMessage = () => {
    if (!isLockedOut()) return null;
    
    let message = '';
    
    if (!user?.lockoutEnd) {
      message = 'Your account has been permanently locked. You can only view content but cannot make any changes.';
    } else {
      const lockoutEndDate = new Date(user.lockoutEnd);
      const formattedDate = lockoutEndDate.toLocaleDateString() + ' ' + lockoutEndDate.toLocaleTimeString();
      message = `Your account has been temporarily locked. You can only view content but cannot make any changes. Lockout ends on: ${formattedDate}`;
    }
    
    // Add reason if available
    if (user?.lockoutReason) {
      message += `\n\nReason: ${user.lockoutReason}`;
    }
    
    return message;
  };

  return {
    isLockedOut: isLockedOut(),
    getLockoutMessage,
    user
  };
}; 