// Filepath: lib/i18n/attraction-faqs.ts
// Version: 1.0
// Nome da Versão: "FAQ por atrativo (31 slugs) — en/es (pt = fallback no dado)"
//
// O `pt` é a matriz e vive em `app/data/attractions.ts` (cada atrativo tem o seu `faq`); aqui só
// en/es. Consumidor: `AttractionPageContent` usa `ATTRACTION_FAQS[locale][slug] ?? a.faq`.
// O JSON-LD (faqSchema) continua em pt, direto do dado.

import type { Locale } from "./config";

export type FaqItem = { q: string; a: string };

export const ATTRACTION_FAQS: Record<Locale, Record<string, FaqItem[]>> = {
  // pt é a matriz: fallback no dado (app/data/attractions.ts).
  pt: {},
  en: {
    "cataratas-do-iguacu": [
      {
        q: "How long does the Brazilian side of the Falls take?",
        a: "Three hours cover the essentials: the shuttle bus, the 1.3 km trail, the Devil's Throat walkway and the lift. Anyone photographing at a slower pace, or queueing in high season, gets closer to four. Half a day is the safe estimate if you still want to fit something else in.",
      },
      {
        q: "Are the shuttle bus and the lift included in the ticket?",
        a: "Both are. The bus from the visitor centre to the trailhead and the panoramic lift at the end of the walk are part of the visit. What isn't included are the add-on experiences, such as Macuco Safari and the helicopter flight, booked separately.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "In high season and on holidays, yes — the park controls admission and the busiest time slots close early. Off-peak you can usually sort it out on the day, but arriving early still beats any other strategy.",
      },
      {
        q: "Are the Brazilian and Argentine sides of the Falls the same visit?",
        a: "No, and one doesn't replace the other. The Brazilian side delivers the panorama: you see the whole set head-on, in less time. The Argentine side takes you along walkways to the mouth of the Throat and needs a full day. With three days or more, most people do both, on separate days.",
      },
      {
        q: "Can I combine the Falls and the Bird Park on the same day?",
        a: "Yes, and it's the most efficient pairing in Foz — the Bird Park sits at the same National Park entrance. The usual order is the Falls early, when the trail is emptier and the light is better, leaving the birds for after lunch.",
      },
      {
        q: "What should I bring to the Falls?",
        a: "Closed, comfortable shoes, sunscreen, water and a light rain poncho — the mist at the Throat genuinely soaks you, and an umbrella won't help because the water comes from below. Drones and pets are not allowed in the park.",
      },
      {
        q: "Is there anywhere to eat inside the park?",
        a: "There is. Porto Canoas, at the end of the trail, has a restaurant overlooking the Iguaçu River, a snack bar and a souvenir shop. It's where almost everyone stops before catching the bus back.",
      },
    ],
    "parque-das-aves": [
      {
        q: "How long does a visit to the Bird Park take?",
        a: "Two hours cover the full circuit at a normal pace. With children, or stopping to photograph at every aviary, it stretches to three. It's one of the few attractions in Foz that fits comfortably into half a day alongside something else.",
      },
      {
        q: "Do I need a separate ticket from the Falls?",
        a: "Yes. The Bird Park and Iguaçu National Park are independent attractions with their own entrances and ticket desks, even though they sit 500 metres apart.",
      },
      {
        q: "Is the Bird Park near the Falls?",
        a: "It's 500 metres from the National Park entrance — the most efficient pairing for a single day in Foz. The only decision is the order: the Falls reward an early start because of queues and light; the birds are livelier in the morning and slow down in the afternoon heat.",
      },
      {
        q: "Is the trail accessible for wheelchairs or strollers?",
        a: "It is. The 1.5 km route was built with accessible paving from end to end, with no unavoidable stairs. Strollers move along the same path without difficulty.",
      },
      {
        q: "Can I visit on a rainy day?",
        a: "You can, and it's one of the best plans for that kind of day in Foz. The canopy covers much of the trail, the aviaries stay open and the birds don't disappear — unlike boat rides or helicopter flights, which depend on the weather.",
      },
      {
        q: "Can I take photos inside the aviaries?",
        a: "Yes, without flash. The restriction protects the animals, and it helps in practice: flash blows out the colour of the feathers and kills the forest background that makes the shot work.",
      },
      {
        q: "Is it worth it if I'm already seeing the Falls?",
        a: "Yes, because it isn't the same experience. At the Falls you look at a landscape from a distance; here you step inside the enclosure and stand a metre from a macaw. For anyone travelling with children, it's usually the outing they remember most.",
      },
    ],
    "marco-das-tres-fronteiras": [
      {
        q: "Is the Triple Frontier Landmark open every day?",
        a: "No. It opens Tuesday to Sunday, 1:30pm to 9pm, and closes on Mondays. Because it only opens in the afternoon, it never competes with the Falls or Itaipu — it comes after them, on the same day.",
      },
      {
        q: "What's the best time to visit?",
        a: "About an hour before sunset. That leaves time to walk the stage village and the memorial without rushing, claim a spot at the viewpoint before it fills, and still catch the obelisk lit up after dark — a completely different scene from the golden-hour one.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "The Landmark charges admission and works with time slots. In high season and on show days, sorting the ticket out beforehand keeps you from arriving at the busiest hour and missing a decent spot at the viewpoint.",
      },
      {
        q: "Can I see all three countries from the Landmark?",
        a: "You can. From the Brazilian platform you see the Argentine marker on one side and the Paraguayan on the other, each painted in its national colours, above the confluence of the Iguaçu and Paraná rivers. It's the most recognisable photo of the Triple Frontier.",
      },
      {
        q: "Do I need a passport to visit the Landmark?",
        a: "No. The Landmark sits on Brazilian territory and you cross no border to get there. Documents only come into play on outings that cross into Puerto Iguazú or Ciudad del Este.",
      },
      {
        q: "What else is there besides the viewpoint?",
        a: "The Jesuit Missions stage village, recreating the region in the 16th and 17th centuries; the Cabeza de Vaca Memorial, about the first European to record the Falls in 1542; and the Three Borders Show in the late afternoon, with music and dance from the frontier.",
      },
      {
        q: "Can I have dinner at the Landmark?",
        a: "You can. The Cabeza de Vaca restaurant serves Tuesday to Sunday, 3pm to 10pm, with the three countries in front of you. It's one of the few tables in Foz with that view, so booking ahead pays off in high season.",
      },
    ],
    "itaipu-binacional": [
      {
        q: "What's the difference between the Itaipu Panoramic and the Itaipu Special tour?",
        a: "The Panoramic is the external circuit: a panoramic bus past the spillway viewpoint, the dam and the reservoir, around 1h30, with an audio guide in Portuguese, English and Spanish. The Special goes inside the plant — control room, a turbine shaft and the interior of the dam — in about 2h30, with internal viewpoints the Panoramic never reaches. Neither is a better version of the other: they serve different purposes.",
      },
      {
        q: "How does the Itaipu Illuminated tour work?",
        a: "It's at night and purely for contemplation. The dam is lit by 288 floodlights in effects synchronised to a soundtrack, and the narration tells the plant's story in Portuguese, English and Spanish, with a view of the reservoir from a dedicated viewpoint. The show itself lasts about 30 minutes; the full outing, with transfers and photo time, runs to roughly 2 hours.",
      },
      {
        q: "Which Itaipu tour should I choose?",
        a: "If it's your first visit and time is short, the Panoramic delivers the scale of the project in 1h30 and is the only one suited to reduced mobility. If you want to understand how the plant works from the inside, the Special is the reason to come. The Illuminated replaces neither — it's the night complement for someone who has already seen the dam by day.",
      },
      {
        q: "Do I need ID to visit Itaipu?",
        a: "For the Special tour, yes: original photo ID, national ID card or passport, plus the safety rules of an industrial site. It's the requirement that catches most people out at the gate — a photocopy or a photo on your phone won't do.",
      },
      {
        q: "Does the Illuminated tour run every day?",
        a: "No. It runs on Fridays and Saturdays at 7pm. It's the most important scheduling constraint at Itaipu: if you're not in Foz on one of those nights, it simply drops out of the plan — and if you are, it competes with sunset at the Triple Frontier Landmark.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "It's worth it, above all for the Special, which has limited places per time slot, and for the Illuminated, which only runs two nights a week. The Panoramic usually has more room, though in high season the early morning slots fill first.",
      },
      {
        q: "Do Itaipu and the Falls fit on the same day?",
        a: "They fit, but it's rushed: they sit on opposite sides of the city. It's more comfortable to set aside a day — or a solid half — for the Itaipu axis and leave the Falls corridor for another, especially if you want the Illuminated tour at night.",
      },
      {
        q: "What else is in the Itaipu complex?",
        a: "The Bela Vista Biological Refuge and the Ecomuseum sit on the same axis and are what turns a half-day visit into a full one — one with trails and rescued wildlife, the other with the history of the region and of the dam's impact.",
      },
    ],
    "refugio-biologico-bela-vista": [
      {
        q: "What time does the Biological Refuge open?",
        a: "Departures run at fixed times — 8:30am, 10:30am, 2:30pm and 3:30pm — Wednesday to Monday. It closes on Tuesdays. This isn't a turn-up-whenever visit: you join a guided group at the slot you booked, and that's what organises the rest of the day.",
      },
      {
        q: "Is the Biological Refuge the same tour as the dam?",
        a: "No. The dam and the Refuge sit in the same complex but are independent visits, each with its own ticket and schedule. One is engineering, the other is wildlife and forest — and plenty of people do both in the same half day.",
      },
      {
        q: "Which animals can I see at the Refuge?",
        a: "Jaguars, ocelots, tapirs, macaws and harpy eagles, among other rescued or rehabilitating species. It's the direct counterpoint to Iguaçu National Park, where those same animals exist but live far from any visitor trail.",
      },
      {
        q: "How long does the visit take?",
        a: "Between 2h and 2h30, counting the internal transport and the 1.7 km guided trail. The pace is deliberately slow: there are stops at the enclosures, the lakes and the botanical garden along the way.",
      },
      {
        q: "Can I combine it with the Itaipu Panoramic tour on the same day?",
        a: "You can, and it's the most logical pairing — they're inside the same complex. The Panoramic takes 1h30 and the Refuge 2h30, so together they fill a solid half day. What decides the order is the Refuge's fixed departure slot, not preference.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "It's worth it, because each departure has a limited number of places and there are only four a day. In high season, leaving it to the gate usually means taking a slot that doesn't fit the rest of your day.",
      },
      {
        q: "Is it good for children?",
        a: "It is, and it tends to be the relief valve of a day given over to Itaipu: after the dam and the machine hall, seeing a jaguar a few metres away changes the mood entirely. The trail is flat and guided, with frequent stops.",
      },
    ],
    "dreams-park-show": [
      {
        q: "Is Dreams Park worth it on a sunny day?",
        a: "Yes, if you like theme parks and have extra time. On rainy days, it jumps up in priority: it's one of Foz's best covered plan Bs.",
      },
      {
        q: "How much time should I set aside?",
        a: "Most families take 3 to 5 hours. Those who want to see everything at a calm pace reserve the day.",
      },
      {
        q: "Is it good for children?",
        a: "Very. Dinosaurs, miniatures and the wax museum usually please different age groups in the same party.",
      },
      {
        q: "Is there a combo with Eco Park?",
        a: "Yes — the market and the group itself often offer a combined pass. Check on the official website what's included in each option.",
      },
      {
        q: "Is it near the Falls?",
        a: "It's on Av. das Cataratas, on the way to the National Park — same axis, no detour. But it's a separate attraction with its own ticket: it fits after a morning at the falls, not inside it.",
      },
      {
        q: "Until what time is Dreams Park open?",
        a: "It depends on the attraction and the day, but the complex runs far later than the rest of Foz: the Wax Museum closes at 9pm or 10pm and the Ice Bar at 10pm or 11pm. Since the Falls shut at 4pm and the Bird Park at 4:30pm, it's one of the few options left for the evening.",
      },
      {
        q: "Which ones work on a rainy day?",
        a: "The Wax Museum, World Wonders, the Ice Bar and the Motor Show are indoors and unaffected by weather. The Valley of the Dinosaurs is an open-air trail and so is the Eco Park: in heavy rain those two lose a lot and are the first to drop off the list.",
      },
    ],
    aquafoz: [
      {
        q: "What is AquaFoz?",
        a: "It's the Foz do Iguaçu aquarium, 23,000 m² holding around 3.3 million litres of water. It brings together more than 300 freshwater and saltwater species across three floors, focused on the ecosystems of the Paraná and Iguaçu river basins — the same waters that form the Falls.",
      },
      {
        q: "How long does a visit to AquaFoz take?",
        a: "1h30 to 2 hours at a normal pace. It fits comfortably into half a day alongside another attraction on the Falls corridor, and it's short enough to add to a day that already has a main event.",
      },
      {
        q: "What time is the last admission?",
        a: "5pm, even though the aquarium doesn't close until 6:30pm. It's the detail that causes the most frustration: turning up at 5:30pm thinking there's still time means not getting in. Worth building into the late-afternoon plan.",
      },
      {
        q: "What's in the Iguaçu River Gallery?",
        a: "It's the most local part of the collection: displays of the Upper, Middle and Lower Iguaçu, showing how the fauna shifts along the river. The upper stretch brings rock catfish, Iguaçu tetra and armoured catfish; the middle brings wolf fish, jacundá, pintado and Iguaçu mandi, among others.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "In high season and on holidays it helps, above all for mid-afternoon slots. Since the last admission is at 5pm, leaving the decision to the end of the day risks finding the desk already closed.",
      },
      {
        q: "Does it work on a rainy day?",
        a: "Perfectly — it's fully indoors and air-conditioned. Along with the Wax Museum and the Ice Bar, it's one of Foz's answers for the day the national park loses its appeal, with the advantage of sitting on the same corridor as the Falls.",
      },
      {
        q: "Is it good for children?",
        a: "It's one of the outings in Foz that works best with children: a short, covered route with interactive panels and educational areas. And unlike the national park trails, here the pace belongs to whoever wants to stop at every tank.",
      },
    ],
    "vale-dos-dinossauros": [
      {
        q: "Do the dinosaurs at the Valley actually move?",
        a: "They do. They're life-size replicas with movement and sound, spread along the trail. It isn't a museum of still statues — and that detail is exactly what impresses children and startles the youngest ones.",
      },
      {
        q: "How long does the Valley of the Dinosaurs take?",
        a: "Between 1h and 2h, depending on pace and photo stops. It's an attraction that doesn't eat a day: it fits into an afternoon alongside another area of the complex, or after a morning at the Falls.",
      },
      {
        q: "Which is the biggest dinosaur at the Valley?",
        a: "The Giganotosaurus, over 14 metres — a predator that lived in the Patagonia region and was larger than the Tyrannosaurus. It stands halfway along the route and is the most contested photo stop.",
      },
      {
        q: "Does it work on a rainy day?",
        a: "It's an open-air trail, so heavy rain is a problem. Since it sits inside Dreams Park Show, the alternative is immediate: the Wax Museum, World Wonders and the Ice Bar are indoors and on the same grounds.",
      },
      {
        q: "Do I need a separate ticket from the other Dreams Park attractions?",
        a: "Yes. Inside the complex, tickets are sold per attraction, not per address. It's worth deciding in advance which ones you want — that choice is what defines the day's time and cost.",
      },
      {
        q: "Is it suitable for small children?",
        a: "It's the attraction in the complex that children enjoy most, with one caveat: the sound and movement of the largest models tend to frighten anyone under three or four. Worth a warning before entering the big-predator section.",
      },
    ],
    "museu-de-cera": [
      {
        q: "How many figures does the Wax Museum in Foz have?",
        a: "Over 100 figures across 17 sets, spanning film, music, television, sport, politics and history, with an area given over to superheroes and villains. The sets are built for visitors to step in and photograph alongside them.",
      },
      {
        q: "Can I take photos at the Wax Museum?",
        a: "You can, and it's the whole point. The figures sit in open sets, mostly without barriers, precisely so they photograph well. Allow more time than you'd think: the queue for the best-known characters is what eats the minutes.",
      },
      {
        q: "How long does the visit take?",
        a: "1h to 1h30 at a normal pace. It's one of the quicker attractions at Dreams Park Show, which makes it easy to add to the end of an already full day.",
      },
      {
        q: "Does it work on a rainy day?",
        a: "Perfectly: it's indoors and air-conditioned from start to finish. Along with the Ice Bar and World Wonders, it's the core of the complex's rainy-day plan in Foz.",
      },
      {
        q: "Until what time is it open?",
        a: "Until 9pm Sunday to Wednesday and 10pm Thursday to Saturday. In a plan where the Falls close at 4pm and the Bird Park at 4:30pm, it's one of the few attractions in the city still open in the evening.",
      },
      {
        q: "Do I need a separate ticket from the other attractions in the complex?",
        a: "Yes. Each attraction at Dreams Park Show has its own ticket. If you plan to combine two or three, work out the order before arriving — the grounds are large and there's walking between them.",
      },
    ],
    "dreams-ice-bar": [
      {
        q: "Do I need to bring a coat to the Dreams Ice Bar?",
        a: "No. Coats and gloves are handed out at the entrance and are part of the visit. The room sits at 15 degrees below zero, so the thermal gear comes with it — just turn up as you are.",
      },
      {
        q: "How long does a visit to the Ice Bar take?",
        a: "Between 30 and 45 minutes, counting preparation and the session itself. That's deliberate: nobody wants much longer at that temperature, and the attraction was designed to be short and intense.",
      },
      {
        q: "What time is the last session?",
        a: "9:10pm Sunday to Wednesday and 9:50pm Thursday to Saturday, even though the bar closes at 10pm or 11pm. It's the detail that causes the most frustration: arriving near closing time is no guarantee of getting in.",
      },
      {
        q: "Can children go into the Ice Bar?",
        a: "They can, and it's usually one of the highlights for them — the novelty of extreme cold in a place where it's 35 degrees outside works at any age. Coats and gloves are provided for everyone.",
      },
      {
        q: "Do I need a separate ticket from the other Dreams Park attractions?",
        a: "Yes, tickets are sold per attraction. Since the visit here is short, the Ice Bar is usually paired with the Wax Museum or the Motor Show, both on the same grounds and also indoors.",
      },
      {
        q: "What's inside besides the ice?",
        a: "The bar serves drinks in glasses carved from ice, and all the furniture — benches, tables, the counter — is made of the same material. The construction itself is the attraction: you're inside a structure that has to be kept below freezing around the clock.",
      },
    ],
    "cataratas-jl-shopping": [
      {
        q: "Is it worth including a mall in a Foz itinerary?",
        a: "Yes as support: eating, buying what's missing, air conditioning and cinema. You don't need to “spend a day” there if your focus is nature.",
      },
      {
        q: "JL Shopping or Catuaí Palladium?",
        a: "Catuaí is bigger and more complete for leisure; JL is practical and well located. Many visitors use whichever is on the way to their hotel.",
      },
      {
        q: "Is there food there?",
        a: "Yes — a food court and restaurant options. Useful after a day at the park or before heading back to the hotel.",
      },
      {
        q: "Does it work on rainy days?",
        a: "It works well: shopping, cinema and a meal without depending on the sun.",
      },
      {
        q: "Is it the same as shopping in Paraguay?",
        a: "No. Here it's a mall in Brazil, with local prices and rules — a different logic of “border shopping”.",
      },
    ],
    "shopping-catuai-palladium": [
      {
        q: "Is Catuaí Palladium the biggest mall in Foz?",
        a: "It's the most cited as the largest and most complete in the region for stores and leisure. Ideal if you want variety in one place.",
      },
      {
        q: "How much time should I set aside?",
        a: "2 to 5 hours, depending on shopping, meals and cinema. You can “lose” the day there if it's your main plan.",
      },
      {
        q: "Is it on the way to the Falls?",
        a: "It's on Av. das Cataratas — the city's tourist axis. Easy to combine with a hotel on the same avenue.",
      },
      {
        q: "Is it worth going with children?",
        a: "Yes: food court, cinema and covered space help on hot or rainy days.",
      },
      {
        q: "Does it replace shopping in Paraguay?",
        a: "Not in the free shop/border sense. It's a Brazilian mall for leisure and convenience.",
      },
    ],
    "roda-gigante-yup-star": [
      {
        q: "Is the Yup Star open every day?",
        a: "No: it closes on Wednesdays, and runs from 12:30pm to 8:30pm on the other days. Since the Triple Frontier Landmark closes on Mondays, the two cover each other — if one is shut on the evening you have free, the other is open.",
      },
      {
        q: "How long does a ride on the Yup Star take?",
        a: "The turn itself takes about 12 minutes, enough for the full rotation and the photos. Allow roughly an hour in total, counting the queue and getting there — it's one of the few attractions in Foz that fits into a short gap.",
      },
      {
        q: "What's the best time to go up?",
        a: "Late afternoon, to catch the sunset over the meeting of the rivers and come down with the city already lit. Early afternoon has a much shorter queue, but the light is harsh and the view repays less — that's the trade.",
      },
      {
        q: "Does it run on a rainy day?",
        a: "It does: the cabins are enclosed and air-conditioned, so rain and strong heat don't interrupt operations. What suspends the ride is strong wind, for safety — a different condition from the one that spoils the city's other attractions.",
      },
      {
        q: "Can I combine it with the Triple Frontier Landmark on the same day?",
        a: "You can, and it's the most efficient sequence: since the ride is short, you go up in the late afternoon and head on to dinner at the Landmark, whose restaurant serves until 10pm. Both sit in southern Foz, with no need to cross the city.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "It helps for the sunset slots, which are the busiest of the day. Buying ahead or picking an early-afternoon time are the two ways to avoid losing time in the queue.",
      },
      {
        q: "Can children ride?",
        a: "They can, and the enclosed cabin makes it comfortable even for anyone wary of heights. Age and accompaniment rules are set by the operator — worth confirming on the day.",
      },
    ],
    "macuco-safari": [
      {
        q: "How does the Macuco Safari work?",
        a: "Three linked stages: 2 km of jungle in an electric vehicle, a 600-metre walk with a bilingual guide, and finally the boat. Between the trail and the pier there's a deck with a shop, toilets and lockers. Time on the water is 25 to 30 minutes.",
      },
      {
        q: "Is Macuco Safari included in the Falls ticket?",
        a: "No. Both happen inside Iguaçu National Park, but they're independent: Macuco has its own ticket and schedule, on top of park admission. It sits at km 25 of the BR-469; the viewpoints trail is at km 18.",
      },
      {
        q: "Should I do Macuco before or after the Falls trail?",
        a: "After. The boat soaks you properly, and walking the viewpoints in wet clothes ruins the most photographed part of the day. The natural order is the Falls trail in the morning, Macuco next — and the deck lockers solve the change of clothes.",
      },
      {
        q: "Do Macuco and the Falls fit on the same day?",
        a: "They do, and it's the classic pairing: 3 hours of trail plus 2 to 3 for Macuco fill a full day. What doesn't fit is adding the Bird Park on top — the arithmetic breaks and all three end up rushed.",
      },
      {
        q: "Will I get very wet?",
        a: "Very, and that's the point: the boat runs into the spray zone of the falls. Bring a change of clothes, leave anything that can't get wet in the deck lockers, and use a waterproof pouch for your phone.",
      },
      {
        q: "Can the tour be cancelled or changed?",
        a: "It can. Accessibility and boat access depend on navigation conditions on the Iguaçu River, which shift with water volume and weather. Worth confirming before building the day around it.",
      },
      {
        q: "Are Macuco and Gran Aventura (Argentina) the same thing?",
        a: "They're similar boat rides, but in different parks and countries: Macuco is on the Brazilian side, in Iguaçu National Park; Gran Aventura is in Iguazú National Park, Argentina. Doing both repeats the experience — most people pick one.",
      },
    ],
    "cataratas-lado-argentino": [
      {
        q: "What are the circuits on the Argentine side of the Falls?",
        a: "There are three. The Upper passes over the drops, with few stairs. The Lower descends to river level, with moderate staircases and Salto Bossetti, where the spray genuinely soaks you. And the Devil's Throat, reached by eco-train plus a 1 km walkway, facing an 82-metre drop head-on.",
      },
      {
        q: "How long does a visit to the Argentine park take?",
        a: "5 to 6 hours for the three circuits, before counting the border and the drive. Since the park closes at 4pm, your entry time decides how much you get to see: arrive after 10am and one circuit gets left out.",
      },
      {
        q: "Do I need a passport for the Argentine Falls?",
        a: "Original photo ID — a national ID card in good condition or a passport. Photocopies and phone photos don't work at immigration. Minors and anyone crossing by car face additional requirements worth checking before setting off.",
      },
      {
        q: "What's the difference between the Brazilian and Argentine sides?",
        a: "The Brazilian delivers the panorama: you see the whole set head-on, in about 3 hours. The Argentine delivers proximity: walkways above, below and right to the mouth of the Throat, over 5 to 6 hours. One shows the scale, the other makes you feel the force — they don't replace each other.",
      },
      {
        q: "Can I do both sides on the same day?",
        a: "Not properly: two large parks, in different countries, with immigration in between. The recommendation is consecutive days — the Brazilian first for the panorama, the Argentine the next day for the immersion. That way the second visit doesn't feel like a repeat of the first.",
      },
      {
        q: "Does the Brazilian ticket work in Argentina?",
        a: "No. These are national parks in different countries, with independent ticket offices. The Iguazú National Park ticket is bought separately, and Gran Aventura — the boat ride that departs inside it — is another ticket again.",
      },
      {
        q: "What should I bring?",
        a: "A rain poncho, which is essential here: it soaks you far more than the Brazilian side, and Salto Bossetti guarantees it even without rain. Non-slip shoes for the wet walkways, water and — if you're doing Gran Aventura — swimwear.",
      },
    ],
    "templo-budista-foz": [
      {
        q: "What days is the Chen Tien Buddhist Temple open?",
        a: "Tuesday to Sunday, 9:30am to 4:30pm — with one exception that usually slips past: it closes on the first Sunday of every month. Worth checking the date before building a day around it, since it's the only rule of its kind among Foz's attractions.",
      },
      {
        q: "Do I have to pay to enter the temple?",
        a: "No. Admission is free and there's no ticket desk — one of the few attractions in Foz like that. In exchange, the place asks for conduct: it's a working religious site, not a museum.",
      },
      {
        q: "What is there to see at Chen Tien?",
        a: "Around 120 statues representing reincarnations of Buddha, three central Buddhas — the seated Mi La Pu-San at seven metres, the reclining Shakyamuni and Amitabha in bronze —, Kuan Yin, pagodas, gardens and a main temple of more than two thousand square metres over two floors.",
      },
      {
        q: "How long does the visit take?",
        a: "30 to 40 minutes for the main route, stretching to an hour if you linger in the gardens or want a moment of quiet. It's the shortest attraction on the western corridor and the easiest to slot into a gap in the day.",
      },
      {
        q: "Can I combine it with Itaipu on the same day?",
        a: "You can, and it's the most natural fit: both sit on the western corridor, alongside the Biological Refuge and the Ecomuseum. Since the temple takes under an hour, it follows the dam without competing with anything.",
      },
      {
        q: "Are there dress or behaviour rules?",
        a: "Yes. Modest clothing, quiet in the areas of worship and no irreverent poses beside the statues. Photography is allowed, within reason. And bring repellent: the grounds are wooded and there are mosquitoes.",
      },
      {
        q: "Is there a view of the city?",
        a: "There is, and it's one of the reasons to go up: from the higher ground you can see Foz do Iguaçu and, across the river, Ciudad del Este in Paraguay. It's a different angle on the frontier from the one at the Triple Frontier Landmark.",
      },
    ],
    "mesquita-omar-ibn-al-khattab": [
      {
        q: "What time is the Foz mosque open for visits?",
        a: "Tuesday to Saturday in two windows — 8:30am to 11:30am and 2pm to 5:30pm — and on Mondays only in the afternoon, 2pm to 5:30pm. It doesn't open on Sundays. The midday break is what catches most people out: arriving at lunchtime means waiting until 2pm.",
      },
      {
        q: "Can tourists go inside the mosque?",
        a: "They can, during set visiting hours. It's an active place of worship, not a museum: visits happen outside prayer times and follow the rules of the community that maintains it.",
      },
      {
        q: "Do I need to buy a ticket?",
        a: "Yes, visits are ticketed. Since the time windows are short and the mosque closes at midday and on Sundays, sorting this out beforehand saves discovering the problem at the door.",
      },
      {
        q: "Is there a dress code?",
        a: "There is, and it's a condition of entry rather than a suggestion: modest dress, with shoulders and legs covered. Worth carrying something light in your bag to cover up, especially in Foz's heat, when almost nobody leaves the house dressed that way.",
      },
      {
        q: "What's special about the architecture?",
        a: "The dome has the largest free span in reinforced concrete in Latin America, over an octagonal base ringed by arches, with a hall for up to 580 people. The minarets stand 31 metres tall and carry the call to prayer five times a day. The interior is covered in arabesques the façade never hints at.",
      },
      {
        q: "How much time should I set aside?",
        a: "45 minutes to an hour. It's a short cultural stop, and what governs where it fits in the day isn't the duration but the opening window — far narrower than at most attractions in the city.",
      },
      {
        q: "Is it related to Foz's Arab food?",
        a: "Directly: the community that built the mosque in 1983 is the same one behind the city's shawarma and Arab food scene. Visiting in the morning and having lunch in the neighbourhood is one of the most coherent pairings on the urban axis.",
      },
    ],
    "compras-paraguai-ciudad-del-este": [
      {
        q: "Do I need a passport to go to Ciudad del Este?",
        a: "Brazilians cross with original photo ID, either a national ID card or a passport, in good condition. A photocopy or a phone picture won't do. Border rules change, so check what's currently required before leaving Foz.",
      },
      {
        q: "What time do the shops open and close in Ciudad del Este?",
        a: "They open early, around 7 or 8am, and start closing between 3 and 4pm. It's the detail that ruins the worst-planned days: there is no late-afternoon shopping in Paraguay, so this trip has to be the morning of your day, not what's left of it.",
      },
      {
        q: "Is it worth going on a Sunday?",
        a: "No. On Sundays most shops don't even open, and on Saturdays they shut around midday. If your only free day is a Sunday, swap it for something else and leave the shopping for a weekday.",
      },
      {
        q: "Can I cross the Friendship Bridge on foot?",
        a: "You can, and it's usually faster than driving. The bridge is just over 500 metres and the pedestrian walkway skips the queue that locks up vehicles over the Paraná river. Plenty of people leave the car in Foz and cross walking, by taxi or by bus.",
      },
      {
        q: "Is there a limit on what I can bring back to Brazil?",
        a: "There is. Brazilian customs applies a per-person duty-free allowance, and the land-border one differs from the allowance for arrivals by air. The figure is updated periodically, so check the current one before crossing — that's what avoids a surprise on the way back.",
      },
      {
        q: "Can I combine shopping and Saltos del Monday on the same day?",
        a: "You can, and it's the most efficient pairing on the Paraguayan side. Shops close between 3 and 4pm, and the Saltos park, 10 km away in Presidente Franco, stays open until 7pm. Shopping in the morning and waterfalls after lunch settle the day without crossing the bridge twice.",
      },
      {
        q: "Is shopping in Paraguay the same as the duty free in Argentina?",
        a: "No. Different countries, borders and types of shop: in Ciudad del Este you walk through arcades and street malls, while the Puerto Iguazú duty free is a single store next to the customs post. Each has its own page here, because they're also different days in an itinerary.",
      },
    ],
    "saltos-del-monday": [
      {
        q: "Where exactly are the Saltos del Monday?",
        a: "In the Parque Municipal Monday, in Presidente Franco — not in Ciudad del Este, as many people assume. It's the neighbouring town, around 10 km from the Friendship Bridge, which puts the park a short drive from anyone staying in Foz.",
      },
      {
        q: "Can I go on the same day as shopping in Paraguay?",
        a: "You can, and the timings help: the shops in Ciudad del Este close around 4pm, while the park stays open until 7pm. The natural sequence is shopping in the morning and the falls in the late afternoon, once the stores have shut and there's still daylight.",
      },
      {
        q: "Are the Saltos del Monday like the Iguaçu Falls?",
        a: "No, and the difference isn't only size. These are three falls of around 45 metres in a park you can cover in a few hours, without the crowds of the National Park. They complement a border itinerary; they don't replace the Falls.",
      },
      {
        q: "What documents do I need to cross?",
        a: "A recent ID document or a passport. The rule that complicates things most concerns minors: under-18s travelling without their parents need international authorisation notarised at a registry office, presented with the original copies.",
      },
      {
        q: "What's in the park besides the falls?",
        a: "A panoramic lift descending from the upper level to the base of the main fall, easy trails, viewpoints, a zip line and a treetop course for children. There are toilets, a snack bar and a restaurant — simple facilities, but enough for a full afternoon.",
      },
      {
        q: "When's the best time to visit?",
        a: "The park works year-round, but in the rainy season the Monday River swells and the falls become far more impressive. That's the opposite of what happens with boat rides and trails, which suffer in the same conditions.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "Not usually — the park has its own ticket desk and plenty of capacity. What needs planning is the border crossing and transport, not the ticket.",
      },
    ],
    "by-night-argentina-puerto-iguazu": [
      {
        q: "What does the Puerto Iguazú by night include?",
        a: "Four stops: the Duty Free Shop on Ruta 12 (around 40 minutes), the ice bar (another 40, at up to ten degrees below zero), the Av. Brasil street market (about an hour, the longest stop) and the City Center casino (40 minutes). With the driving, the circuit runs 4 to 5 hours.",
      },
      {
        q: "Is this the same ice bar as the one in Foz?",
        a: "No, they're two different ice bars in two different cities. This one is in Puerto Iguazú, Argentina, and forms part of the night circuit; the Dreams Ice Bar is in Foz, inside Dreams Park Show. Anyone who has done one rarely misses the other.",
      },
      {
        q: "When should the by night go in the itinerary?",
        a: "After a day at the Argentine Falls, which close at 4pm — you're already on that side and the border has been dealt with once. The circuit takes the whole evening, so it doesn't fit alongside the Itaipu Illuminated tour on the Brazilian side. Madero Tango is another matter: the show is in the same casino complex, the final stop here, and its 10:30pm session makes chaining possible.",
      },
      {
        q: "What documents do I need to cross at night?",
        a: "Original photo ID to cross the Tancredo Neves Bridge, as with any crossing into Argentina. The night-specific detail is the return: immigration flow changes after dinner, and getting back to Foz isn't always quick.",
      },
      {
        q: "What's at the street market?",
        a: "Empanadas, alfajores, cold-cut boards, stuffed olives, cheeses, wines and local beer, alongside handicrafts and souvenirs. It's where visitors and locals mix, and sunset is the busiest hour.",
      },
      {
        q: "Can I swap the casino for dinner?",
        a: "You can — parrillas and pizzerias in central Puerto Iguazú are the usual alternative, and some add a tango show. The casino is the most skippable stop for anyone travelling with children.",
      },
      {
        q: "What can I buy at the Duty Free?",
        a: "Spirits, perfumes, cosmetics, clothing and imported goods generally, tax-free up to the allowance. It's a different logic from Ciudad del Este: less variety and less chaos, more brands and a proper shop environment.",
      },
    ],
    "kattamaram-foz": [
      {
        q: "Where does the Kattamaram sail?",
        a: "Past the Fraternity Bridge, the Meeting of the Waters, the Triple Frontier Landmark, the works on the Integration Bridge and the Friendship Bridge. It's the set of structures that defines the Triple Frontier, seen from the water, with a guide explaining the role of each.",
      },
      {
        q: "What's the difference between the lunch and the sunset sailing?",
        a: "The route is the same; the hour and the meal change. The lunch sailing takes the middle of the day and frees your late afternoon for something else. The sunset one adds the sun dropping over the Paraguayan horizon and closes the evening with dinner aboard.",
      },
      {
        q: "Does the Kattamaram go to the Falls?",
        a: "No. This is river sailing along the border, not the boat that runs into the base of the falls — that's Macuco Safari on the Brazilian side, or Gran Aventura on the Argentine. Here the scenery is the confluence of the rivers and the bridges, not the waterfall.",
      },
      {
        q: "Is it worth it if I'm already going to the Triple Frontier Landmark?",
        a: "It is, because it's the same landscape from the opposite side: from the Landmark you look down at the river; from the boat you look at the city from within it. With limited time you pick one — both take the same late afternoon, unless you take the lunch sailing.",
      },
      {
        q: "Is the meal included?",
        a: "There's a buffet aboard on both options — lunch on one, dinner on the other. In practice the outing replaces the meal rather than adding to it, which changes the day's planning more than you'd expect.",
      },
      {
        q: "Do I need to book in advance?",
        a: "It's worth it, especially for the sunset departures, which are the most sought-after, and in high season. The timetable shifts with the season and demand.",
      },
      {
        q: "Can children come along?",
        a: "They can, and the format helps: a stable vessel, a route with no physical effort and food available aboard. Minimum age and life-jacket rules are set by the operator.",
      },
    ],
    "wonder-park-foz": [
      {
        q: "Which attractions does Wonder Park Foz have?",
        a: "Four: Movie Cars, with 50 iconic vehicles from film, TV, cartoons and music across 20 sets; Bonnie's Burger, a 1950s-themed diner; the Water Show, on the complex's lake, with light and projections; and Lumina Park, a lit night trail through the forest.",
      },
      {
        q: "What time does Wonder Park open?",
        a: "It depends on the attraction. Movie Cars and Bonnie's Burger run from 11am to 11pm, every day. The Water Show and Lumina Park only start at 8pm — there's no daytime version of either.",
      },
      {
        q: "Can I see the Water Show and Lumina Park on the same night?",
        a: "Both start at 8pm, so it's worth checking the session schedule before counting on both. If the times alternate, they fit; if not, it's a choice — and Movie Cars, open until 11pm, works either before or after whichever you pick.",
      },
      {
        q: "Are Wonder Park and Dreams Park Show the same thing?",
        a: "No. They're different complexes on the same avenue: Dreams Park sits at km 8 and gathers dinosaurs, a wax museum, world wonders and an ice bar; Wonder Park is at km 20, closer to the Falls, with movie cars and night light attractions. Tickets and concepts are independent.",
      },
      {
        q: "Is it close to the Falls?",
        a: "Very: under 950 metres from the National Park entrance, at km 20 of the same road. You drive past it on the way back from the park, which makes it natural to have dinner here after 4pm and stay for the 8pm shows.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "What needs attention isn't the purchase but the timing: the night attractions run on set sessions and the rest works on flow. Deciding beforehand which of the four you want is what keeps you from arriving outside the right window.",
      },
      {
        q: "Is it good for families?",
        a: "It is, and the format helps: the movie cars appeal to teenagers and adults, Lumina Park works well with children, and the diner solves dinner without leaving the site. Since it isn't a thrill-ride park, the pace stays relaxed.",
      },
    ],
    "helisul-experience-helicoptero-cataratas": [
      {
        q: "How long is the helicopter flight over the Falls?",
        a: "Around 10 minutes in the air. The full programme takes 1 to 2 hours, counting travel, check-in, weighing and the safety briefing — the widest gap between time committed and time experienced of any attraction in Foz, and worth knowing in advance.",
      },
      {
        q: "What can you see from above that you can't from the ground?",
        a: "The shape of the whole thing. From the air you get the entire horseshoe at once, the Devil's Throat from overhead and the pattern of the Iguaçu River splitting into dozens of arms before the drop. It's the only perspective that explains the geography of the place.",
      },
      {
        q: "Can I fly on the same day as the Falls trail?",
        a: "You can, and it's the most common pairing: it's only 10 minutes of flight, so it adds to the 3 hours of the trail without breaking the day. What doesn't fit is adding Macuco Safari as well — then the arithmetic fails.",
      },
      {
        q: "Does the flight get cancelled in the rain?",
        a: "It can be cancelled or rescheduled for rain, wind or a low cloud ceiling. That's why the overflight should never be the day's unmissable commitment: build the plan so that if it falls through, everything else still stands.",
      },
      {
        q: "Are there weight or age restrictions?",
        a: "There are. The operation applies weight limits per flight and per passenger, with weighing at check-in, plus its own rules for children. These are safety conditions, not paperwork — confirm when booking so there's no surprise at boarding.",
      },
      {
        q: "Do I need to book in advance?",
        a: "It helps, because capacity per flight is small and the best-light slots go first. Since the flight depends on the weather, it's also worth understanding the rescheduling policy before committing.",
      },
      {
        q: "Is it worth it even though it's short?",
        a: "It depends what you're after. Anyone wanting to grasp and photograph the scale of the falls finds the only possible angle here. Anyone prioritising time inside the park can skip it without losing anything essential — the trail and the Devil's Throat remain the heart of the visit.",
      },
    ],
    "eco-park-foz": [
      {
        q: "What time are the shows at Dreams Eco Park?",
        a: "There are two, each with two sessions: Criollo: the Golden Horse at 10am and 3:30pm, and the Free Flight bird show at 10:30am and 4pm. Since they sit 30 minutes apart in each session, you can see both in one visit — as long as you arrive at 10am or 3:30pm.",
      },
      {
        q: "Does the park close in the middle of the day?",
        a: "It does. It runs in two windows, 9am to 12:30pm and 2:30pm to 6pm. Turning up at 1pm means waiting until 2:30pm, and arriving at 11am or 5pm means missing both shows and seeing only the Mini Farm.",
      },
      {
        q: "What is the falconry in the Free Flight show?",
        a: "It's the ancient art of training birds of prey to hunt in partnership with the falconer. In the show the birds leave the trainer's arm, fly free across the grounds and return — the direct result of the rehabilitation work the park does with hawks, owls and other rescued species.",
      },
      {
        q: "Are Eco Park and the Bird Park the same thing?",
        a: "No, and the difference is substantial. The Bird Park sits beside the National Park and consists of immersive aviaries of Atlantic Forest birds you walk through at your own pace. Eco Park is at Av. das Cataratas, 8100, and its proposition is falconry, criollo horses and a petting farm, with scheduled shows.",
      },
      {
        q: "Is it next to Dreams Park Show?",
        a: "It's at the same address, Av. das Cataratas, 8100. That makes the pair natural on itineraries of four days or more, and lets you fit Eco Park's two windows around the Dreams Park indoor attractions, which run from 11am to 11pm.",
      },
      {
        q: "Do I need to buy tickets in advance?",
        a: "What needs planning is the timing, not the purchase: with fixed show sessions and a midday closure, arriving in the right window matters more than booking early. Combined tickets with Dreams Park exist and change the day's arithmetic.",
      },
      {
        q: "Is it good for children?",
        a: "It's one of the best in Foz on that count: the Free Flight holds even small children's attention, the horse show has its own rhythm, and the Mini Farm allows direct contact with the animals. Much of it is outdoors, so heavy rain does compromise the visit.",
      },
    ],
    "ecomuseu-itaipu": [
      {
        q: "Do I need to buy a ticket for the Ecomuseum?",
        a: "No. Admission is free and requires no advance booking. What is mandatory is official photo ID and filling in a visitor registration form at reception.",
      },
      {
        q: "What days is the Ecomuseum open?",
        a: "Wednesday to Monday, 8:30am to 4pm. It closes on Tuesdays — the same day as the Bela Vista Biological Refuge. Anyone setting Tuesday aside for the Itaipu axis loses both and is left with the dam tours alone, which run daily.",
      },
      {
        q: "What is there to see at the Ecomuseum?",
        a: "Three exhibitions across four stops: Science in the Sphere, using immersive technology to explain the planet and its phenomena; Illustrated Territory, with 25 watercolours of the regional flora by Thaís Regina Marcon; and Revealed Territory, with Edino Krug's photographs of Lake Itaipu and the shoreline region.",
      },
      {
        q: "Is the visit available in other languages?",
        a: "No. The Ecomuseum is conducted in Portuguese only, unlike the dam tour, which has an audio guide in other languages. Worth considering if you're travelling with someone who doesn't speak it.",
      },
      {
        q: "How long does the visit take?",
        a: "About an hour, spread across four stops. It's the shortest attraction in the Itaipu complex, which makes it the easy fit between the dam tour and the Biological Refuge.",
      },
      {
        q: "Is it worth it if I'm already seeing the dam?",
        a: "It is, because it tells the other half of the story. The dam tour shows the engineering; the Ecomuseum shows what was there before and what the works transformed — the Atlantic Forest, the lake and the shoreline region. An hour to complete the sense of the whole day.",
      },
      {
        q: "Is it good for children?",
        a: "It's open to all ages, and Science in the Sphere tends to be the part that holds younger visitors, being visual and dynamic. One detail: that exhibition goes through scheduled maintenance from time to time, so check availability if it's your main reason for going.",
      },
    ],
    "aguaray-eco-esportes": [
      {
        q: "How does the Aguaray Iguaçu Expedition work?",
        a: "It's a linked route: a trail to the canoe base on the Iguaçu riverbank, briefing and equipment, a paddle to the Tamanduá River, a trail to Cachoeira da Toca for a swim, the kayak return, and Cachoeira do Juruvá at the end before the walk back. In total, 4.5 km of walking and 2 km of paddling.",
      },
      {
        q: "What time are the departures?",
        a: "Two a day, at 9am and 2:30pm, Tuesday to Sunday — closed Mondays. Arrive 15 minutes early, and cancellation is allowed up to 6 hours before the booked time.",
      },
      {
        q: "How difficult is it?",
        a: "Moderate. The paddling is gentle with no rapids, but 4.5 km of trail across three and a half hours of activity asks for willingness. This isn't a contemplative outing: you walk, you paddle and you get in the water.",
      },
      {
        q: "Is there a minimum age?",
        a: "Yes, 10 years old. Under-18s need parental authorisation. It's the attraction in the catalogue with the highest age restriction — anyone travelling with small children needs a different nature option.",
      },
      {
        q: "Is transport included?",
        a: "No. The activity takes place in Remanso Grande, outside the tourist corridor, and getting there is up to you. It's the main logistical detail to settle before booking.",
      },
      {
        q: "What should I bring?",
        a: "A water bottle, insect repellent, sunscreen, light quick-drying clothes and closed shoes that can get wet — flip-flops and sandals aren't allowed. Bring spare clothes and shoes to change into afterwards, and a backpack for your things. The facilities are basic, with an ecological toilet and no food or drink for sale.",
      },
      {
        q: "Does it replace Macuco Safari?",
        a: "No, they're opposite propositions. Macuco is short, inside the National Park, and the thrill is the boat running into the base of the falls. Aguaray is long, away from the mass circuit, and the point is physical effort and quiet. Anyone after real adventure usually wants both, on different days.",
      },
    ],
    "gran-aventura": [
      {
        q: "How do you reach the Gran Aventura boat?",
        a: "Inside the park, a vehicle covers 6 kilometres along the Yacaratiá Trail, through subtropical forest, to Puerto Macuco. That's where you put on the life jacket and board. The forest stretch is part of the experience, not just a transfer.",
      },
      {
        q: "Is Gran Aventura included in the Iguazú National Park ticket?",
        a: "No. It's a separate outing with its own ticket, though combined options bundling park entry and the boat do exist. Worth checking which format you're buying so you don't find out at the gate.",
      },
      {
        q: "Can I do Gran Aventura and all three circuits on the same day?",
        a: "You can, but with no slack. The Upper, Lower and Devil's Throat circuits already need 5 to 6 hours, the park closes at 4pm, and the boat adds its own time. Counting the border and the drive from Foz, that combination only works if you arrive at opening.",
      },
      {
        q: "Are Gran Aventura and Macuco Safari the same thing?",
        a: "They're the same kind of outing in different countries: a boat to the foot of the falls, with a guaranteed soaking. Macuco is on the Brazilian side, Gran Aventura on the Argentine. Doing both repeats the experience — most people pick one and spend the other's time on the walkways.",
      },
      {
        q: "Will I get very wet?",
        a: "Very, and that's the point. The boat runs into the spray zone at the base of the falls. Bring a change of clothes and a waterproof pouch for your phone — the advice to pack swimwear for the Argentine side exists precisely because of this outing.",
      },
      {
        q: "What do you see that the walkways don't show?",
        a: "The view from below. The walkways look at the falls from above and head-on; the boat puts you underneath them, and on the way it passes Isla Martín, which appears on none of the walking circuits.",
      },
      {
        q: "Can children go?",
        a: "There are age restrictions and safety rules set by the operation, worth confirming before buying. The ride is short but intense, with the boat at speed and water coming in from every direction.",
      },
    ],
    "madero-tango-iguazu": [
      {
        q: "How long is the Madero Tango show?",
        a: "About 90 minutes. The performance traces the history of tango with live dancers and musicians and ends with a short lesson, where the audience is invited to dance — usually the most memorable part of the night.",
      },
      {
        q: "What time are the sessions?",
        a: "Two a night, at 8:30pm and 10:30pm, Tuesday to Sunday. The later one opens the possibility of fitting tango in after another programme, with the trade-off of pushing the crossing back past midnight.",
      },
      {
        q: "Is dinner included?",
        a: "It depends on the format. There's a dinner version, where the menu accompanies the show and drinks are charged separately, and a show-only version in Executive and VIP tiers — in those, the meal isn't included. Confirm which one you're buying.",
      },
      {
        q: "What's the difference between Executive and VIP?",
        a: "Only where your seat is in the room. The show is the same, with the same length and the same content — what changes is the angle and the distance from the stage.",
      },
      {
        q: "Where is Madero Tango?",
        a: "In the Casino Iguazú complex, on Ruta Nacional 12, km 1640, in Puerto Iguazú, right by the border customs post. It's the same address where the city's by night circuit ends, which makes chaining the two possible on the later session.",
      },
      {
        q: "Do I need to visit the Argentine Falls to see the tango show?",
        a: "No. It's an independent evening programme, and some people cross the border just for it. But since the crossing is already sorted, it makes sense for anyone who spent the day on the Argentine side and wants to close the night there.",
      },
      {
        q: "Is there a dress code?",
        a: "Smart casual is the usual expectation — avoid flip-flops, vests and beachwear. Worth confirming when booking, especially for the dinner version, the more formal of the two.",
      },
    ],
    "blue-park-foz": [
      {
        q: "What attractions does Blue Park have?",
        a: "The wave beach, with nine types of wave reaching 1.2 metres and a strip of sand around it; the lazy river, for drifting on a ring; Fast Falls, with four slide lanes over 100 metres long; the Super Maverick, 18 metres tall and hitting 60 km/h; Kids Town for children; and a baby area for infants from 6 months to 2 years.",
      },
      {
        q: "Is the water warm?",
        a: "Mild, not warm. It sits around 28 °C at the surface and comes from the Guarani Aquifer — pleasant in Foz's heat, but not enough for a cold winter day. Anyone expecting a thermal spa tends to be disappointed; anyone expecting a water park isn't.",
      },
      {
        q: "Do I have to be staying at Mabu Thermas to get in?",
        a: "No. The park sits next to the resort and is included for guests staying there, but access isn't guest-only — day passes are available to outside visitors.",
      },
      {
        q: "Are all the attractions included in the ticket?",
        a: "Almost all. Wakeboarding on the lake and the zip line — 300 metres long, 30 metres up — are booked separately. The pools, the slides and the children's areas are part of standard admission.",
      },
      {
        q: "Is there anywhere to eat inside the park?",
        a: "There is. Snack bars are spread across the grounds, with sharing plates, light meals and drinks, plus a swim-up bar in the pool — you can spend the day without leaving.",
      },
      {
        q: "Is it worth it with only a few days in Foz?",
        a: "With two or three days, nature and the border still come first. Blue Park works well on itineraries of four days or more, on a scorching day, or when the group has children and needs a break from the trails.",
      },
      {
        q: "What should I bring?",
        a: "Swimwear, a towel, sunscreen and flip-flops. Keep something aside for the snack bars and for the separately booked attractions, if you want to do the wakeboarding or the zip line.",
      },
    ],
    "iguassu-secret-falls": [
      {
        q: "What outing options does Iguassu Secret Falls offer?",
        a: "Six. The single trail, with two waterfalls in 2 hours and two departure times; the half day; the full day, 8:30am to 6pm, with 4 trails and 10 waterfalls; Luau Secret Falls, 6 hours and at night; and the Tamanduá (3.5 km) and Carimã (3 km) expeditions, 8 hours each.",
      },
      {
        q: "Can I see a hidden waterfall without losing a whole day?",
        a: "You can — that's exactly what the single trail is for: 2 hours to two waterfalls, with two times to choose from. It's the way to fit real nature into a day that already has another main activity.",
      },
      {
        q: "What is Luau Secret Falls?",
        a: "The night version, running about 6 hours: a trail after dark, a waterfall swim, a dip in the Iguaçu River, a picnic, a bonfire and live music. It depends on schedule availability, so don't count on it without confirming first.",
      },
      {
        q: "What's the difference between the Tamanduá and Carimã expeditions?",
        a: "Tamanduá is 3.5 km through dense forest to several falls good for swimming and jumping. Carimã runs 3 km past the springs of the Ouro Verde River and the Municipal Nursery, ending at three falls on the Carimã River. Both take 8 hours.",
      },
      {
        q: "Do I need to book?",
        a: "You do. No option works on a walk-up basis: groups leave at set times and the route depends on a guide. The published address is the meeting point, in Vila Yolanda — the trails themselves are elsewhere in the region.",
      },
      {
        q: "How difficult is it?",
        a: "Light to moderate depending on the option. The 2-hour single trail is manageable for most; the 8-hour expeditions and the full day demand real physical willingness and walking on natural terrain. Mention any limitations when booking.",
      },
      {
        q: "Does it replace the Falls?",
        a: "No, and it doesn't try to. The Falls are a landscape to look at; here the point is getting into the water. It works best as the counterweight in a plan — a day of forest and swimming after two of viewpoints and walkways.",
      },
    ],
    "la-aripuca": [
      {
        q: "What is an aripuca?",
        a: "A Guaraní hunting trap: a structure of logs held up by its own weight that drops onto the prey. The building the place is named after is a giant version of it, raised with timber reclaimed from native species of the Paraná forest — trees that had already fallen or been felled.",
      },
      {
        q: "How long does the visit take?",
        a: "30 minutes to an hour, counting the interpretive trails, the main structure and the crafts shop. It's one of the shortest stops on the Argentine side, which makes it easy to slot into any half-day.",
      },
      {
        q: "Do I need to buy a ticket?",
        a: "Yes, the visit has its own ticket — unrelated to the Iguazú National Park one. They're separate attractions with independent ticket desks, even though they sit on the same road.",
      },
      {
        q: "What time does it open?",
        a: "Daily, 9am to 6pm. Since the Argentine Falls close at 4pm, there's a window to stop here on the way back from the park, before crossing back to Foz.",
      },
      {
        q: "Is there anywhere to eat on site?",
        a: "There's a restaurant with regional food, an ice cream parlour and a café inside the grounds. You can sort out lunch or a snack without leaving, which helps on border days when time is tight.",
      },
      {
        q: "Is it good for children?",
        a: "It is. The scale of the structure impresses at any age, the trails are short and flat, and the educational angle works well with school and family groups. It's one of the few attractions on the Argentine side that demands no physical effort at all.",
      },
      {
        q: "What does it combine with on the same day?",
        a: "With Hito Tres Fronteras and the street market in central Puerto Iguazú, forming an urban Argentine half-day. It also fits after the Argentine Falls, if you leave the park at closing time.",
      },
    ],
    "hito-tres-fronteras": [
      {
        q: "Are the Hito Tres Fronteras and the Marco das Três Fronteiras the same place?",
        a: "No. They're two different markers, one in each country, looking at the same river confluence: the Hito is in Puerto Iguazú, Argentina, and the Marco in Foz do Iguaçu, Brazil. From the lookout of one you can see the other — and the third, the Paraguayan one, completes the triangle.",
      },
      {
        q: "Do I need a ticket to visit the Hito?",
        a: "No. It's a public open-air area with free entry, no turnstile and no visiting hours. That's exactly what sets it apart from the Brazilian Marco, which has a ticket office and a schedule of its own.",
      },
      {
        q: "What's the best time to go?",
        a: "Late afternoon. The lookout faces the meeting of the rivers and it's the sunset that makes the scene — and since there's no closing time, you can stay past dark, when the lights of all three cities come on at once.",
      },
      {
        q: "Is it worth going if I've already seen the Marco das Três Fronteiras?",
        a: "In two situations. If you're in Foz on a Monday, the Brazilian Marco is closed and the Hito is the only way to see the confluence. And if you've seen it from one side, seeing it from the other is literally the landscape inverted: the countries that were in front of you end up behind you.",
      },
      {
        q: "Do I need a passport coming from Foz?",
        a: "You need original photo ID to enter Argentina — a national ID card in good condition or a passport. The Hito itself charges nothing and has no connection to the Iguazú National Park ticket, which is a separate visit.",
      },
      {
        q: "What's there besides the marker?",
        a: "The site was redeveloped and gained a walkway along the bluff, a plaza with an amphitheatre, an artisans' fair and places to eat nearby. You can spend an hour or two without rushing, which wasn't the case when the place was just the obelisk.",
      },
      {
        q: "What does it combine with on the same day?",
        a: "With La Aripuca and the street market in central Puerto Iguazú, forming an urban Argentine half-day. It also closes a day that started at the Argentine Falls: the park shuts at 4pm, La Aripuca stays open until 6pm on the way back, and the Hito takes the sunset.",
      },
    ],
    "duty-free-shop-puerto-iguazu-argentina": [
      {
        q: "What is the Puerto Iguazú duty free?",
        a: "It's the duty-free store on the Argentine border, right past the customs post on RN 12. Being a free zone, goods carry no import tax — perfume, spirits, cosmetics, chocolate and electronics are the categories that bring most visitors there.",
      },
      {
        q: "Do I need a passport to enter the free shop?",
        a: "You need original photo ID — a national ID card in good condition or a passport. You're crossing an international border to reach the store, so a photocopy or a phone picture won't get you through customs.",
      },
      {
        q: "How is the duty free different from shopping in Ciudad del Este?",
        a: "It's the kind of shopping, not the scale. In Paraguay you walk street arcades comparing dozens of shops; here it's a single air-conditioned address with set brands and Portuguese-speaking staff. Hunt for bargains in Paraguay; sort it out quickly here.",
      },
      {
        q: "Is there a limit on what I can bring back to Brazil?",
        a: "There is. Brazilian customs applies a per-person duty-free allowance, and the land-border one differs from the allowance for arrivals by air. The figure is updated periodically, so check the current one before crossing.",
      },
      {
        q: "How long should I allow for the free shop?",
        a: "Half a day covers it comfortably. That's exactly why it rarely fills a day on its own: it fits before or after another plan on the Argentine side without eating into the rest of your schedule.",
      },
      {
        q: "Can I pay in reais or does it have to be dollars?",
        a: "Purchases are in dollars and cards work normally. Check with your bank how conversion and fees apply before you travel — that changes the final figure more than the difference between one shop and another.",
      },
      {
        q: "What does it combine with on the same day?",
        a: "With everything on RN 12: the Argentine Falls, Hito Tres Fronteras and La Aripuca are all on the same road. Spending a whole border crossing on the free shop alone wastes the trip — it was made to be added, not to fill the day.",
      },
    ],
  },
  es: {
    "cataratas-do-iguacu": [
      {
        q: "¿Cuánto dura el lado brasileño de las Cataratas?",
        a: "Tres horas alcanzan para lo esencial: el bus interno, los 1,3 km de sendero, la pasarela de la Garganta y el ascensor. Quien fotografía con calma, o hace fila en temporada alta, llega cerca de cuatro. Medio día es la cuenta segura si todavía quieres encajar otra cosa.",
      },
      {
        q: "¿El bus interno y el ascensor están incluidos en la entrada?",
        a: "Los dos lo están. El bus que va del centro de visitantes al inicio del sendero y el ascensor panorámico del final del recorrido forman parte de la visita. Lo que no está incluido son las experiencias adicionales, como el Macuco Safari y el sobrevuelo en helicóptero, que se contratan aparte.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "En temporada alta y feriados, sí — el parque controla el ingreso y los horarios más concurridos se agotan antes. Fuera de pico suele poder resolverse en el día, pero llegar temprano sigue valiendo más que cualquier estrategia.",
      },
      {
        q: "¿Las Cataratas del lado brasileño y argentino son la misma visita?",
        a: "No, y un lado no reemplaza al otro. El brasileño entrega el panorama: ves el conjunto de frente, en menos tiempo. El argentino te lleva por pasarelas hasta la boca de la Garganta y pide el día entero. Quien tiene tres días o más suele hacer los dos, en días separados.",
      },
      {
        q: "¿Se pueden combinar las Cataratas y el Parque de las Aves el mismo día?",
        a: "Sí, y es la combinación más eficiente de Foz — el Parque de las Aves queda en la misma entrada del Parque Nacional. Lo habitual es empezar temprano por las Cataratas, cuando el sendero está más vacío y la luz es mejor, y dejar las aves para después del almuerzo.",
      },
      {
        q: "¿Qué llevar a las Cataratas?",
        a: "Calzado cerrado y cómodo, protector solar, agua y un piloto de lluvia liviano — la neblina de la Garganta moja de verdad, y el paraguas no sirve porque el agua viene desde abajo. Los drones y las mascotas no entran al parque.",
      },
      {
        q: "¿Se puede comer dentro del parque?",
        a: "Sí. Porto Canoas, al final del sendero, tiene restaurante con vista al río Iguazú, cafetería y tienda de souvenirs. Es donde casi todos paran antes de tomar el bus de vuelta.",
      },
    ],
    "parque-das-aves": [
      {
        q: "¿Cuánto dura la visita al Parque de las Aves?",
        a: "Dos horas cubren el circuito entero a ritmo normal. Con niños, o parando a fotografiar en cada vivero, llega a tres. Es uno de los pocos atractivos de Foz que entra cómodamente en medio día junto con otro.",
      },
      {
        q: "¿Necesito entrada separada de las Cataratas?",
        a: "Sí. El Parque de las Aves y el Parque Nacional del Iguazú son atractivos independientes, con entradas y boleterías propias, aunque queden a 500 metros uno del otro.",
      },
      {
        q: "¿El Parque de las Aves queda cerca de las Cataratas?",
        a: "Queda a 500 metros de la entrada del Parque Nacional — es la dupla más eficiente de un mismo día en Foz. La única decisión es el orden: las Cataratas rinden más temprano por la fila y la luz; las aves están más activas por la mañana y bajan el ritmo con el calor de la tarde.",
      },
      {
        q: "¿El sendero es accesible para silla de ruedas o cochecito?",
        a: "Lo es. El recorrido de 1,5 km se hizo con piso accesible de punta a punta, sin escaleras obligatorias. Los cochecitos circulan sin dificultad por el mismo trazado.",
      },
      {
        q: "¿Se puede visitar en día de lluvia?",
        a: "Se puede, y es uno de los mejores planes para ese día en Foz. El monte cubre buena parte del sendero, los viveros siguen abiertos y las aves no desaparecen — a diferencia de los paseos en barco o los sobrevuelos, que dependen del clima.",
      },
      {
        q: "¿Se puede fotografiar dentro de los viveros?",
        a: "Sí, sin flash. La restricción protege a los animales, y en la práctica ayuda: el flash quema el color de las plumas y borra el fondo de monte que hace funcionar la foto.",
      },
      {
        q: "¿Vale la pena si ya voy a ver las Cataratas?",
        a: "Vale, porque no es la misma experiencia. En las Cataratas miras un paisaje de lejos; aquí entras al recinto y quedas a un metro de un guacamayo. Para quien viaja con niños, suele ser el paseo más recordado de todos.",
      },
    ],
    "marco-das-tres-fronteiras": [
      {
        q: "¿El Marco de las Tres Fronteras abre todos los días?",
        a: "No. Abre de martes a domingo, de 13:30h a 21h, y cierra los lunes. Como solo abre por la tarde, nunca compite con las Cataratas ni con Itaipú — entra después, el mismo día.",
      },
      {
        q: "¿Cuál es el mejor horario para ir?",
        a: "Cerca de una hora antes del atardecer. Alcanza para recorrer la villa escenográfica y el memorial con calma, conseguir lugar en el mirador antes de que se llene y todavía ver el obelisco iluminado cuando oscurece — una escena completamente distinta de la del atardecer.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "El Marco cobra entrada y trabaja con horarios. En temporada alta y en días de espectáculo, resolver la entrada antes evita llegar justo en el horario más concurrido y quedarte sin buen lugar en el mirador.",
      },
      {
        q: "¿Se ven los tres países desde el Marco?",
        a: "Se ven. Desde la plataforma brasileña ves el marco argentino de un lado y el paraguayo del otro, cada uno pintado con los colores de su país, sobre la confluencia de los ríos Iguazú y Paraná. Es la foto más reconocible de la Triple Frontera.",
      },
      {
        q: "¿Necesito pasaporte para visitar el Marco?",
        a: "No. El Marco queda en territorio brasileño y no cruzas ninguna frontera para llegar. El documento entra en juego solo en paseos que cruzan a Puerto Iguazú o a Ciudad del Este.",
      },
      {
        q: "¿Qué hay además del mirador?",
        a: "La Villa Escenográfica de las Misiones Jesuíticas, que recrea la región en los siglos XVI y XVII; el Memorial Cabeza de Vaca, sobre el primer europeo en registrar las Cataratas en 1542; y el Espectáculo Tres Fronteras al final de la tarde, con música y danza de la frontera.",
      },
      {
        q: "¿Se puede cenar en el Marco?",
        a: "Se puede. El restaurante Cabeza de Vaca atiende de martes a domingo, de 15h a 22h, con los tres países al frente. Es una de las pocas mesas de Foz con esa vista, así que en temporada alta conviene reservar.",
      },
    ],
    "itaipu-binacional": [
      {
        q: "¿Cuál es la diferencia entre la Itaipú Panorámica y la Itaipú Especial?",
        a: "La Panorámica es el circuito externo: bus panorámico por el mirador del vertedero, la represa y el lago, cerca de 1h30, con audioguía en portugués, inglés y español. La Especial entra a la usina — sala de comando, eje de una turbina y el interior de la represa — en unas 2h30, con miradores internos que la Panorámica no alcanza. Ninguna es una versión mejor de la otra: sirven a propósitos distintos.",
      },
      {
        q: "¿Cómo funciona el paseo Itaipú Iluminada?",
        a: "Es nocturno y solo de contemplación. La represa se ilumina con 288 reflectores en efectos sincronizados con una banda sonora, y la narración cuenta la historia de la usina en portugués, inglés y español, con vista al lago desde un mirador exclusivo. El show dura unos 30 minutos; el paseo completo, con traslado y tiempo de fotos, ronda las 2 horas.",
      },
      {
        q: "¿Qué visita de Itaipú elegir?",
        a: "Si es tu primera vez y el tiempo es corto, la Panorámica entrega la escala de la obra en 1h30 y es la única indicada para movilidad reducida. Si quieres entender cómo funciona la usina por dentro, la Especial es la razón de venir. La Iluminada no reemplaza a ninguna — es el complemento nocturno de quien ya vio la represa de día.",
      },
      {
        q: "¿Necesito documento para visitar Itaipú?",
        a: "Para la Especial, sí: documento de identidad original, DNI o pasaporte, además de seguir las normas de seguridad de un área industrial. Es el requisito que más sorprende a la gente en la portería — una copia o una foto en el celular no sirve.",
      },
      {
        q: "¿La Iluminada ocurre todos los días?",
        a: "No. Ocurre los viernes y sábados, a las 19h. Es la restricción de agenda más importante de Itaipú: si no estás en Foz una de esas noches, simplemente sale del plan — y si estás, compite con el atardecer en el Marco de las Tres Fronteras.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "Conviene, sobre todo para la Especial, que tiene cupos limitados por horario, y para la Iluminada, que solo funciona dos noches por semana. La Panorámica suele tener más holgura, aunque en temporada alta los primeros horarios de la mañana se llenan antes.",
      },
      {
        q: "¿Itaipú y las Cataratas caben el mismo día?",
        a: "Caben, pero queda apretado: están en lados opuestos de la ciudad. Es más cómodo reservar un día — o medio día fuerte — para el eje de Itaipú y dejar el corredor de las Cataratas para otro, sobre todo si quieres la Iluminada de noche.",
      },
      {
        q: "¿Qué más hay en el complejo de Itaipú?",
        a: "El Refugio Biológico Bela Vista y el Ecomuseo quedan en el mismo eje y son lo que convierte la visita de medio día en día entero — uno con senderos y fauna rescatada, el otro con la historia de la región y del impacto de la obra.",
      },
    ],
    "refugio-biologico-bela-vista": [
      {
        q: "¿A qué hora abre el Refugio Biológico?",
        a: "Las salidas son en horarios fijos — 8:30, 10:30, 14:30 y 15:30 — de miércoles a lunes. Cierra los martes. No es un paseo de llegar cuando se pueda: entras en un grupo guiado en el horario elegido, y eso es lo que organiza el resto del día.",
      },
      {
        q: "¿El Refugio Biológico es el mismo paseo que la represa?",
        a: "No. La represa y el Refugio quedan en el mismo complejo, pero son visitas independientes, con entrada y horario propios. Una es ingeniería, la otra es fauna y monte — y mucha gente hace las dos en el mismo medio día.",
      },
      {
        q: "¿Qué animales se pueden ver en el Refugio?",
        a: "Yaguareté, ocelote, tapir, guacamayo y harpía, entre otras especies rescatadas o en rehabilitación. Es el contrapunto directo al Parque Nacional del Iguazú, donde esos mismos animales existen pero viven lejos de cualquier sendero de visitantes.",
      },
      {
        q: "¿Cuánto dura la visita?",
        a: "De 2h a 2h30, sumando el transporte interno y los 1,7 km de sendero guiado. El ritmo es lento a propósito: hay paradas en los recintos, en los lagos y en el jardín botánico a lo largo del recorrido.",
      },
      {
        q: "¿Se puede combinar con la Itaipú Panorámica el mismo día?",
        a: "Se puede, y es la combinación más lógica — están en el mismo complejo. La Panorámica lleva 1h30 y el Refugio 2h30, así que juntos ocupan medio día completo. Lo que decide el orden es el horario fijo de salida del Refugio, no la preferencia.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "Conviene, porque cada salida tiene cupo limitado y son solo cuatro por día. En temporada alta, dejarlo para la boletería suele significar quedarse con un horario que no encaja en el resto del día.",
      },
      {
        q: "¿Es bueno para niños?",
        a: "Lo es, y suele ser la válvula de escape de un día dedicado a Itaipú: después de la represa y la sala de máquinas, ver un yaguareté a pocos metros cambia el ánimo por completo. El sendero es plano y guiado, con paradas frecuentes.",
      },
    ],
    "dreams-park-show": [
      {
        q: "¿Dreams Park vale la pena con sol?",
        a: "Sí, si te gustan los parques temáticos y tienes tiempo extra. Con lluvia, sube en prioridad: es uno de los mejores planes B techados de Foz.",
      },
      {
        q: "¿Cuánto tiempo reservar?",
        a: "La mayoría de las familias tarda de 3 a 5 horas. Quien quiere ver todo con calma reserva el día.",
      },
      {
        q: "¿Es bueno para niños?",
        a: "Mucho. Dinosaurios, miniaturas y el museo de cera suelen gustar a distintas edades en el mismo grupo.",
      },
      {
        q: "¿Hay combo con el Eco Park?",
        a: "Sí — el mercado y el propio grupo suelen ofrecer pase combinado. Confirma en el sitio oficial qué incluye cada opción.",
      },
      {
        q: "¿Queda cerca de las Cataratas?",
        a: "Queda en la Av. das Cataratas, camino al Parque Nacional — mismo eje, sin desvío. Pero es un atractivo aparte, con entrada propia: encaja después de una mañana en los saltos, no dentro de ella.",
      },
      {
        q: "¿Hasta qué hora abre el Dreams Park?",
        a: "Depende de la atracción y del día, pero el complejo va mucho más tarde que el resto de Foz: el Museo de Cera cierra a las 21h o 22h y el Ice Bar a las 22h o 23h. Como las Cataratas cierran a las 16h y el Parque de las Aves a las 16:30, es una de las pocas alternativas para la noche.",
      },
      {
        q: "¿Cuáles funcionan en día de lluvia?",
        a: "El Museo de Cera, Maravillas del Mundo, el Ice Bar y el Motor Show son internos y no sienten el clima. El Valle de los Dinosaurios es sendero al aire libre y el Eco Park también: con lluvia fuerte esos dos pierden mucho y son los primeros en salir de la lista.",
      },
    ],
    aquafoz: [
      {
        q: "¿Qué es el AquaFoz?",
        a: "Es el acuario de Foz do Iguaçu, con 23 mil m² y cerca de 3,3 millones de litros de agua. Reúne más de 300 especies de agua dulce y salada en tres pisos, con foco en los ecosistemas de las cuencas de los ríos Paraná e Iguazú — las mismas aguas que forman las Cataratas.",
      },
      {
        q: "¿Cuánto dura la visita al AquaFoz?",
        a: "De 1h30 a 2 horas a ritmo normal. Entra cómodamente en medio día junto con otra atracción del corredor de las Cataratas, y es lo bastante corto como para sumarse a un día que ya tiene programa principal.",
      },
      {
        q: "¿A qué hora es la última entrada?",
        a: "A las 17h, aunque el acuario recién cierre a las 18:30. Es el detalle que más frustración causa: llegar a las 17:30 pensando que todavía hay tiempo significa no entrar. Conviene contarlo al planear el final de la tarde.",
      },
      {
        q: "¿Qué hay en la Galería Río Iguazú?",
        a: "Es la parte más local del acervo: representaciones del Alto, Medio y Bajo Iguazú, mostrando cómo cambia la fauna a lo largo del río. En el tramo alto aparecen el bagre de piedra, la mojarra del Iguazú y el vieja de agua; en el medio, la tararira, el jacundá, el pintado y el mandi del Iguazú, entre otros.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "En temporada alta y feriados ayuda, sobre todo para los horarios de media tarde. Como la última entrada es a las 17h, quien deja la decisión para el final del día corre el riesgo de encontrar la boletería ya cerrada.",
      },
      {
        q: "¿Funciona en día de lluvia?",
        a: "Perfectamente — es totalmente techado y climatizado. Junto con el Museo de Cera y el Ice Bar, es una de las respuestas de Foz para el día en que el parque nacional pierde la gracia, con la ventaja de quedar en el mismo corredor de las Cataratas.",
      },
      {
        q: "¿Es bueno para niños?",
        a: "Es uno de los paseos de Foz que mejor funciona con niños: recorrido corto, techado, con paneles interactivos y áreas educativas. Y al contrario de los senderos del parque nacional, aquí el ritmo es de quien quiera detenerse en cada vidrio.",
      },
    ],
    "vale-dos-dinossauros": [
      {
        q: "¿Los dinosaurios del Valle se mueven de verdad?",
        a: "Sí. Son réplicas de tamaño real con movimiento y sonido, distribuidas a lo largo del sendero. No es un museo de estatuas quietas — y ese detalle es justamente lo que impresiona a los niños y asusta a los más pequeños.",
      },
      {
        q: "¿Cuánto dura el Valle de los Dinosaurios?",
        a: "Entre 1h y 2h, según el ritmo y la cantidad de fotos. Es una atracción que no ocupa el día: entra en una tarde junto con otra área del complejo, o después de una mañana en las Cataratas.",
      },
      {
        q: "¿Cuál es el dinosaurio más grande del Valle?",
        a: "El Giganotosaurio, con más de 14 metros — un depredador que vivió en la región de la Patagonia y era mayor que el Tiranosaurio. Está en el medio del recorrido y es la parada de foto más disputada.",
      },
      {
        q: "¿Funciona en día de lluvia?",
        a: "Es sendero al aire libre, así que la lluvia fuerte compromete. Como queda dentro del Dreams Park Show, la alternativa es inmediata: el Museo de Cera, Maravillas del Mundo y el Ice Bar son techados y están en el mismo terreno.",
      },
      {
        q: "¿Necesito entrada separada de las otras atracciones del Dreams Park?",
        a: "Sí. En el complejo la entrada es por atracción, no por dirección. Conviene decidir antes cuáles quieres visitar — esa elección define el tiempo y el costo del día.",
      },
      {
        q: "¿Es apropiado para niños pequeños?",
        a: "Es la atracción del complejo que más gusta a los niños, con una salvedad: el sonido y el movimiento de los mayores suelen asustar a quien tiene menos de tres o cuatro años. Vale avisar antes de entrar a la parte de los grandes depredadores.",
      },
    ],
    "museu-de-cera": [
      {
        q: "¿Cuántas figuras tiene el Museo de Cera de Foz?",
        a: "Más de 100 figuras en 17 escenarios, entre cine, música, televisión, deporte, política e historia, con un área dedicada a superhéroes y villanos. Los escenarios están montados para que el visitante entre y fotografíe junto a ellos.",
      },
      {
        q: "¿Se pueden tomar fotos en el Museo de Cera?",
        a: "Se puede, y es el punto del paseo. Las figuras están en escenarios abiertos, en su mayoría sin cordón de aislamiento, justamente para que salgan bien en foto. Reserva más tiempo del que parece: la fila para los personajes más conocidos es lo que consume los minutos.",
      },
      {
        q: "¿Cuánto dura la visita?",
        a: "De 1h a 1h30 a ritmo normal. Es de las atracciones más rápidas del Dreams Park Show, lo que la hace fácil de encajar al final de un día ya cargado.",
      },
      {
        q: "¿Funciona en día de lluvia?",
        a: "Perfectamente: es interno y climatizado de principio a fin. Junto con el Ice Bar y Maravillas del Mundo, es el núcleo del plan B del complejo cuando el clima cierra en Foz.",
      },
      {
        q: "¿Hasta qué hora abre?",
        a: "Hasta las 21h de domingo a miércoles y hasta las 22h de jueves a sábado. En un plan donde las Cataratas cierran a las 16h y el Parque de las Aves a las 16:30, es una de las pocas atracciones de la ciudad todavía abierta de noche.",
      },
      {
        q: "¿Necesito entrada separada de las otras atracciones del complejo?",
        a: "Sí. Cada atracción del Dreams Park Show tiene entrada propia. Si la idea es combinar dos o tres, conviene planear la secuencia antes de llegar, porque el terreno es grande y hay que caminar entre ellas.",
      },
    ],
    "dreams-ice-bar": [
      {
        q: "¿Hay que llevar abrigo al Dreams Ice Bar?",
        a: "No. Los abrigos y guantes se entregan en la entrada y ya forman parte de la visita. El ambiente está a 15 grados bajo cero, así que la ropa térmica viene incluida — basta con llegar como estás.",
      },
      {
        q: "¿Cuánto dura la visita al Ice Bar?",
        a: "Entre 30 y 45 minutos, contando la preparación y la sesión. Es a propósito: a esa temperatura nadie quiere quedarse mucho más, y la atracción fue diseñada para ser corta e intensa.",
      },
      {
        q: "¿A qué hora es la última sesión?",
        a: "A las 21:10 de domingo a miércoles y a las 21:50 de jueves a sábado, aunque el bar cierre a las 22h o 23h. Es el detalle que más frustración causa: llegar cerca del horario de cierre no garantiza entrada.",
      },
      {
        q: "¿Los niños pueden entrar al Ice Bar?",
        a: "Pueden, y suele ser uno de los puntos altos para ellos — la novedad del frío extremo en un lugar donde afuera hace 35 grados funciona a cualquier edad. Abrigo y guantes se entregan a todos.",
      },
      {
        q: "¿Necesito entrada separada de las otras atracciones del Dreams Park?",
        a: "Sí, la entrada es por atracción. Como la visita aquí es corta, el Ice Bar suele combinarse con el Museo de Cera o el Motor Show, que están en el mismo terreno y también son techados.",
      },
      {
        q: "¿Qué hay dentro además del hielo?",
        a: "El bar sirve bebidas en vasos esculpidos en hielo, y todo el mobiliario — bancos, mesas, barra — está hecho del mismo material. La construcción en sí es la atracción: estás dentro de una estructura que debe mantenerse bajo cero todo el tiempo.",
      },
    ],
    "cataratas-jl-shopping": [
      {
        q: "¿Vale la pena incluir un shopping en el itinerario de Foz?",
        a: "Sí como apoyo: comer, comprar lo que faltó, aire acondicionado y cine. No necesitas “gastar un día” si tu foco es la naturaleza.",
      },
      {
        q: "¿JL Shopping o Catuaí Palladium?",
        a: "El Catuaí es más grande y completo en ocio; el JL es práctico y bien ubicado. Muchos visitantes usan el que quede en el camino del hotel.",
      },
      {
        q: "¿Hay dónde comer?",
        a: "Sí — patio de comidas y opciones de restaurante. Útil después de un día en el parque o antes de volver al hotel.",
      },
      {
        q: "¿Sirve para día de lluvia?",
        a: "Sirve bien: compras, cine y comida sin depender del sol.",
      },
      {
        q: "¿Es lo mismo que las compras en Paraguay?",
        a: "No. Aquí es un shopping en Brasil, con precios y reglas locales — otra lógica de “compras de frontera”.",
      },
    ],
    "shopping-catuai-palladium": [
      {
        q: "¿Catuaí Palladium es el shopping más grande de Foz?",
        a: "Es el más citado como el más grande y completo de la región en tiendas y ocio. Ideal si quieres variedad en un solo lugar.",
      },
      {
        q: "¿Cuánto tiempo reservar?",
        a: "De 2 a 5 horas, según compras, comida y cine. Puedes “perder” el día si es el plan principal.",
      },
      {
        q: "¿Queda en el camino de las Cataratas?",
        a: "Queda en la Av. das Cataratas — el eje turístico de la ciudad. Fácil de combinar con un hotel de la misma avenida.",
      },
      {
        q: "¿Vale ir con niños?",
        a: "Sí: patio de comidas, cine y espacio techado ayudan en días de calor o lluvia.",
      },
      {
        q: "¿Sustituye las compras en Paraguay?",
        a: "No en el sentido de free shop/frontera. Es un shopping brasileño de ocio y conveniencia.",
      },
    ],
    "roda-gigante-yup-star": [
      {
        q: "¿La Yup Star abre todos los días?",
        a: "No: cierra los miércoles, y funciona de 12:30 a 20:30 los demás días. Como el Marco de las Tres Fronteras cierra los lunes, los dos se cubren — si uno está cerrado el día que tienes la tarde libre, el otro está abierto.",
      },
      {
        q: "¿Cuánto dura la vuelta en la Yup Star?",
        a: "La vuelta en sí dura unos 12 minutos, suficiente para el giro completo y para las fotos. Reserva alrededor de una hora en total, contando fila y traslado — es de los pocos atractivos de Foz que entra en un hueco corto.",
      },
      {
        q: "¿Cuál es el mejor horario para subir?",
        a: "El final de la tarde, para agarrar el atardecer sobre el encuentro de los ríos y bajar con la ciudad ya encendida. A principios de la tarde la fila es mucho menor, pero la luz es dura y la vista rinde menos — ese es el intercambio.",
      },
      {
        q: "¿Funciona en día de lluvia?",
        a: "Funciona: las cabinas son cerradas y climatizadas, así que la lluvia y el calor fuerte no interrumpen la operación. Lo que suspende el paseo es el viento fuerte, por seguridad — una condición distinta de la que arruina los otros atractivos de la ciudad.",
      },
      {
        q: "¿Se puede combinar con el Marco de las Tres Fronteras el mismo día?",
        a: "Se puede, y es la secuencia más eficiente: como el giro es corto, subes al final de la tarde y sigues a cenar al Marco, cuyo restaurante atiende hasta las 22h. Los dos quedan en la zona sur de Foz, sin cruzar la ciudad.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "Ayuda en los horarios del atardecer, que son los más concurridos del día. Comprar antes o elegir un horario de principio de tarde son las dos formas de no perder tiempo en la fila.",
      },
      {
        q: "¿Pueden subir los niños?",
        a: "Pueden, y la cabina cerrada hace la experiencia tranquila incluso para quien tiene recelo de las alturas. Las reglas de edad y acompañamiento las define el operador — conviene confirmar el día de la visita.",
      },
    ],
    "macuco-safari": [
      {
        q: "¿Cómo funciona el Macuco Safari?",
        a: "Son tres etapas encadenadas: 2 km de selva en vehículo eléctrico, 600 metros de sendero a pie con guía bilingüe y, por último, el bote. Entre el sendero y el muelle hay un deck con tienda, baños y guardarropa. La navegación en sí lleva de 25 a 30 minutos.",
      },
      {
        q: "¿Macuco Safari está incluido en la entrada de las Cataratas?",
        a: "No. Los dos ocurren dentro del Parque Nacional del Iguazú, pero son paseos independientes: el Macuco tiene entrada y agenda propias, además del acceso al parque. Queda en el km 25 de la BR-469; el sendero de los miradores, en el km 18.",
      },
      {
        q: "¿Hago el Macuco antes o después del sendero de las Cataratas?",
        a: "Después. El bote empapa de verdad, y recorrer los miradores con la ropa mojada arruina la parte más fotografiada del día. El orden natural es sendero de las Cataratas por la mañana, Macuco a continuación — y el guardarropa del deck resuelve el cambio de ropa.",
      },
      {
        q: "¿Macuco y Cataratas caben el mismo día?",
        a: "Caben, y es la combinación clásica: 3 horas de sendero más 2 a 3 del Macuco llenan un día completo. Lo que no cabe es sumar el Parque de las Aves encima — ahí la cuenta se rompe y los tres paseos quedan apurados.",
      },
      {
        q: "¿Me voy a mojar mucho?",
        a: "Mucho, y ese es el punto: el bote entra en la zona de rocío de los saltos. Lleva ropa para cambiarte, deja lo que no puede mojarse en el guardarropa del deck y usa bolsa impermeable para el celular.",
      },
      {
        q: "¿El paseo puede cancelarse o alterarse?",
        a: "Puede. La accesibilidad y el acceso al bote dependen de las condiciones de navegación del río Iguazú, que cambian con el volumen de agua y el clima. Conviene confirmar antes de armar el día alrededor de él.",
      },
      {
        q: "¿Macuco y Gran Aventura (Argentina) son lo mismo?",
        a: "Son paseos en bote parecidos, pero en parques y países diferentes: el Macuco es del lado brasileño, en el Parque Nacional del Iguazú; el Gran Aventura queda en el Parque Nacional Iguazú, en Argentina. Hacer los dos es repetir la experiencia — la mayoría elige uno.",
      },
    ],
    "cataratas-lado-argentino": [
      {
        q: "¿Cuáles son los circuitos del lado argentino de las Cataratas?",
        a: "Son tres. El Superior pasa por encima de los saltos, con pocas escaleras. El Inferior baja al nivel del río, con escalinatas moderadas y el Salto Bossetti, donde el rocío moja de verdad. Y la Garganta del Diablo, a la que se llega en tren ecológico más 1 km de pasarela, frente a una caída de 82 metros.",
      },
      {
        q: "¿Cuánto dura la visita al parque argentino?",
        a: "De 5 a 6 horas para los tres circuitos, sin contar frontera ni traslado. Como el parque cierra a las 16h, el horario de entrada define cuánto llegas a ver: entrando después de las 10h, algún circuito queda afuera.",
      },
      {
        q: "¿Necesito pasaporte para las Cataratas argentinas?",
        a: "Documento de identidad original — DNI en buen estado o pasaporte. Las copias y las fotos en el celular no valen en migraciones. Los menores y quien cruza en auto tienen exigencias adicionales que conviene confirmar antes de salir.",
      },
      {
        q: "¿Cuál es la diferencia entre el lado brasileño y el argentino?",
        a: "El brasileño entrega el panorama: ves el conjunto de frente, en unas 3 horas. El argentino entrega la cercanía: pasarelas por arriba, por abajo y hasta la boca de la Garganta, en 5 a 6 horas. Uno muestra la grandeza, el otro te hace sentir la fuerza — no se sustituyen.",
      },
      {
        q: "¿Se pueden hacer los dos lados el mismo día?",
        a: "No con calidad: son dos parques grandes, en países distintos, con migraciones en el medio. La recomendación es días consecutivos — el brasileño primero, por el panorama, y el argentino al día siguiente, por la inmersión. Así la segunda visita no se vuelve una repetición de la primera.",
      },
      {
        q: "¿La entrada brasileña vale en Argentina?",
        a: "No. Son parques nacionales de países diferentes, con boleterías independientes. La entrada del Parque Nacional Iguazú se compra aparte, y el Gran Aventura — el paseo en bote que sale ahí dentro — es otra entrada más.",
      },
      {
        q: "¿Qué llevar?",
        a: "Piloto de lluvia, que acá es obligatorio: moja mucho más que el lado brasileño, y el Salto Bossetti lo garantiza incluso sin lluvia. Calzado antideslizante para las pasarelas mojadas, agua y — si haces el Gran Aventura — ropa de baño.",
      },
    ],
    "templo-budista-foz": [
      {
        q: "¿Qué días abre el Templo Budista Chen Tien?",
        a: "De martes a domingo, de 9:30 a 16:30 — con una excepción que suele pasar desapercibida: cierra el primer domingo de cada mes. Conviene revisar la fecha antes de armar el día alrededor de él, porque es la única regla de ese tipo entre los atractivos de Foz.",
      },
      {
        q: "¿Hay que pagar para entrar al templo?",
        a: "No. La entrada es libre y no hay boletería — es uno de los pocos atractivos de Foz así. A cambio, el lugar pide conducta: es un espacio religioso en funcionamiento, no un museo.",
      },
      {
        q: "¿Qué hay para ver en el Chen Tien?",
        a: "Cerca de 120 estatuas que representan reencarnaciones de Buda, tres Budas centrales — el Mi La Pu-San sentado, de siete metros, el Shakyamuni recostado y el Amitaba en bronce —, la Kuan Yin, pagodas, jardines y un templo principal de más de dos mil metros cuadrados en dos pisos.",
      },
      {
        q: "¿Cuánto dura la visita?",
        a: "De 30 a 40 minutos para el recorrido principal, llegando a una hora si te detienes en los jardines o quieres un momento de silencio. Es el atractivo más corto del corredor oeste y el más fácil de encajar en un hueco del día.",
      },
      {
        q: "¿Se puede combinar con Itaipú el mismo día?",
        a: "Se puede, y es el encaje más natural: los dos quedan en el corredor oeste, junto al Refugio Biológico y al Ecomuseo. Como el templo lleva menos de una hora, entra después de la represa sin disputar espacio con nada.",
      },
      {
        q: "¿Hay reglas de vestimenta o comportamiento?",
        a: "Sí. Ropa discreta, silencio en las áreas de culto y nada de poses irreverentes al lado de las estatuas. Fotografiar está permitido, con sentido común. Y lleva repelente: el terreno es arbolado y hay mosquitos.",
      },
      {
        q: "¿Hay vista de la ciudad?",
        a: "La hay, y es uno de los motivos para subir: desde lo alto del terreno se ve Foz do Iguaçu y, del otro lado del río, Ciudad del Este, en Paraguay. Es una perspectiva de la frontera distinta de la del Marco de las Tres Fronteras.",
      },
    ],
    "mesquita-omar-ibn-al-khattab": [
      {
        q: "¿A qué hora abre la mezquita de Foz para visitas?",
        a: "De martes a sábado en dos ventanas — de 8:30 a 11:30 y de 14h a 17:30 — y los lunes solo por la tarde, de 14h a 17:30. No abre los domingos. El intervalo del mediodía es lo que más sorprende: llegar a la hora del almuerzo significa esperar hasta las 14h.",
      },
      {
        q: "¿Los turistas pueden entrar a la mezquita?",
        a: "Pueden, en horarios definidos de visita. Es un espacio religioso activo, no un museo: la visita ocurre fuera de los momentos de oración y sigue las reglas de la comunidad que mantiene el lugar.",
      },
      {
        q: "¿Hay que comprar entrada?",
        a: "Sí, la visita tiene entrada. Como las ventanas de horario son cortas y la mezquita cierra al mediodía y los domingos, resolverlo antes evita descubrir el problema ya en la puerta.",
      },
      {
        q: "¿Hay código de vestimenta?",
        a: "Lo hay, y es condición de entrada, no sugerencia: vestimenta recatada, con hombros y piernas cubiertos. Conviene llevar algo liviano en el bolso para cubrirse, sobre todo con el calor de Foz, cuando casi nadie sale de casa vestido así.",
      },
      {
        q: "¿Qué tiene de especial la arquitectura?",
        a: "La cúpula tiene la mayor luz libre en hormigón armado de América Latina, sobre una base octogonal rodeada de arcos, con salón para hasta 580 personas. Los minaretes miden 31 metros y de ellos sale el llamado a la oración, cinco veces por día. El interior está cubierto de arabescos que la fachada no anticipa.",
      },
      {
        q: "¿Cuánto tiempo reservar?",
        a: "De 45 minutos a una hora. Es una parada cultural corta, y lo que define dónde encaja en el día no es la duración sino la ventana de horario — bastante más estrecha que la de la mayoría de los atractivos de la ciudad.",
      },
      {
        q: "¿Tiene relación con la comida árabe de Foz?",
        a: "Directa: la comunidad que levantó la mezquita en 1983 es la misma que sostiene la escena de shawarma y comida árabe de la ciudad. Visitar por la mañana y almorzar en el barrio es una de las combinaciones más coherentes del eje urbano.",
      },
    ],
    "compras-paraguai-ciudad-del-este": [
      {
        q: "¿Necesito pasaporte para ir a Ciudad del Este?",
        a: "Los brasileños cruzan con documento de identidad original, cédula o pasaporte, en buen estado de conservación. Una copia o una foto en el celular no sirve. Como las reglas de frontera cambian, conviene verificar la exigencia vigente antes de salir de Foz.",
      },
      {
        q: "¿A qué hora abre y cierra el comercio en Ciudad del Este?",
        a: "Abre temprano, cerca de las 7 u 8 de la mañana, y empieza a cerrar entre las 15 y las 16h. Es el dato que más arruina a quien planifica mal: no existen las compras de fin de tarde en Paraguay, así que este paseo tiene que ser la mañana del día, y no lo que sobra de él.",
      },
      {
        q: "¿Vale la pena ir un domingo?",
        a: "No. El domingo la mayor parte del comercio ni abre, y el sábado cierra cerca del mediodía. Si tu único día libre es domingo, cámbialo por otro programa y deja las compras para un día hábil.",
      },
      {
        q: "¿Se puede cruzar el Puente de la Amistad a pie?",
        a: "Se puede, y suele ser más rápido que en auto. El puente tiene poco más de 500 metros y la pasarela peatonal no toma la fila que traba a los vehículos sobre el río Paraná. Mucha gente deja el auto en Foz y cruza caminando, en taxi o en colectivo.",
      },
      {
        q: "¿Hay límite para traer las compras de vuelta a Brasil?",
        a: "Lo hay. La Receita Federal aplica un cupo de exención por persona, y el de la frontera terrestre es distinto del de quien llega en avión. El valor se actualiza periódicamente, así que conviene verificar el vigente antes de cruzar — es lo que evita sorpresas a la vuelta.",
      },
      {
        q: "¿Se pueden combinar las compras y los Saltos del Monday el mismo día?",
        a: "Se puede, y es el encaje más eficiente del lado paraguayo. El comercio cierra entre las 15 y las 16h, y el parque de los Saltos, a 10 km en Presidente Franco, abre hasta las 19h. Compras por la mañana y cascada por la tarde resuelven el día sin cruzar el puente dos veces.",
      },
      {
        q: "¿Comprar en Paraguay es lo mismo que el duty free en Argentina?",
        a: "No. Son países, fronteras y tipos de tienda diferentes: en Ciudad del Este caminas por galerías y shoppings de calle, mientras que el duty free de Puerto Iguazú es una única tienda junto a la aduana. Cada uno tiene su propia página acá, porque también son días distintos del itinerario.",
      },
    ],
    "saltos-del-monday": [
      {
        q: "¿Dónde quedan exactamente los Saltos del Monday?",
        a: "En el Parque Municipal Monday, en Presidente Franco — no en Ciudad del Este, como muchos suponen. Es la ciudad vecina, a unos 10 km del Puente de la Amistad, lo que deja el parque a un trayecto corto de quien se hospeda en Foz.",
      },
      {
        q: "¿Se puede ir el mismo día de las compras en Paraguay?",
        a: "Se puede, y el horario ayuda: el comercio de Ciudad del Este cierra alrededor de las 16h, y el parque sigue abierto hasta las 19h. La secuencia natural es comprar de mañana y hacer los saltos al final de la tarde, cuando los locales ya cerraron y todavía hay luz.",
      },
      {
        q: "¿Los Saltos del Monday son como las Cataratas del Iguazú?",
        a: "No, y la diferencia no es solo de tamaño. Son tres saltos de unos 45 metros en un parque que se recorre en pocas horas, sin la multitud del Parque Nacional. Complementan el itinerario de frontera; no sustituyen a las Cataratas.",
      },
      {
        q: "¿Qué documento necesito para cruzar?",
        a: "Documento de identidad reciente o pasaporte. La regla que más complica es la de los menores: quien tiene menos de 18 años y viaja sin los padres necesita autorización internacional certificada ante escribanía, presentada con los originales.",
      },
      {
        q: "¿Qué hay en el parque además de los saltos?",
        a: "Un ascensor panorámico que baja desde la parte alta hasta la base del salto principal, senderos livianos, miradores, tirolesa y un área de arborismo para chicos. Hay baños, cafetería y restaurante — estructura sencilla, pero suficiente para una tarde entera.",
      },
      {
        q: "¿Cuál es la mejor época para visitar?",
        a: "El parque funciona bien todo el año, pero en época de lluvia el río Monday crece y los saltos quedan mucho más impresionantes. Es lo contrario de lo que pasa con los paseos en bote y los senderos, que empeoran en esas mismas condiciones.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "No suele hacer falta — el parque tiene boletería propia y capacidad holgada. Lo que exige planificación es la frontera y el transporte, no la entrada.",
      },
    ],
    "by-night-argentina-puerto-iguazu": [
      {
        q: "¿Qué incluye el by night en Puerto Iguazú?",
        a: "Cuatro paradas: el Duty Free Shop en la Ruta 12 (cerca de 40 minutos), el bar de hielo (otros 40, a hasta diez grados bajo cero), la feria de la Av. Brasil (cerca de una hora, la parada más larga) y el casino del City Center (40 minutos). Con el traslado, el circuito ocupa de 4 a 5 horas.",
      },
      {
        q: "¿El bar de hielo de acá es el mismo de Foz?",
        a: "No, son dos bares de hielo distintos en ciudades distintas. Este queda en Puerto Iguazú, Argentina, y forma parte del circuito nocturno; el Dreams Ice Bar está en Foz, dentro del Dreams Park Show. Quien ya fue a uno difícilmente extraña el otro.",
      },
      {
        q: "¿Cuándo encajar el by night en el itinerario?",
        a: "Después de un día en las Cataratas argentinas, que cierran a las 16h — ya estás de ese lado y la frontera ya se resolvió una vez. El circuito se lleva la noche entera, así que no entra junto con la Itaipú Iluminada, del lado brasileño. Con el Madero Tango es distinto: el show queda en el mismo complejo del casino, última parada de acá, y la función de las 22:30 permite encadenar.",
      },
      {
        q: "¿Qué documento necesito para cruzar de noche?",
        a: "Documento de identidad original para cruzar el Puente Tancredo Neves, como en cualquier cruce hacia Argentina. El detalle nocturno es la vuelta: el flujo en migraciones cambia después de la cena, y el regreso a Foz no siempre es rápido.",
      },
      {
        q: "¿Qué se encuentra en la feria?",
        a: "Empanadas, alfajores, tabla de fiambres, aceitunas rellenas, quesos, vinos y cerveza local, además de artesanías y recuerdos. Es donde se cruzan turistas y vecinos, y la hora del atardecer es la más movida.",
      },
      {
        q: "¿Se puede cambiar el casino por una cena?",
        a: "Se puede — parrillas y pizzerías del centro de Puerto Iguazú son la alternativa más común, y hay quien agrega un show de tango. El casino es la parada más prescindible del circuito para quien viaja con niños.",
      },
      {
        q: "¿Qué se compra en el Duty Free?",
        a: "Bebidas, perfumes, cosméticos, ropa e importados en general, libres de impuesto hasta el límite de la cuota. Es una lógica distinta de la de Ciudad del Este: menos variedad y menos caos, más marcas y ambiente de tienda.",
      },
    ],
    "kattamaram-foz": [
      {
        q: "¿Por dónde navega el Kattamaram?",
        a: "Por el Puente de la Fraternidad, el Encuentro de las Aguas, el Marco de las Tres Fronteras, las obras del Puente de la Integración y el Puente de la Amistad. Es el conjunto de estructuras que define la Triple Frontera, visto desde el agua, con un guía explicando el papel de cada una.",
      },
      {
        q: "¿Cuál es la diferencia entre la salida de almuerzo y la de atardecer?",
        a: "El trayecto es el mismo; cambian el horario y la comida. La de almuerzo ocupa el mediodía y libera tu final de tarde para otro programa. La de atardecer suma el sol bajando en el horizonte paraguayo y cierra la noche con cena a bordo.",
      },
      {
        q: "¿El Kattamaram pasa por las Cataratas?",
        a: "No. Es navegación por los ríos de la frontera, no el bote que entra en la base de los saltos — ese es el Macuco Safari, del lado brasileño, o el Gran Aventura, del argentino. Acá el paisaje es la confluencia de los ríos y los puentes, no la caída de agua.",
      },
      {
        q: "¿Vale la pena si ya voy al Marco de las Tres Fronteras?",
        a: "Vale, porque es el mismo paisaje desde el lado opuesto: desde el Marco miras el río desde arriba; desde el barco miras la ciudad desde dentro del río. Con poco tiempo eliges uno — los dos ocupan el mismo final de tarde, salvo que tomes la salida de almuerzo.",
      },
      {
        q: "¿La comida está incluida?",
        a: "Hay buffet a bordo en las dos modalidades — almuerzo en una, cena en la otra. En la práctica el paseo sustituye la comida en vez de sumarse a ella, lo que cambia la planificación del día más de lo que parece.",
      },
      {
        q: "¿Hay que reservar con antelación?",
        a: "Conviene, sobre todo en las salidas de atardecer, que son las más buscadas, y en temporada alta. La grilla de horarios cambia según la estación y la demanda.",
      },
      {
        q: "¿Pueden ir niños?",
        a: "Pueden, y el formato ayuda: embarcación estable, recorrido sin esfuerzo físico y comida disponible a bordo. Las reglas de edad mínima y el uso de chaleco las define el operador.",
      },
    ],
    "wonder-park-foz": [
      {
        q: "¿Qué atracciones tiene el Wonder Park Foz?",
        a: "Cuatro: el Movie Cars, con 50 vehículos icónicos del cine, la TV, los dibujos animados y la música en 20 escenarios; la Bonnie's Burger, hamburguesería temática de los años 50; el Show de Aguas, en el lago del complejo, con luz y proyecciones; y el Lumina Park, un sendero nocturno iluminado por el monte.",
      },
      {
        q: "¿A qué hora abre el Wonder Park?",
        a: "Depende de la atracción. El Movie Cars y la Bonnie's Burger funcionan de 11h a 23h, todos los días. El Show de Aguas y el Lumina Park recién empiezan a las 20h — no existe versión diurna de ninguno de los dos.",
      },
      {
        q: "¿Se puede ver el Show de Aguas y el Lumina Park la misma noche?",
        a: "Los dos empiezan a las 20h, así que conviene confirmar la grilla de funciones antes de contar con ambos. Si hay horarios alternados, entran; si no, hay que elegir — y el Movie Cars, abierto hasta las 23h, funciona bien antes o después de cualquiera de ellos.",
      },
      {
        q: "¿Wonder Park y Dreams Park Show son lo mismo?",
        a: "No. Son complejos distintos en la misma avenida: el Dreams Park queda en el km 8 y reúne dinosaurios, museo de cera, maravillas del mundo y bar de hielo; el Wonder Park está en el km 20, más cerca de las Cataratas, con autos de cine y atracciones nocturnas de luz. Entradas y propuestas son independientes.",
      },
      {
        q: "¿Queda cerca de las Cataratas?",
        a: "Mucho: a menos de 950 metros de la entrada del Parque Nacional, en el km 20 de la misma ruta. Pasas por delante al volver del parque, lo que vuelve natural cenar aquí después de las 16h y quedarse para los shows de las 20h.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "Lo que exige atención no es la compra sino el horario: las atracciones nocturnas tienen función marcada y el resto funciona por flujo. Decidir antes cuáles de las cuatro quieres es lo que evita llegar fuera de la ventana correcta.",
      },
      {
        q: "¿Es bueno para familias?",
        a: "Lo es, y el formato ayuda: los autos de cine gustan a adolescentes y adultos, el Lumina Park funciona bien con niños, y la hamburguesería resuelve la cena sin salir del lugar. Como no es un parque de juegos radicales, el ritmo es tranquilo.",
      },
    ],
    "helisul-experience-helicoptero-cataratas": [
      {
        q: "¿Cuánto dura el vuelo en helicóptero sobre las Cataratas?",
        a: "Cerca de 10 minutos en el aire. El programa completo lleva de 1 a 2 horas, sumando traslado, check-in, pesaje y briefing de seguridad — la mayor diferencia entre tiempo comprometido y tiempo de experiencia de cualquier atractivo de Foz, y conviene saberlo antes.",
      },
      {
        q: "¿Qué se ve desde arriba que no se ve desde el suelo?",
        a: "La forma del conjunto. Desde el aire aparecen la herradura entera de una vez, la Garganta del Diablo vista desde arriba y el dibujo del río Iguazú abriéndose en decenas de brazos antes de la caída. Es la única perspectiva que explica la geografía del lugar.",
      },
      {
        q: "¿Se puede volar el mismo día del sendero de las Cataratas?",
        a: "Se puede, y es el encaje más común: son apenas 10 minutos de vuelo, así que se suma a las 3 horas del sendero sin romper el día. Lo que no cabe es agregar también el Macuco Safari — ahí la cuenta no cierra.",
      },
      {
        q: "¿El vuelo se cancela con lluvia?",
        a: "Puede cancelarse o reprogramarse por lluvia, viento o techo de nubes bajo. Por eso el sobrevuelo nunca debe ser el compromiso inaplazable de la agenda: arma el día de modo que, si se cae, el resto siga en pie.",
      },
      {
        q: "¿Hay restricción de peso o edad?",
        a: "La hay. La operación aplica límite de peso por vuelo y por pasajero, con pesaje en el check-in, además de reglas propias para niños. Son condiciones de seguridad, no burocracia — confírmalas al reservar para que no haya sorpresa en el embarque.",
      },
      {
        q: "¿Hay que reservar con antelación?",
        a: "Ayuda, porque la capacidad por vuelo es pequeña y los horarios de mejor luz salen primero. Como el vuelo depende del clima, también conviene entender la política de reprogramación antes de cerrar.",
      },
      {
        q: "¿Vale la pena aunque sea corto?",
        a: "Depende de lo que busques. Quien quiere entender y fotografiar la escala de los saltos encuentra aquí el único ángulo posible. Quien prioriza tiempo dentro del parque puede saltearlo sin perder nada esencial — el sendero y la Garganta siguen siendo el centro de la visita.",
      },
    ],
    "eco-park-foz": [
      {
        q: "¿A qué hora son los shows del Dreams Eco Park?",
        a: "Son dos, cada uno con dos funciones: Criollo: el Caballo de Oro a las 10h y a las 15:30, y el Vuelo Libre de las Aves a las 10:30 y a las 16h. Como quedan a 30 minutos uno del otro en cada turno, se pueden ver los dos en la misma visita — siempre que llegues a las 10h o a las 15:30.",
      },
      {
        q: "¿El parque cierra al mediodía?",
        a: "Cierra. Funciona en dos ventanas, de 9h a 12:30 y de 14:30 a 18h. Llegar a las 13h significa esperar hasta las 14:30, y llegar a las 11h o a las 17h significa perder los dos shows y conocer solo la Minigranja.",
      },
      {
        q: "¿Qué es la cetrería del Vuelo Libre de las Aves?",
        a: "Es el arte milenario de entrenar aves rapaces para cazar en sociedad con el cetrero. En el show las aves salen del brazo del entrenador, vuelan libres por el predio y regresan — el resultado directo del trabajo de recuperación que el parque hace con gavilanes, lechuzas y otras especies acogidas.",
      },
      {
        q: "¿Eco Park y el Parque de las Aves son lo mismo?",
        a: "No, y la diferencia es grande. El Parque de las Aves queda al lado del Parque Nacional y son viveros inmersivos de aves de la Mata Atlántica que recorres a tu ritmo. El Eco Park está en la Av. das Cataratas, 8100, y su propuesta es cetrería, caballos criollos y minigranja, con shows en horario fijo.",
      },
      {
        q: "¿Queda junto al Dreams Park Show?",
        a: "Queda en la misma dirección, Av. das Cataratas, 8100. Eso vuelve natural la dupla en itinerarios de cuatro días o más, y permite encajar las dos ventanas del Eco Park alrededor de las atracciones techadas del Dreams, que funcionan de 11h a 23h.",
      },
      {
        q: "¿Hay que comprar la entrada con antelación?",
        a: "Lo que exige planificación es el horario, no la compra: con funciones fijas y cierre al mediodía, llegar en la ventana correcta vale más que cualquier antelación. Existen entradas combinadas con el Dreams Park que cambian la cuenta del día.",
      },
      {
        q: "¿Es bueno para niños?",
        a: "Es de los mejores de Foz en ese punto: el Vuelo Libre atrapa incluso a los más chicos, el show del caballo tiene ritmo propio y la Minigranja permite contacto directo con los animales. Buena parte es al aire libre, así que la lluvia fuerte compromete la visita.",
      },
    ],
    "ecomuseu-itaipu": [
      {
        q: "¿Hay que comprar entrada para el Ecomuseo?",
        a: "No. La entrada es libre y no exige reserva previa. Lo que sí es obligatorio es documento de identidad con foto oficial y completar un registro de visita en la recepción.",
      },
      {
        q: "¿Qué días abre el Ecomuseo?",
        a: "De miércoles a lunes, de 8:30 a 16h. Cierra los martes — el mismo día que el Refugio Biológico Bela Vista. Quien reserve el martes para el eje de Itaipú pierde los dos y se queda solo con las visitas a la represa, que funcionan todos los días.",
      },
      {
        q: "¿Qué hay para ver en el Ecomuseo?",
        a: "Tres exposiciones en cuatro paradas: la Ciencia en la Esfera, que usa tecnología inmersiva para explicar el planeta y sus fenómenos; el Territorio Ilustrado, con 25 acuarelas de la flora regional de Thaís Regina Marcon; y el Territorio Revelado, con fotografías de Edino Krug sobre el Lago de Itaipú y la región costera.",
      },
      {
        q: "¿La visita está disponible en otros idiomas?",
        a: "No. La atención del Ecomuseo se hace solamente en portugués, a diferencia de la visita a la represa, que tiene audioguía en otros idiomas. Conviene tenerlo en cuenta si viajas con alguien que no habla el idioma.",
      },
      {
        q: "¿Cuánto dura la visita?",
        a: "Cerca de una hora, distribuida en cuatro paradas. Es el atractivo más corto del complejo de Itaipú, lo que lo vuelve el encaje fácil entre la visita a la represa y el Refugio Biológico.",
      },
      {
        q: "¿Vale la pena si ya voy a ver la usina?",
        a: "Vale, porque cuenta la otra mitad de la historia. La visita a la represa muestra la ingeniería; el Ecomuseo muestra lo que existía antes y lo que la obra transformó — la Mata Atlántica, el lago y la región costera. Una hora para completar el sentido del día entero.",
      },
      {
        q: "¿Es bueno para niños?",
        a: "Es libre para todas las edades, y la Ciencia en la Esfera suele ser la parte que más atrapa a los más chicos por ser visual y dinámica. Un detalle: esa exposición pasa por mantenimientos programados de tanto en tanto, así que conviene confirmar la disponibilidad si es el motivo de la visita.",
      },
    ],
    "aguaray-eco-esportes": [
      {
        q: "¿Cómo funciona la Expedición Iguazú del Aguaray?",
        a: "Es un recorrido encadenado: sendero hasta la base de canotaje en la orilla del río Iguazú, instrucciones y equipos, remada hasta el río Tamanduá, sendero hasta la Cascada da Toca para bañarse, regreso en kayak y, al final, la Cascada do Juruvá antes del sendero de vuelta. En total, 4,5 km de caminata y 2 km de remada.",
      },
      {
        q: "¿A qué hora son las salidas?",
        a: "Dos por día, a las 9h y a las 14:30, de martes a domingo — cierra los lunes. Conviene llegar 15 minutos antes, y la cancelación se permite hasta 6 horas antes del horario agendado.",
      },
      {
        q: "¿Cuál es el nivel de dificultad?",
        a: "Moderado. La remada es suave y sin correntada, pero los 4,5 km de sendero sumados a las tres horas y media de actividad piden disposición. No es un paseo contemplativo: caminas, remas y entras al agua.",
      },
      {
        q: "¿Hay edad mínima?",
        a: "Sí, 10 años. Los menores de 18 necesitan autorización de los padres. Es el atractivo del catálogo con la restricción de edad más alta — quien viaja con niños pequeños necesita otra opción de naturaleza.",
      },
      {
        q: "¿El transporte está incluido?",
        a: "No. La actividad ocurre en Remanso Grande, fuera del corredor turístico, y llegar hasta allí corre por tu cuenta. Es el principal detalle logístico a resolver antes de reservar.",
      },
      {
        q: "¿Qué llevar?",
        a: "Botella de agua, repelente, protector solar, ropa liviana de secado rápido y calzado cerrado que pueda mojarse — las ojotas y sandalias no están permitidas. Lleva también ropa y calzado extra para cambiarte al final, y mochila para tus cosas. La estructura es simple, con baño ecológico y sin venta de comida ni bebida.",
      },
      {
        q: "¿Sustituye al Macuco Safari?",
        a: "No, son propuestas opuestas. El Macuco es corto, dentro del Parque Nacional, y la emoción es el bote entrando en la base de los saltos. El Aguaray es largo, fuera del circuito masivo, y la propuesta es esfuerzo físico y silencio. Quien busca aventura de verdad suele querer los dos, en días distintos.",
      },
    ],
    "gran-aventura": [
      {
        q: "¿Cómo se llega al bote del Gran Aventura?",
        a: "Dentro del parque, un transporte recorre 6 kilómetros por el Sendero Yacaratiá, en selva subtropical, hasta Puerto Macuco. Ahí te pones el chaleco y embarcas. El tramo de selva es parte de la experiencia, no un simple traslado.",
      },
      {
        q: "¿El Gran Aventura está incluido en la entrada del Parque Nacional Iguazú?",
        a: "No. Es un paseo aparte, con entrada propia, aunque existen combinados que juntan el ingreso al parque y el bote. Conviene verificar qué formato estás comprando para no descubrirlo en la portería.",
      },
      {
        q: "¿Se puede hacer el Gran Aventura y los tres circuitos el mismo día?",
        a: "Se puede, pero sin holgura. Los circuitos Superior, Inferior y Garganta ya piden de 5 a 6 horas, el parque cierra a las 16h y el bote suma su propio tiempo. Contando la frontera y el trayecto desde Foz, esa combinación solo funciona entrando en la apertura.",
      },
      {
        q: "¿Gran Aventura y Macuco Safari son lo mismo?",
        a: "Son el mismo tipo de paseo en países distintos: bote hasta la base de los saltos, con baño garantizado. El Macuco es del lado brasileño, el Gran Aventura del argentino. Hacer los dos es repetir la experiencia — la mayoría elige uno y usa el tiempo del otro para las pasarelas.",
      },
      {
        q: "¿Me voy a mojar mucho?",
        a: "Mucho, y ese es el punto. El bote entra en la zona de rocío de la parte inferior de los saltos. Lleva ropa para cambiarte y bolsa impermeable para el celular — la recomendación de llevar ropa de baño al lado argentino existe justamente por este paseo.",
      },
      {
        q: "¿Qué se ve que las pasarelas no muestran?",
        a: "El ángulo desde abajo. Las pasarelas miran los saltos desde arriba y de frente; el bote te pone debajo de ellos, y en el camino pasa por la Isla Martín, que no aparece en ninguno de los circuitos a pie.",
      },
      {
        q: "¿Pueden ir niños?",
        a: "Hay restricción de edad y reglas de seguridad definidas por la operación, y conviene confirmarlas antes de comprar. El paseo es corto pero intenso, con el bote a velocidad y agua entrando por todos lados.",
      },
    ],
    "madero-tango-iguazu": [
      {
        q: "¿Cuánto dura el show del Madero Tango?",
        a: "Cerca de 1h30. El espectáculo recorre la historia del tango con bailarines y músicos en vivo y termina con una clase rápida, en la que se invita al público a bailar — suele ser la parte más recordada de la noche.",
      },
      {
        q: "¿A qué hora son las funciones?",
        a: "Dos por noche, a las 20:30 y a las 22:30, de martes a domingo. La más tarde abre la posibilidad de encajar el tango después de otro programa, con la contrapartida de correr el cruce para después de la medianoche.",
      },
      {
        q: "¿La cena está incluida?",
        a: "Depende del formato. Hay una versión con cena, en la que el menú acompaña el espectáculo y las bebidas se cobran aparte, y una versión solo de show, en las modalidades Ejecutivo y VIP — en esas, la comida no entra. Confirma cuál estás comprando.",
      },
      {
        q: "¿Cuál es la diferencia entre Ejecutivo y VIP?",
        a: "Solamente la ubicación del asiento en el salón. El espectáculo es el mismo, con la misma duración y el mismo contenido — lo que cambia es el ángulo y la distancia del escenario.",
      },
      {
        q: "¿Dónde queda el Madero Tango?",
        a: "En el complejo del Casino Iguazú, en la Ruta Nacional 12, km 1640, en Puerto Iguazú, bien cerca de la aduana de la frontera. Es la misma dirección donde termina el circuito by night de la ciudad, lo que permite encadenar los dos en la función más tarde.",
      },
      {
        q: "¿Necesito ir a las Cataratas argentinas para ver el tango?",
        a: "No. Es un programa nocturno independiente, y hay quien cruza la frontera solo para eso. Pero como el cruce ya está resuelto, tiene sentido para quien pasó el día del lado argentino y quiere cerrar la noche ahí mismo.",
      },
      {
        q: "¿Hay código de vestimenta?",
        a: "Se suele pedir smart casual — evita ojotas, musculosa y ropa de playa. Conviene confirmarlo al reservar, sobre todo en la versión con cena, la más formal de las dos.",
      },
    ],
    "blue-park-foz": [
      {
        q: "¿Cuáles son las atracciones del Blue Park?",
        a: "La playa de olas, con nueve tipos de ola que llegan a 1,20 metro y una franja de arena alrededor; el río lento, para dejarse llevar sobre una boya; el Fast Falls, con cuatro pistas de tobogán de más de 100 metros; el Super Maverick, de 18 metros de altura y hasta 60 km/h; el Kids Town, para niños; y un área baby para bebés de 6 meses a 2 años.",
      },
      {
        q: "¿El agua es caliente?",
        a: "Es templada, no caliente. Ronda los 28 °C en la superficie y viene del Acuífero Guaraní — temperatura agradable con el calor de Foz, pero insuficiente para un día frío de invierno. Quien espera una experiencia de termas suele frustrarse; quien espera un parque acuático, no.",
      },
      {
        q: "¿Hay que estar hospedado en el Mabu Thermas para entrar?",
        a: "No. El parque queda junto al resort y está incluido en la tarifa de quien se hospeda allí, pero el acceso no es exclusivo de huéspedes — hay day use para visitantes externos.",
      },
      {
        q: "¿Todas las atracciones están incluidas en la entrada?",
        a: "Casi todas. Quedan fuera el wakeboard en el lago y la tirolesa de 300 metros de extensión por 30 de altura, que se contratan aparte. Las piscinas, los toboganes y las áreas infantiles forman parte del acceso común.",
      },
      {
        q: "¿Hay dónde comer dentro del parque?",
        a: "Sí. Hay cafeterías repartidas por el predio, con porciones, comidas ligeras y bebidas, además de un bar dentro de la piscina — se puede pasar el día sin salir.",
      },
      {
        q: "¿Vale la pena con pocos días en Foz?",
        a: "Con dos o tres días, lo esencial sigue siendo naturaleza y frontera. El Blue Park entra bien en itinerarios de cuatro días o más, en un día de calor fuerte, o cuando el grupo tiene niños y necesita un respiro entre los senderos.",
      },
      {
        q: "¿Qué llevar?",
        a: "Ropa de baño, toalla, protector solar y ojotas. Conviene reservar algo para el consumo en las cafeterías y para las atracciones que se pagan aparte, si quieres hacer el wake o la tirolesa.",
      },
    ],
    "iguassu-secret-falls": [
      {
        q: "¿Qué opciones de paseo ofrece Iguassu Secret Falls?",
        a: "Seis. El sendero único, con dos cascadas en 2 horas y dos horarios de salida; el medio día; el día entero, de 8:30 a 18h, con 4 senderos y 10 cascadas; el Luau Secret Falls, de 6 horas y nocturno; y las expediciones Tamanduá (3,5 km) y Carimã (3 km), de 8 horas cada una.",
      },
      {
        q: "¿Se puede conocer una cascada secreta sin perder el día?",
        a: "Se puede — para eso existe el sendero único, de 2 horas hasta dos cascadas, con dos horarios para elegir. Es la forma de encajar naturaleza de verdad en un día que ya tiene otro programa principal.",
      },
      {
        q: "¿Qué es el Luau Secret Falls?",
        a: "La versión nocturna, de unas 6 horas: sendero de noche, baño de cascada, chapuzón en el río Iguazú, picnic, fogata y música en vivo. Depende de disponibilidad de agenda, así que no cuentes con él sin confirmar antes.",
      },
      {
        q: "¿Cuál es la diferencia entre las expediciones Tamanduá y Carimã?",
        a: "La Tamanduá son 3,5 km por monte cerrado hasta varias caídas buenas para nadar y saltar. La Carimã recorre 3 km pasando por las nacientes del Río Ouro Verde y el Vivero Municipal, terminando en tres caídas del Río Carimã. Ambas ocupan 8 horas.",
      },
      {
        q: "¿Hay que reservar?",
        a: "Hay que hacerlo. Ninguna modalidad funciona por llegada espontánea: los grupos salen en horario definido y el recorrido depende de guía. La dirección publicada es el punto de encuentro, en Vila Yolanda — los senderos quedan en otros puntos de la región.",
      },
      {
        q: "¿Cuál es el nivel de dificultad?",
        a: "De leve a moderado según la opción. El sendero único de 2 horas es accesible para la mayoría; las expediciones de 8 horas y el día entero piden disposición física real y caminata en terreno natural. Avisa las limitaciones al reservar.",
      },
      {
        q: "¿Sustituye a las Cataratas?",
        a: "No, y ni lo intenta. Las Cataratas son paisaje para mirar; acá la propuesta es meterse al agua. Funciona mejor como el contrapunto del itinerario — un día de monte y baño después de dos de miradores y pasarelas.",
      },
    ],
    "la-aripuca": [
      {
        q: "¿Qué es una aripuca?",
        a: "Una trampa de caza guaraní: una estructura de troncos que se sostiene por su propio peso y cae sobre la presa. La construcción que da nombre al lugar es una versión gigante de ella, levantada con madera recuperada de especies nativas de la selva paranaense — árboles que ya habían caído o sido talados.",
      },
      {
        q: "¿Cuánto dura la visita?",
        a: "De 30 minutos a una hora, contando los senderos interpretativos, la estructura principal y la tienda de artesanías. Es una de las paradas más cortas del lado argentino, lo que la hace fácil de encajar en cualquier medio día.",
      },
      {
        q: "¿Hay que comprar entrada?",
        a: "Sí, la visita tiene entrada propia — sin relación con la del Parque Nacional Iguazú. Son atractivos diferentes, con boleterías independientes, aunque queden en la misma ruta.",
      },
      {
        q: "¿A qué hora abre?",
        a: "Todos los días, de 9 a 18 hs. Como las Cataratas argentinas cierran a las 16h, queda una ventana para parar aquí en la vuelta del parque, antes de cruzar de nuevo a Foz.",
      },
      {
        q: "¿Hay dónde comer en el lugar?",
        a: "Hay restaurante con sabores regionales, heladería y cafetería dentro del parque. Se puede resolver un almuerzo o una merienda sin salir, lo que ayuda en días de frontera con el tiempo justo.",
      },
      {
        q: "¿Es bueno para niños?",
        a: "Lo es. La escala de la estructura impresiona a cualquier edad, los senderos son cortos y planos, y la propuesta educativa funciona bien con escuelas y grupos familiares. Es uno de los pocos atractivos del lado argentino que no exige esfuerzo físico alguno.",
      },
      {
        q: "¿Con qué combina el mismo día?",
        a: "Con el Hito Tres Fronteras y la feria del centro de Puerto Iguazú, formando un medio día urbano argentino. También entra después de las Cataratas AR, si sales del parque en el horario de cierre.",
      },
    ],
    "hito-tres-fronteras": [
      {
        q: "¿El Hito Tres Fronteras y el Marco das Três Fronteiras son el mismo lugar?",
        a: "No. Son dos hitos diferentes, uno en cada país, mirando la misma confluencia de ríos: el Hito queda en Puerto Iguazú, Argentina, y el Marco en Foz do Iguaçu, Brasil. Desde el mirador de uno ves el otro — y el tercero, el paraguayo, completa el triángulo.",
      },
      {
        q: "¿Hay que comprar entrada para visitar el Hito?",
        a: "No. Es un área pública al aire libre, de entrada libre, sin molinete ni horario de visita. Es justamente lo que lo diferencia del Marco brasileño, que tiene boletería y agenda propia.",
      },
      {
        q: "¿Cuál es el mejor horario para ir?",
        a: "El fin de la tarde. El mirador está orientado hacia la confluencia de los ríos y es la puesta de sol la que arma la escena — y como no hay horario de cierre, se puede quedar hasta después de que oscurezca, cuando se encienden las luces de las tres ciudades al mismo tiempo.",
      },
      {
        q: "¿Vale la pena si ya conozco el Marco das Três Fronteiras?",
        a: "Vale en dos situaciones. Si estás en Foz un lunes, el Marco brasileño cierra y el Hito es la única manera de ver la confluencia. Y si ya lo viste de un lado, verlo del otro es literalmente el paisaje invertido: los países que estaban frente a ti pasan a estar a tus espaldas.",
      },
      {
        q: "¿Necesito pasaporte saliendo de Foz?",
        a: "Necesitas documento de identidad original para entrar a Argentina — cédula en buen estado o pasaporte. El Hito en sí no cobra nada y no tiene relación con la entrada del Parque Nacional Iguazú, que es una visita aparte.",
      },
      {
        q: "¿Qué hay en el lugar además del hito?",
        a: "El espacio fue puesto en valor y ganó paseo al borde de la barranca, plaza con anfiteatro, feria de artesanos y opciones de comida en el entorno. Se puede estar una o dos horas sin apuro, algo que no pasaba cuando el lugar era solo el obelisco.",
      },
      {
        q: "¿Con qué combina el mismo día?",
        a: "Con La Aripuca y la feria del centro de Puerto Iguazú, formando un medio día urbano argentino. También cierra bien un día que empezó en las Cataratas del lado argentino: el parque cierra a las 16h, La Aripuca abre hasta las 18h en el camino de vuelta y el Hito se queda con la puesta de sol.",
      },
    ],
    "duty-free-shop-puerto-iguazu-argentina": [
      {
        q: "¿Qué es el Duty Free de Puerto Iguazú?",
        a: "Es la tienda libre de la frontera argentina, justo después del puesto aduanero sobre la RN 12. Al ser área franca, los productos no pagan impuesto de importación — perfumería, bebidas destiladas, cosméticos, chocolates y electrónica son las categorías que llevan a la mayoría hasta allá.",
      },
      {
        q: "¿Necesito pasaporte para entrar al free shop?",
        a: "Necesitas documento de identidad original — cédula en buen estado o pasaporte. Estás cruzando una frontera internacional para llegar a la tienda, así que una copia o una foto en el celular no sirve en la aduana.",
      },
      {
        q: "¿En qué se diferencia del shopping en Ciudad del Este?",
        a: "En la naturaleza de la compra, no en el tamaño. En Paraguay recorres galerías de calle comparando decenas de tiendas; acá es una sola dirección climatizada, con marcas definidas y atención en portugués. Para rebuscar, Paraguay; para resolver rápido, acá.",
      },
      {
        q: "¿Hay límite para llevar las compras de vuelta a Brasil?",
        a: "Lo hay. La Receita Federal aplica un cupo de exención por persona, y el de la frontera terrestre es distinto del de quien llega en avión. El valor se actualiza periódicamente, así que verifica el vigente antes de cruzar.",
      },
      {
        q: "¿Cuánto tiempo reservar para el free shop?",
        a: "Medio día alcanza con holgura. Por eso mismo rara vez ocupa un día entero: entra antes o después de otro programa del lado argentino sin comprometer el resto de la agenda.",
      },
      {
        q: "¿Se puede pagar en reales o tiene que ser en dólares?",
        a: "Las compras son en dólares y la tarjeta funciona normalmente. Conviene consultar con tu banco cómo queda la conversión antes de viajar — eso cambia la cuenta final más que la diferencia entre una tienda y otra.",
      },
      {
        q: "¿Con qué combina el mismo día?",
        a: "Con todo lo que queda sobre la RN 12: las Cataratas del lado argentino, el Hito Tres Fronteras y La Aripuca están en la misma ruta. Gastar un cruce de frontera entero solo con el free shop es desperdiciar el traslado — está hecho para sumar, no para ocupar el día.",
      },
    ],
  },
};
