function fetchCategories(callback) {
  fetch('/api/categories')
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}

function fetchHomeEvents(callback) {
  fetch('/api/events/home')
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}

function fetchSearchEvents(params, callback) {
  const query = new URLSearchParams(params).toString();
  fetch('/api/events/search?' + query)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}

function fetchEventDetail(id, callback) {
  fetch('/api/events/' + id)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}
