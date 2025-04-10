
export const formatAddress = (address: string): string => {
  return address;
};

export const formatCurrency = (amount: number): string => {
  return `KSh ${amount.toLocaleString()}`;
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatPhone = (phone: string): string => {
  return phone;
};
