export const toCamelCase = (str: string) => str
  .split('-')
  .map(([firstLetter, ...tail], index) => `${
    index > 0
      ? firstLetter.toUpperCase()
      : firstLetter.toLowerCase()
   }${
     tail.join('').toLowerCase()
   }`
  )
  .join('');

export const toPascalCase = (str: string) => str
  .split('-')
  .map(([firstLetter, ...tail]) => `${firstLetter.toUpperCase()}${tail.join('').toLowerCase()}`)
  .join('');