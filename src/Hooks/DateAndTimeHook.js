import React from 'react'

const DateAndTimeHook = ({FullDate}) => {
    const date = new Date(FullDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = new Date(FullDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

  return (
    <React.Fragment>
         {`${date} at ${time}`}
    </React.Fragment>
  )
}

export default DateAndTimeHook