const eventsContainer = document.getElementById('events');

function renderEvents(events) {
  eventsContainer.innerHTML = '';
  // for each event and create card
  events.forEach(ev => {
    const isPast = ev.end_datetime && new Date(ev.end_datetime) < new Date;
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
    eventsContainer.appendChild(card);
  });
}

fetchHomeEvents(renderEvents);
