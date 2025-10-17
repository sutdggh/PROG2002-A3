const eventContainer = document.getElementById('event-details');
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');

if(eventId){
  fetchEventDetail(eventId, ev => {
    // insert event detail
    eventContainer.innerHTML = `
            ${ev.image_url ? `<img src="${ev.image_url}" alt="${ev.name}">` : ''}
            <h2>${ev.name}</h2>
            <p><strong>Category:</strong> ${ev.category}</p>
            <p><strong>Organization:</strong> ${ev.organization}</p>
            <p><strong>Mission:</strong> ${ev.mission}</p>
            <p><strong>Contact:</strong> ${ev.contact_email} | ${ev.phone}</p>
            <p><strong>Date:</strong> ${new Date(ev.start_datetime).toLocaleString()} - ${ev.end_datetime ? new Date(ev.end_datetime).toLocaleString() : 'N/A'}</p>
            <p><strong>Venue:</strong> ${ev.venue_name}, ${ev.address}, ${ev.city}, ${ev.state}</p>
            <p>${ev.description}</p>
            <p><strong>Ticket Price:</strong> $${(ev.ticket_price_cents/100).toFixed(2)}</p>
            <p><strong>Goal vs Raised:</strong></p>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${ev.raised_amount_cents/ev.goal_amount_cents*100}%">
                    $${(ev.raised_amount_cents/100).toFixed(2)} / $${(ev.goal_amount_cents/100).toFixed(2)}
                </div>
            </div>
            <button style="margin-top: 20px;" onclick="alert('This feature is currently under construction')">Register</button>
        `;
  });
}else{
  eventContainer.textContent = 'Event not found';
}
