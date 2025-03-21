// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Hier definieer ik de API URL, waar ik data vandaan wil halen
const apiUrl = "https://fdnd-agency.directus.app/items/bib_stekjes";

const afbeeldingenUrl = "https://fdnd-agency.directus.app/items/bib_afbeeldingen?filter={%20%22type%22:%20{%20%22_eq%22:%20%22stekjes%22%20}}";

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
  // ----------------- Hier haal ik de stekjes op -----------------
   // Hier doe ik een FETCH naar de API URL
   const stekjesResponse = await fetch(apiUrl);
   // Hier wordt de response omgezet naar JSON
   const stekjesResponseJSON = await stekjesResponse.json();
  // ----------------- Hier haal ik de afbeeldingen op -----------------
    // Hier doe ik een FETCH naar de API URL
   const afbeeldingenResponse = await fetch(afbeeldingenUrl);
    // Hier wordt de response omgezet naar JSON
   const afbeeldingenResponseJSON = await afbeeldingenResponse.json();
    // Hier render ik de index.liquid template, en geef ik de data(stekjes) van de API mee
   response.render('index.liquid', {stekjes: stekjesResponseJSON.data, afbeeldingen: afbeeldingenResponseJSON.data})
})

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Hier maak ik een route aan voor de detailpagina van een stekje, met de parameter :id
app.get('/stekjes/:id', async function (request, response) {
  // Hier haal ik het ID uit de URL
  const stekjeId = request.params.id;
  // Hier doe ik een FETCH naar de API URL, met het ID van het stekje
  const stekjeResponse = await fetch(`${apiUrl}/${stekjeId}`);
  // Hier wordt de response omgezet naar JSON
  const stekjeData = await stekjeResponse.json();

    response.render('stekjes.liquid', {stekje: stekjeData.data})
});

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
