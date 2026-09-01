/* ==========================================================
   location.js — GPS / Latitude / Longitude / Google Maps
   Used on cart.html to auto-fill delivery coordinates.
   ========================================================== */

window.RS = window.RS || {};

RS.Location = (function () {
  function detect() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported on this device."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(new Error(err.message || "Could not detect location.")),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  function mapsLink(lat, lng) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  function embedMapURL(lat, lng) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  return { detect, mapsLink, embedMapURL };
})();
