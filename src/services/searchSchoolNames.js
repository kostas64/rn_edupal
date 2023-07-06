export const searchSchoolName = searchInput => {
  try {
    console.log('calling searchSchoolName API ', searchInput);
    return fetch('http://192.168.2.26:3000/get-schools', {
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
