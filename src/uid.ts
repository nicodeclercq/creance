let count = 0;

export const uid = () => `${new Date().getTime()}_${count++}`;