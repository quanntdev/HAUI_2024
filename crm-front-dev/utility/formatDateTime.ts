const formatDateTime = (date: string) => {
    const newDate = date.split("T")[0];
    const time = new Date(date);
    return `${newDate} at ${new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(time)}`;
};

export default formatDateTime;
