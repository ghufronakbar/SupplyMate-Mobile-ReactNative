const formatTime = (dateString: Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());

  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

  if (diffTime < 1000 * 60 * 60) {
    // kurang dari 1 jam
    return diffMinutes === 1 ? "1 menit lalu" : `${diffMinutes} menit lalu`;
  } else if (diffTime < 1000 * 60 * 60 * 24) {
    // kurang dari 1 hari
    return diffHours === 1 ? "1 jam lalu" : `${diffHours} jam lalu`;
  } else if (diffDays < 7) {
    // kurang dari 1 minggu
    return diffDays === 1 ? "1 hari lalu" : `${diffDays} hari lalu`;
  } else {
    // lebih dari atau sama dengan 1 minggu
    return diffWeeks === 1 ? "1 minggu lalu" : `${diffWeeks} minggu lalu`;
  }
};

export default formatTime;
