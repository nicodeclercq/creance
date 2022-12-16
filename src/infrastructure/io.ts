import * as IO from 'io-ts';

export const nullable = (type: IO.Mixed) => IO.union([type, IO.undefined, IO.null]);