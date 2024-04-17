// get url params
//
const urlParams = new URLSearchParams(window.location.search);

// getResterauntName or id from url
const restaurantName = urlParams.get("restaurant");
console.log(restaurantName + ' is the restaurant name');
