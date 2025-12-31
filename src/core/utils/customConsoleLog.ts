type CustomLogType = 'info' | 'success' | 'fail';
export const setCustomConsoleLog = (title: string, content: string, type: CustomLogType) => {
  const text = `%cv0.0.3%c${title}%c${content}%cMaciej Węgrzynek maciej@webpassion.pl`;
  let contentTextColor = '#33443f';
  let contentBgColor = '#cdd5e3';

  if (type === 'success') {
    contentBgColor = '#166d12';
  } else if (type === 'fail') {
    contentBgColor = '#aa002c';
  }

  if (type !== 'info') {
    contentTextColor = '#f3f6fa';
  }

  console.log(
    text,
    'color: #fff; font-size: 10px; display: inline-block; border-radius: 8px 0 0 8px; background-color: #ad3838; padding: 3px 6px 2px 10px; line-height: 1.25',
    'color: #f3f6fa; font-size: 10px; display: inline-block; background-color: #213a6d; padding: 3px 6px 2px 6px; line-height: 1.25',
    `color: ${contentTextColor}; font-size: 10px; display: inline-block; background-color: ${contentBgColor}; padding: 3px 6px 2px 4px; line-height: 1.25`,
    `color: ${contentTextColor}; font-size: 10px; display: inline-block; border-radius: 0 8px 8px 0; background-color: #6a7381; padding: 3px 10px 2px 6px; line-height: 1.25`
  );
};
