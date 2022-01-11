module.exports = (id) => {
  $.get(`api/restuarant/${id}`, (user) => {
    if(user) {
      return true;
    } else {
      return false;
    }
  })
  .fail((err) => {
    console.log(`Restaurant doesn't exist: ${err.responseJSON.error}`);
  });
}
