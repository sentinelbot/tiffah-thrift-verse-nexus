
// Format a date to a readable string
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSecs < 60) {
    return 'just now';
  } else if (diffInMins < 60) {
    return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(date);
  }
};
