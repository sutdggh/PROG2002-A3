const form = document.getElementById('search-form');
const resultsContainer = document.getElementById('results');
const categorySelect = document.getElementById('category');

// fill category for select option
fetchCategories(data => {
  categorySelect.innerHTML = '<option value="">All Categories</option>';
  data.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  });
});

// add submit listener
form.addEventListener('submit', e => {
  e.preventDefault();
  const params = {
    date: document.getElementById('date').value,
    location: document.getElementById('location').value,
    category_id: document.getElementById('category').value
  };
  fetchSearchEvents(params, renderResults);
});

// resnder results
function renderResults(events) {
  resultsContainer.innerHTML = '';
  if(events.length === 0){
    resultsContainer.textContent = 'No matching events found.';
    return;
  }
  events.forEach(ev => {
    const isPast = ev.end_datetime && new Date(ev.end_datetime) < new Date();
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
            ${ev.image_url ? `<img src="${ev.image_url}" alt="${ev.name}">` : ''}
            <div class="card-body">
                <h3>${ev.name} ${isPast ? '<span style="color:red; font-size:0.9rem;">(Past)</span>' : '<span style="color:green; font-size:0.9rem;">(Upcoming)</span>'}</h3>
                <p><strong>Category:</strong> ${ev.category}</p>
                <p><strong>Organization:</strong> ${ev.organization}</p>
                <p><strong>Date:</strong> ${new Date(ev.start_datetime).toLocaleString()}</p>
                <p>${ev.purpose}</p>
                <button onclick="location.href='event.html?id=${ev.id}'">View Details</button>
            </div>
        `;
    resultsContainer.appendChild(card);
  });
}
