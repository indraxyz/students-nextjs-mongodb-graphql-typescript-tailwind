import { format } from "date-fns";

export const formatDateTime = (
  dateString: string | undefined | null
): string => {
  if (!dateString) return "N/A";

  try {
    let date: Date;

    if (typeof dateString === "string") {
      if (dateString.includes("T") && dateString.includes("Z")) {
        date = new Date(dateString);
      } else if (dateString.includes("T")) {
        date = new Date(dateString);
      } else {
        date = new Date(dateString);
      }
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "Invalid date";
    }

    return format(date, "dd MMM yyyy, HH:mm");
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return "Error parsing date";
  }
};

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return format(date, "dd MMM yyyy");
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return "Error parsing date";
  }
};

export const formatTime = (dateString: string | undefined | null): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid time";
    }

    return format(date, "HH:mm");
  } catch (error) {
    console.error("Error parsing time:", dateString, error);
    return "Error parsing time";
  }
};

export const getRelativeTime = (
  dateString: string | undefined | null
): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days ago`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    console.error("Error parsing relative time:", dateString, error);
    return "Error parsing relative time";
  }
};

export const isValidDate = (dateString: string | undefined | null): boolean => {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};
