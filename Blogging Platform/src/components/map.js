const express = require('express');
const app = express();
const cors = require('cors');
const { getJson } = require("serpapi");
const bodyParser = require('body-parser');
//const elasticsearch = require('elasticsearch');
const OpenAI = require('openai');
const { PrintSharp } = require('@mui/icons-material');
const { json } = require('react-router-dom');
require('dotenv').config({ path: '../.env' })

app.use(cors({ origin: 'http://localhost:3000' }));


// Middleware
app.use(bodyParser.json());

// Elasticsearch client setup
//const client = new elasticsearch.Client({ node: 'http://localhost:9200' });

const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY',
  dangerouslyAllowBrowser: true,
});

async function getLocation() {
  const response = await fetch("https://ipapi.co/json/");
  // const locationData = await response.json();
  return {
    "ip": "2605:cb80:875:56:158c:e1c7:db04:774a",
    "network": "2605:cb80:800::/38",
    "version": "IPv6",
    "city": "Chicago",
    "region": "Illinois",
    "region_code": "IL",
    "country": "US",
    "country_name": "United States",
    "country_code": "US",
    "country_code_iso3": "USA",
    "country_capital": "Washington",
    "country_tld": ".us",
    "continent_code": "NA",
    "in_eu": false,
    "postal": "60613",
    "latitude": 41.9555,
    "longitude": -87.6613,
    "timezone": "America/Chicago",
    "utc_offset": "-0500",
    "country_calling_code": "+1",
    "currency": "USD",
    "currency_name": "Dollar",
    "languages": "en-US,es-US,haw,fr",
    "country_area": 9629091.0,
    "country_population": 327167434,
    "asn": "AS17210",
    "org": "EVERYWHERE-WIRELESS-LLC"
}
}

async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}

async function getConcerts(city) {

    const { getJson } = require("serpapi");

    return new Promise((resolve, reject) => {
      getJson({
          q: "Concerts in " + city,
          engine: "google_events",
          location_requested: city,
          gl: "us",
          hl: "en",
          api_key: "6b57ca2643076036fe0b562f9b753da952f984a6ad194472ba909cb481dc2aad"
      }, (json) => {
          // Process the JSON data here if needed
          resolve(json["events_results"]); // Resolve the promise with the desired value
      });
  });
}

  async function getRestaurants(city) {

    const { getJson } = require("serpapi");

    return new Promise((resolve, reject) => {
      getJson({
          q: "Restaurants in " + city,
          engine: "google_maps",
          location_requested: city,
          gl: "us",
          hl: "en",
          api_key: "6b57ca2643076036fe0b562f9b753da952f984a6ad194472ba909cb481dc2aad"
      }, (json) => {
          // Process the JSON data here if needed
          const result = json['local_results'];
          const topThreeRestaurants = result.slice(0, 3).map((restaurant) => {
            return {
                position: restaurant.position,
                title: restaurant.title,
                rating: restaurant.rating,
                address: restaurant.address,
                open_state: restaurant.open_state
            };
        });
          resolve(topThreeRestaurants); // Resolve the promise with the desired value
      });
  });
}


  async function getSportEvents(city) {

    const { getJson } = require("serpapi");

    return new Promise((resolve, reject) => {
      getJson({
          q: "Sport events in " + city,
          engine: "google_events",
          location_requested: city,
          gl: "us",
          hl: "en",
          api_key: "6b57ca2643076036fe0b562f9b753da952f984a6ad194472ba909cb481dc2aad"
      }, (json) => {
          // Process the JSON data here if needed
          resolve(json["events_results"]); // Resolve the promise with the desired value
      });
  });
  }

const tools = [
  {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          latitude: {
            type: "string",
          },
          longitude: {
            type: "string",
          },
        },
        required: ["longitude", "latitude"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "getLocation",
      description: "Get the user's location based on their IP address",
      parameters: {
        type: "object",
        properties: {},
      },
    }
  },
  {
    type: "function",
    function: {
      name: "getConcerts",
      description: "Get concerts in a specified city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
          },
        },
        required: ["city"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "getRestaurants",
      description: "Get restaurants in a specified city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
          },
        },
        required: ["city"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "getSportEvents",
      description: "Get sports events in a specified city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
          },
        },
        required: ["city"],
      },
    }
  },
];

const availableTools = {
  getCurrentWeather,
  getConcerts,
  getRestaurants,
  getSportEvents,
  getLocation,
};

const messages = [
  {
    role: "system",
    content: `You are a helpful assistant. Only use the functions you have been provided with.`,
  },
];

async function agent(userInput) {
  messages.push({
    role: "user",
    content: userInput,
  });

  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: messages,
      tools: tools,
    });

    const { finish_reason, message } = response.choices[0];

    if (finish_reason === "tool_calls" && message.tool_calls) {
      const functionName = message.tool_calls[0].function.name;
      console.log("function name: ", functionName)
      const functionToCall = availableTools[functionName];
      const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
      const functionArgsArr = Object.values(functionArgs);
      const functionResponse = await functionToCall.apply(
        null,
        functionArgsArr
      );

      messages.push({
        role: "function",
        name: functionName,
        content: `
                The result of the last function was this: ${JSON.stringify(
                  functionResponse
                )}
                `,
      });
    } else if (finish_reason === "stop") {
      messages.push(message);
      return message.content;
    }
  }
  return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

app.post('/suggest-activities', async (req, res) => {
  const response = await agent(
    'suggest places according to current location and weather and specific suggest 3 restaurants, 3 concerts and 3 sports events happeining in this week, and give the addresses and the opeining hours of all of the places'
  );
  const locationData = await getLocation();
  console.log("location: ", locationData.city)
  const weatherData = await getCurrentWeather(locationData.latitude, locationData.longitude);

  const address_json = await getAddress(response)
  const coordinates = await getCoordinates(address_json, locationData.city)
  

  

  const jsonObject = {
    response: response,
    locationData: await locationData,
    weatherData: await weatherData,
    coordinates: coordinates
  };

console.log("Location API called")


  res.status(200).send(jsonObject);
});

async function getAddress(response){
  console.log("get address")
  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant. Only use the functions you have been provided with.`,
    },
    {
      role: "user",
      content: `find addresses from this text and put it in json with the name of the place, for example the json should be like this:
      {
      "restaurant": [
                { "name": "Girl & The Goat", "address": "809 W Randolph St" }
              ],
              "concert": [
                { "name": "DJ nighy", "address": "Metro" }
              ],
              "sportsEvent": [
                { "name": "Baseball Match", "address": "Wrigley Field" }
              ]
      }`,
    },
    {
      role: "user",
      content: response,
    },
    {
      role: "user",
      content: `give me the json in one line without any new lines`,
    },
  ];


   try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const recommendedReply = response.choices[0].message.content
    const parsedJSON = JSON.parse(recommendedReply);
    console.log(parsedJSON)
    return parsedJSON;
  } catch (error) {
    console.error("Error:", error);
    console.log("An error occurred while generating the recommendation." );
  }
}

async function getCoordinates(addresses, city) {
  console.log("get Coordinates")
  const apiKey = 'AIzaSyDk6vYn7NtcXKvB73QxsrzgX1iXosAollg';
  const geocodedLocations = {};
  console.log(addresses)
  // Loop through each category of addresses
  for (const [category, categoryAddresses] of Object.entries(addresses)) {
      geocodedLocations[category] = [];
      console.log(category)
      console.log("da: ",categoryAddresses)
      
      // Loop through each entry in the category
      for (const entry of categoryAddresses) {
          const { name, address } = entry;
          const fullAddress = `${address}, ${city}`;
          const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;

          try {
              const response = await fetch(url);
              const data = await response.json();
              if (data.status === 'OK' && data.results[0]) {
                  const location = data.results[0].geometry.location;
                  geocodedLocations[category].push({ name, address, location });
              } else {
                  console.error(`Geocoding for ${name} (${address}) in ${category} was not successful for the following reason: ${data.status}`);
              }
          } catch (error) {
              console.error(`Geocoding error for ${name} (${address}) in ${category}:`, error);
          }
      }
  }

  return geocodedLocations;
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));