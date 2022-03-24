export const nextSpinnerChar = {
  '/': '-',
  '-': '\\',
  '\\': '|',
  '|': '/',
};

export const getNextSpinnerChar = (char) => {
  return nextSpinnerChar[char] || ''; //as string;
};
