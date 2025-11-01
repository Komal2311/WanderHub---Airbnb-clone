mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates,
        style :"mapbox://styles/mapbox/streets-v12",
        zoom: 9 // starting zoom
});
const el = document.createElement('div');
el.className = 'custom-marker';
el.innerHTML = `
    <div style="
        width: 48px;
        height: 48px;
        background-color: #FF385C;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 3px solid white;
    ">
        <i class="fa-solid fa-house" style="color: white; font-size: 20px;"></i>
    </div>
`;
const marker1 = new mapboxgl.Marker({
    element: el,
    anchor: 'center'
})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset: 30}).setHTML(
                `<h6><b>${listing.title}</b></h6><p>Exact location will be provided after booking</p>`
            ))
        .addTo(map);