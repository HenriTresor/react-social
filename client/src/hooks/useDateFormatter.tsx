import { useState } from 'react';

const useDateFormatter = (date: Date) => {
    const options = {
        // weekday: '',
        hour:'numeric',
        minute:'numeric',
        year:'numeric',
        month: 'short',
        hour12:false,
        day:'numeric',
    };

    const formattedDate = new Date(date).toLocaleString('en-US',options);
    return { formattedDate };
};

export default useDateFormatter;
