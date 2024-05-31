export function formatTime(dateString: string | undefined): string {
  const date = new Date(dateString!);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };


  const formatter = new Intl.DateTimeFormat("en-US", options);

  const formattedDate = formatter.format(date);

  return formattedDate;
}


export const skeletonItems = Array.from({ length: 9 }, (_, index) => index);
