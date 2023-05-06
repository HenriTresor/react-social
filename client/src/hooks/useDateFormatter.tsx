import { useState } from 'react';


export const options = {
    // weekday: '',
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'short',
    hour12: false,
    day: 'numeric',
};

const useDateFormatter = (date: Date) => {

    const formattedDate = new Date(date).toLocaleString('en-US',options);
    return { formattedDate };
};

export default useDateFormatter;
