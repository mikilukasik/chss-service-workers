export const reloadHandler = [
  'reload',
  async () => {
    console.log('reload command received, will refresh the page');
    document.location.reload();
  },
];
