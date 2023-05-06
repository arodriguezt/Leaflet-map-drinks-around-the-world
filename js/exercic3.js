//https://cocktailsapi.xyz/

const markers = [
  { name: "kir_royale", coords: [48.8534, 2.3488] },
  { name: "pisco_sour", coords: [-9.189967, -75.015152] },
  { name: "sangria", coords: [40.4168, -3.7038] },
  { name: "piña_colada", coords: [18.220833, -66.590149] },
  { name: "caipirinha", coords: [-14.235004, -51.92528] },
  { name: "singapore_sling", coords: [1.352083, 103.819836] },
  { name: "mojito", coords: [21.521757, -77.781167] },
  { name: "negroni", coords: [42.8333, 12.8333] },
  { name: "manhattan", coords: [40.71427, -74.00597] },
  { name: "japanese_fizz", coords: [36.204824, 138.252924] },
  { name: "white_russian", coords: [61.52401, 105.318756] },
  { name: "Lassi - Mango", coords: [20.593684, 78.96288] },
  { name: "masala_chai", coords: [30.375321, 69.345116] },
  { name: "jewel_of_the_nile", coords: [30.0, 27.0] },
  { name: "thai_coffe", coords: [15.870032, 100.992541] },
];

let map = L.map("map", {
  //Indiquem els limits del mapa per a que no es repeteixi infinitament
  maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
  //Fixem la vista inicial a Espanya
}).setView([40.469487, -3.74922], 3);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Función para agregar un marcador al mapa
function addMarker(name, coords) {
  const marker = L.marker(coords).addTo(map);
  const originalIcon = marker.options.icon; // Guarda la imagen original del marcador

  marker.on("mouseover", async () => {
    try {
      // Envía una solicitud a la API de cócteles para obtener la imagen
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
      );
      const data = await response.json();
      const coctelImg = data.drinks[0].strDrinkThumb;

      marker.setIcon(
        L.icon({
          iconUrl: coctelImg,
          iconSize: [70, 70],
        })
      );
      marker._icon.classList.add("marcador");
    } catch (error) {
      console.error(error);
    }
  });

  marker.on("mouseout", () => {
    marker.setIcon(originalIcon); // Restaura la imagen original del marcador
    marker._icon.classList.add("marcador");
  });

  marker.on("click", async () => {
    try {
      //Intentem accedir a la api per el nom de la beguda
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
      );

      const data = await response.json();
      //Obtenim la imatge de la beguda
      const coctelImg = data.drinks[0].strDrinkThumb;
      //Afegim la imatge al marcador i modifiquem el seu tamany
      marker.setIcon(
        L.icon({
          iconUrl: coctelImg,
          iconSize: [70, 70],
        })
      );
      marker._icon.classList.add("marcador");
      //Recuperem el nom, ingredients i les instruccions
      const coctelName = data.drinks[0].strDrink;
      const coctelIngredients =
        data.drinks[0].strIngredient1 +
        ", " +
        data.drinks[0].strIngredient2 +
        ", " +
        data.drinks[0].strIngredient3;
      const coctelInstructions = data.drinks[0].strInstructions;
      //Creem un popup amb tota la informació de la beguda
      marker.bindPopup(
        `<img src="${coctelImg}" width="95%"><h1>${coctelName}</h1><p>Ingredientes: ${coctelIngredients}</p><p>Instrucciones: ${coctelInstructions}</p>`
      );
      map.setView(marker.latLng(),6);
    } catch (error) {
      console.error(error);
    }
  });
}
markers.forEach((marker) => {
  addMarker(marker.name, marker.coords);
});
