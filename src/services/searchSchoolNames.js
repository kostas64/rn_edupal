export const searchSchoolName = searchInput => {
  try {
    return fetch('https://mobile.edupal.gr/get-schools', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({searchInput}),
    });
  } catch (e) {
    console.log('Error on search API ', e);
  }
};
