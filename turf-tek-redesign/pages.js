/* Turf Tek USA — site content. Copy and photos come from turftekusa.com (Nov 2026). */
const IMG = id => `https://transform.octanecdn.com/crop/1800x1000/https://octanecdn.com/turftekusacom/turftekusacom_${id}`;
const I = {
  home:'400372512.jpeg', a:'313423961.jpg', b:'202502628.jpg', c:'342103435.jpg', d:'410420824.jpg', e:'797752111.jpg',
  f:'793306444.jpg', g:'686444144.jpg', h:'834995471.jpg', commercial:'220578694.JPG',
  putt1:'898489545.jpg', putt2:'935640717.jpg', tennis1:'227455193.jpg', tennis2:'452688757.jpg',
  base1:'971477859.jpg', base2:'878538747.jpg', cland1:'366008809.jpg', cland2:'264979413.JPG',
  cpet1:'622951490.JPG', cpet2:'358435774.jpg', play1:'680538549.jpg', play2:'361233569.jpg',
  roof1:'762962447.jpg', roof2:'547013128.jpg', rland1:'588254182.jpg', rland2:'340252728.jpg',
  rpet1:'570219223.jpg', rpet2:'655733078.jpg'
};

const PHONE = '(631) 651-5777', TEL = 'tel:6316515777', ADDR = '6137 Jericho Turnpike, Commack, NY 11725';
const CALC = 'https://thepatrickreardon-sys.github.io/sawmill-layout/turf-calculator/';

/* Menu — same structure as the live site */
const MENU = [
  {k:'commercial', label:'Commercial', cols:[
    {title:'Commercial', items:['commercial-landscape','commercial-pet-areas','commercial-playgrounds','shade-structures','rooftops','poured-in-place','nextgen']},
    {title:'Athletics', hub:'commercial-athletics', items:['putting-greens','tennis-courts','sport-fields','baseball','indoor-facilities','bocce','courts']}
  ]},
  {k:'residential', label:'Residential', cols:[
    {title:'Residential', items:['residential-landscape','residential-playgrounds','residential-pet-areas']},
    {title:'Athletics', hub:'residential-athletics', items:['residential-putting','residential-fields','residential-tennis','bocce','residential-courts','indoor-facilities']}
  ]},
  {k:'products', label:'Products'},
  {k:'our-work', label:'Our Work'},
  {k:'financing', label:'Financing'},
  {k:'about', label:'Resources', cols:[
    {title:'Company', items:['about','testimonials','faqs','blog','careers']},
    {title:'Service Areas', items:['long-island','westchester','fairfield','financing']}
  ]}
];

const WHY = ['100% American-made products','We employ every estimator and installer — no subcontractors','Licensed, bonded and insured','Proprietary engineered installation system','Installing artificial grass since 2010'];

const PAGES = {
 home:{nav:'Home', hero:{eye:'Premium artificial grass · NY Tri-State', h:'Premium artificial grass,', acc:'installed by experts.', p:'Turf Tek USA is a premium turf provider with expert installation of high-quality, custom lawns for residential and commercial clients all across the New York Tri-State area.', img:I.home}, home:true},

 /* ---------- Commercial ---------- */
 commercial:{nav:'Commercial', hub:true, hero:{eye:'Commercial', h:'Elevate your landscapes', acc:'with premium artificial grass.', p:'Premium products. Superior installations. Unmatched value.', img:I.commercial},
  intro:'In commercial landscaping there\'s an expectation of a flawlessly green lawn that thrives all year round. Limited resources often get in the way, leading to unnecessary expense and wasted time. Synthetic turf from Turf Tek removes the upkeep and keeps your property looking its best in every season.',
  kids:['commercial-landscape','sport-fields','commercial-playgrounds','commercial-pet-areas','shade-structures','poured-in-place','courts','indoor-facilities'],
  quote:['We have worked with Bill for over 4 years and him and his teams have always delivered the best and on time. Very professional and I highly recommend them.','S. Patton']},
 'commercial-landscape':{nav:'Landscape', parent:'commercial', icon:'landscape.svg', hero:{eye:'Commercial · Landscape', h:'Edge-to-edge quality', acc:'for commercial landscapes.', p:'Premium synthetic turf for corporate campuses, retail centers, public areas, hotels and every other commercial property.', img:I.cland1},
  intro:'Synthetic grass gives commercial properties a consistently pristine, high-end appearance that lifts curb appeal year-round. Unlike natural grass it stays lush, vibrant and perfectly manicured regardless of weather, foot traffic or seasonal changes.',
  list:['Engineered for high foot traffic','Natural-looking texture and color','No mowing, watering or fertilizing','Enhances safety, sustainability and design flexibility'],
  feat:[['Smart solutions for modern commercial spaces','Turf Tek USA offers premium commercial turf systems built to handle heavy foot traffic while keeping a natural look and feel — synthetic turf delivers significant operational efficiencies for property managers.',I.cland2]], rel:['rooftops','commercial-pet-areas','shade-structures']},
 'commercial-pet-areas':{nav:'Pet Areas', parent:'commercial', icon:'dog.svg', hero:{eye:'Commercial · Pet Areas', h:'Rover never had it', acc:'so good.', p:'Pet-friendly synthetic turf for dog parks, daycares, hotels, kennels and boarding facilities.', img:I.cpet1},
  intro:'It keeps the grass green and the dogs clean, happy and mud-free. Synthetic turf significantly reduces the labor and expense of natural grass upkeep — no mowing, watering, fertilizing or patching worn-out spots from heavy pet traffic.',
  list:['Stain-resistant surface prevents yellow and brown spots','Low maintenance and very easy to clean','Enhanced durability for destructive canines','Turf backing prevents holes from digging','Drains 80" per hour — no puddles or muddy paws','Free of fleas, ticks, moles and other pests','Customized to fit any layout and space','10-year warranty on select products'],
  feat:[['Designed for zoomies','Turf stands up exceptionally well to running, digging and play, and our drainage keeps every area clean and ready to use.',I.cpet2]], rel:['residential-pet-areas','commercial-landscape','commercial-playgrounds']},
 'commercial-playgrounds':{nav:'Playgrounds & Safety Surfacing', parent:'commercial', icon:'ball-games.svg', hero:{eye:'Commercial · Playgrounds', h:'Smart surfacing', acc:'for modern playgrounds.', p:'Safe, low-maintenance, long-lasting playground turf for schools, parks and public spaces.', img:I.play1},
  intro:'Safety always comes first when it comes to children. Our proprietary engineered installation system includes shock-absorbing underlayment that meets industry fall-height safety standards, giving playgrounds a safer, cleaner and more consistent surface than natural grass or loose-fill.',
  list:['Strong Head Impact Code safety ratings','Dries quickly — back to play when the rain stops','Reduces allergic reactions caused by natural grass','Longest lifespan of all surfacing options (10–15+ years)','Will not fade, shrink, stain or lose integrity','Earn up to six LEED points','ADA compliant','Little to no maintenance after installation'],
  feat:[['Safety first on all playgrounds','IPEMA-certified playground grass, installed by crews that include Certified Playground Safety Inspectors.',I.play2]],
  rel:['poured-in-place','shade-structures','residential-playgrounds']},
 'shade-structures':{nav:'Shade Structures', parent:'commercial', icon:'certificate.svg', hero:{eye:'Commercial · Shade Structures', h:'Fully customizable', acc:'shade structures.', p:'Certified installers for leading shade structure manufacturers.', img:I.f},
  intro:'Shade structures provide essential comfort, safety and aesthetic value to outdoor commercial facilities — protecting guests, employees and visitors from harsh sun and creating cooler, more inviting spaces over playgrounds, concession areas, pool decks, parking lots, water parks and school yards.',
  list:['IPEMA certified','Can be added to playground designs','Custom sizes and colors','Protection from rain and snow as well as sun','Options for school desks, benches, chess tables and more'], rel:['commercial-playgrounds','poured-in-place','commercial-landscape']},
 rooftops:{nav:'Rooftops', parent:'commercial', icon:'grass.svg', hero:{eye:'Commercial · Rooftops', h:'Eye-catching terrain', acc:'isn\'t limited to ground level.', p:'Synthetic turf brings new living space to rooftops, patios and terraces.', img:I.roof1},
  intro:'Artificial grass turns rooftop spaces into inviting, functional outdoor retreats without the upkeep. Its lightweight design and customizable installation make it ideal for rooftops, terraces and balconies, and advanced drainage keeps surfaces dry and usable after rain.',
  list:['Withstands every climate','The look and feel of real grass','Maximizes living area on hard, unused spaces','No weeding, mowing, chemicals or water','Fire-resistant standards','Rooftop putting greens, green terraces and patio parties'],
  feat:[['Elevated rooftop experiences','From corporate terraces to residential decks, we design rooftop turf that drains fast and looks great from every angle.',I.roof2]], rel:['commercial-landscape','putting-greens','residential-landscape']},
 'poured-in-place':{nav:'Poured in Place', parent:'commercial', icon:'ball-games.svg', hero:{eye:'Commercial · Poured-in-Place', h:'Safety and aesthetics', acc:'like never before.', p:'Soft, safe and always ready for fun — in all shapes, sizes and designs.', img:I.g},
  intro:'Poured-in-place (PIP) surfacing gives playgrounds a safe, durable and highly customizable surface. It\'s a two-layer system: a base mat of 100% post-consumer recycled SBR rubber topped with a colorful wear layer.',
  list:['Fully customizable colors, patterns and designs','Withstands heavy foot traffic and all weather','ADA compliant — inclusive play for every child'],
  quote:['Amazing team work. To watch it be installed was incredible. The team was professional and polite. I would highly recommend this company.','Melissa G.'], rel:['commercial-playgrounds','shade-structures','courts']},
 nextgen:{nav:'NextGen Field System', parent:'commercial', icon:'soccer-pitch.svg', hero:{eye:'NextGen Field System', h:'The superior alternative', acc:'to crumb rubber fields.', p:'This isn\'t just an upgrade — it\'s the new standard for the future of the game.', img:I.h},
  intro:'Synthetic turf delivers consistent performance, enhanced safety and year-round playability that natural grass can\'t match. Our proprietary installation method is engineered to maximize field stability, drainage and long-term durability, with precision base preparation and athlete-first design.',
  list:['Shock absorption — impact reduction','Vertical deformation — firmness underfoot','Rotational resistance — grip and pivot','Head Injury Criterion (HIC) — critical fall height','GMAX — body impact','No crumb rubber, no flying infill'],
  quote:['When safety is built into the field, confidence follows on every play.','NextGen Field System'], rel:['sport-fields','baseball','indoor-facilities']},

 'commercial-athletics':{nav:'Athletics', parent:'commercial', hub:true, hero:{eye:'Commercial · Athletics', h:'Elevate', acc:'your performance.', p:'Resilient, low-maintenance synthetic turf for fields, courts, greens and training facilities.', img:I.e},
  intro:'Our sports fields and courts offer the best speed, pace and accuracy with multi-directional playability. Extremely durable and weather resistant — no crumb rubber, quality shock padding, and play all year long, indoors or out.',
  kids:['sport-fields','baseball','putting-greens','tennis-courts','indoor-facilities','bocce','courts','nextgen']},
 'putting-greens':{nav:'Putting Greens', parent:'commercial-athletics', icon:'golf.svg', hero:{eye:'Commercial · Putting Greens', h:'Where performance', acc:'is par for the course.', p:'Drive more business with better greens — for resorts, hotels, communities, schools and practice facilities.', img:I.putt1},
  intro:'Expertly engineered to replicate the look, feel and play of natural greens — including flawless chips and pitches. A putting course from Turf Tek is a safe, engaging amenity for guests of all ages, indoors or out.',
  list:['Durability — withstands heavy use without bare spots','Appearance — green and perfect in every season','Playability — predictable roll on a smooth, consistent surface','No mowing, watering, fertilizing or pest control'],
  feat:[['A cut above the rest','Natural grass varies with weather, wear and mowing. Our greens roll true day after day.',I.putt2]], rel:['residential-putting','bocce','rooftops']},
 'tennis-courts':{nav:'Tennis Courts', parent:'commercial-athletics', icon:'ball-games.svg', hero:{eye:'Commercial · Tennis', h:'Courts that never', acc:'miss the mark.', p:'Game-changing synthetic turf for tennis — consistent, high-performance and low-maintenance.', img:I.tennis1},
  intro:'Unlike traditional surfaces, artificial grass tennis courts let your feet slide slightly when stopping and pivoting. A uniform texture gives predictable ball bounce and speed, so players of every level enjoy a true, consistent game.',
  list:['Significantly reduced maintenance','Predictable bounce and speed','Gentler on joints','Plays in all weather'],
  feat:[['From concept to court','We handle everything from base prep to line painting.',I.tennis2]], rel:['residential-tennis','courts','sport-fields']},
 'sport-fields':{nav:'Sport Fields', parent:'commercial-athletics', icon:'soccer-pitch.svg', hero:{eye:'Commercial · Sport Fields', h:'Consistent performance,', acc:'game after game.', p:'High-performance synthetic turf fields built for the way the game is played today.', img:I.b},
  intro:'Engineered for durability, safety and all-weather play, our systems deliver consistent performance season after season. From design to installation, we create sports surfaces for soccer, lacrosse, football, training areas and fitness facilities.',
  list:['Customizable to any size and playing spec','Many colors to match your brand','Highest quality shock padding — less impact, fewer injuries','Footwear and clothes stay clean','No water, no mowing','Quick drainage — no downtime','Non-toxic infill, no chemicals','Year-round play'], rel:['nextgen','baseball','indoor-facilities']},
 baseball:{nav:'Baseball', parent:'commercial-athletics', icon:'ball-games.svg', hero:{eye:'Commercial · Baseball', h:'Knock it', acc:'out of the park.', p:'Engineered for precision, built for champions.', img:I.base1},
  intro:'From scooping a ground ball in the infield to sprinting across the outfield, players need a surface that performs like natural grass. Artificial turf for baseball is engineered to replicate that precise feel — with the same precision we bring to every commercial installation.',
  list:['True, consistent ball roll and bounce','All-weather playability','Low maintenance','Durable under heavy use'],
  feat:[['Where performance meets playability','Infields, outfields, bullpens and batting cages — one team, start to finish.',I.base2]], rel:['sport-fields','nextgen','indoor-facilities']},
 'indoor-facilities':{nav:'Indoor Facilities', parent:'commercial-athletics', icon:'certificate.svg', hero:{eye:'Athletics · Indoor Facilities', h:'Unlock the full potential', acc:'of your gym.', p:'Performance, safety and a refined look for upscale indoor training spaces.', img:I.c},
  intro:'A synthetic turf surface provides optimal traction for rapid, dynamic movement — ideal for HIIT, agility ladders, sprint work and plyometrics without the slip risk of smooth floors.',
  list:['Easy to clean','Withstands heavy use and constant foot traffic','Optimal traction for sled pushes and sprints','Refined, high-end look'], rel:['sport-fields','courts','residential-fields']},
 bocce:{nav:'Bocce Ball', parent:'commercial-athletics', icon:'ball-games.svg', hero:{eye:'Athletics · Bocce & Shuffleboard', h:'Precision surfaces', acc:'for classic court games.', p:'Reliable courts for casual and competitive play.', img:I.d},
  intro:'Bring timeless court games to life with professionally built bocce and shuffleboard surfaces. Our specialty turf systems deliver smooth, consistent ball roll with minimal bounce and no grade, plus the drainage that keeps courts playable.',
  list:['Smooth, consistent roll','Minimal bounce','Excellent drainage','A polished look for resorts, clubs and backyards'],
  rel:['putting-greens','courts','residential-courts']},
 courts:{nav:'Courts', parent:'commercial-athletics', icon:'ball-games.svg', hero:{eye:'Commercial · Sport Courts', h:'Built for', acc:'high-traffic play.', p:'Customizable multi-sport game courts for schools, parks, HOAs and multifamily communities.', img:I.a},
  intro:'A multi-sport game court turns any space into a high-energy hub for recreation — basketball, pickleball, volleyball, hockey, shuffleboard and custom games, tailored with vibrant colors and game lines.',
  list:['Safer alternative to concrete','Built-in shock absorption for player comfort','Engineered for extreme weather and heavy use','Proudly manufactured in the USA','Game Tile, Active Tile and Wood-Grain Tile options'],
  rel:['residential-courts','tennis-courts','poured-in-place']},

 /* ---------- Residential ---------- */
 residential:{nav:'Residential', hub:true, hero:{eye:'Residential', h:'Transform your home.', acc:'Love your lawn.', p:'Premium products. Superior installations. Unmatched value.', img:I.rland1},
  intro:'You deserve a stress-free, always beautiful yard. Gone are the days of half-burnt brown patches and muddy puddles tracked back into the house. Turf Tek brings premium synthetic grass and expert installation to Long Island, New York, Connecticut and New Jersey.',
  kids:['residential-landscape','residential-playgrounds','residential-pet-areas','residential-athletics'],},
 'residential-landscape':{nav:'Landscape', parent:'residential', icon:'landscape.svg', hero:{eye:'Residential · Landscape', h:'A greener yard,', acc:'all year long.', p:'Beautiful lawns without the work.', img:I.rland1},
  intro:'Artificial turf has quickly become the top choice for residential landscapes — the perfect blend of beauty, durability and convenience. Enjoy a lush, perfectly manicured lawn year-round without the constant upkeep.',
  list:['Colors and styles to match the grass in your area','Completely pet-friendly','Reduced allergens — no chemical fertilizers or insecticides','No rocks or debris — play hard, play safe'],
  feat:[['Safe, soft and family approved','Built for kids, pets and backyard parties.',I.rland2]],
  quote:['We put about 800 square feet of synthetic lawn down in a small area of side yard about three years ago, and it looks as good today as it did the day it was installed.','Residential customer'], rel:['residential-pet-areas','residential-playgrounds','residential-putting']},
 'residential-playgrounds':{nav:'Playgrounds', parent:'residential', icon:'ball-games.svg', hero:{eye:'Residential · Playgrounds', h:'Backyard playgrounds', acc:'made better.', p:'Safety you can trust, durability you can feel.', img:I.play2},
  intro:'As a parent you have two goals: keep your kids safe and keep them happy. Turf Tek playground turf does both — a safe, easy-maintenance, long-lasting surface with shock-absorbing underlayment that meets fall-height safety standards.',
  list:['IPEMA certified','Meets ASTM F1292 for fall heights up to 12 feet','Reduces allergic reactions','Dries quickly after rain','Strong Head Impact Code ratings'], rel:['commercial-playgrounds','residential-landscape','residential-pet-areas']},
 'residential-pet-areas':{nav:'Pet Areas', parent:'residential', icon:'dog.svg', hero:{eye:'Residential · Pet Areas', h:'Durable turf', acc:'for happy paws.', p:'Built to handle play, zoomies and everyday use.', img:I.rpet1},
  intro:'Dogs love real grass — especially eating it, digging it up and using it as their personal potty. Turf Tek cures those canine calamities with a clean, durable surface that won\'t turn into mud, holes or worn-down patches.',
  list:['Subsurface tiles drain moisture fast — no mud','Low maintenance, cleans easily','Anti-microbial — no pesticides or chemicals','Free of fleas, ticks, moles and rodents','Green all year long'],
  feat:[['Give your pets a better backyard','Designed for the way dogs actually play.',I.rpet2]], rel:['commercial-pet-areas','residential-landscape','residential-playgrounds']},
 'residential-athletics':{nav:'Athletics', parent:'residential', hub:true, hero:{eye:'Residential · Athletics', h:'Home field', acc:'advantage.', p:'Fields, greens, courts and training spaces — with the highest quality shock padding and non-toxic infills.', img:I.e},
  intro:'Synthetic turf for backyard fields, putting greens, tennis and multi-sport courts, batting cages and home gyms.',
  kids:['residential-fields','residential-putting','residential-tennis','residential-courts','bocce','indoor-facilities']},
 'residential-putting':{nav:'Putting Greens', parent:'residential-athletics', icon:'golf.svg', hero:{eye:'Residential · Putting Greens', h:'Perfect your short game', acc:'at home.', p:'Clean, low-maintenance, long-lasting greens that roll true.', img:I.putt2},
  intro:'Your drives are long and true, but your short game puts a hurt on your handicap. Why not practice at home? A synthetic putting green looks and plays like a professional course without the constant maintenance.',
  list:['Rounded quartz-sand infill for realistic play','Advanced backing for exceptional drainage','Perfect for all climates','ADA compliant','No water, chemicals or fertilizer','Extremely jealous golf buddies'], rel:['putting-greens','residential-landscape','rooftops']},
 'residential-fields':{nav:'Fields', parent:'residential-athletics', icon:'soccer-pitch.svg', hero:{eye:'Residential · Fields', h:'The perfect', acc:'home field advantage.', p:'Everyday training starts here.', img:I.b},
  intro:'Whether it\'s for training, casual play or entertaining, a residential turf field delivers professional-quality performance in your own backyard — reliable, year-round play space that looks and performs like new.',
  list:['Multi-sport layouts customized to you','Highest quality shock padding','Footwear and clothes stay clean','No water, no mowing','Quick drainage','Non-toxic infill','Year-round play'], rel:['sport-fields','residential-courts','residential-putting']},
 'residential-tennis':{nav:'Tennis', parent:'residential-athletics', icon:'ball-games.svg', hero:{eye:'Residential · Tennis', h:'Synthetic grass', acc:'tennis courts.', p:'The comfort of natural play without the maintenance.', img:I.tennis2},
  intro:'Designed for every kind of weather, our sand-filled courts deliver a consistent surface for smooth movement — softer and safer, with the playability of natural grass. Every court is tailored to the homeowner.',
  list:['Consistent surface in all weather','Softer on joints','Tailored to your space'], rel:['tennis-courts','residential-courts','residential-fields']},
 'residential-courts':{nav:'Sports Courts', parent:'residential-athletics', icon:'ball-games.svg', hero:{eye:'Residential · Sport Courts', h:'Start building your', acc:'court of dreams.', p:'Multi-sport courts built for families and designed for every generation.', img:I.a},
  intro:'Turn everyday outdoor space into a high-energy play zone where kids, teens and adults compete, train and unwind together. Choose colors, game lines, accessories and our adjustable net system.',
  list:['Basketball','Pickleball','Volleyball','Hockey','Four Square','Shuffleboard','Custom games'], rel:['courts','residential-fields','residential-tennis']},

 /* ---------- Other ---------- */
 products:{nav:'Products', hero:{eye:'Products', h:'Versatile, realistic,', acc:'sustainable.', p:'The most realistic artificial turf on the market — designed and made for peak performance and durability.', img:I.rland2}, products:true},
 'our-work':{nav:'Our Work', hero:{eye:'Our Work', h:'From concept', acc:'to completion.', p:'Every project reflects our commitment to exceptional quality, performance and visual impact.', img:I.a}, work:true},
 financing:{nav:'Financing', hero:{eye:'Financing', h:'0% financing', acc:'available.', p:'No interest if paid in full within 12 months.', img:I.rland1},
  intro:'Special financing is available for 12 months through the Wells Fargo Outdoor Solutions credit card. No interest if paid in full within 12 months.',
  list:['12 months special financing','Apply in minutes','Use it for turf, playgrounds and installs'],
  fine:'The Wells Fargo Outdoor Solutions credit card is issued by Wells Fargo Bank, N.A., an Equal Housing Lender. Special terms apply to qualifying purchases charged with approved credit. Minimum monthly payments are required during the promotional period.'},
 about:{nav:'About', parent:'about', hero:{eye:'About Turf Tek USA', h:'Installers, engineers', acc:'& all-around experts.', p:'Installing artificial grass across the Tri-State since 2010.', img:I.c},
  intro:'We distinguish ourselves with the highest quality 100% American-made products, superior customer service and our proprietary engineered installation system. We directly employ all of our estimators and installers — you will never have a subcontractor crew on your job.',
  list:WHY, feat:[['Built for the Northeast','Our custom-engineered landscaping turf is designed to withstand the Northeast\'s climate swings while looking like it belongs here.',I.d]],
  quote:['We are absolutely thrilled with our new Turf Tek backyard! We contemplated the switch to turf for over a year and only wish we had done it sooner.','Turf Tek customer'], rel:['testimonials','our-work','careers']},
 'long-island':{nav:'Long Island, NY', parent:'about', area:true, hero:{eye:'Service Area', h:'Artificial turf installation', acc:'on Long Island.', p:'Your one-stop solution for premium-quality turf that stays lush in every season.', img:I.rland1},
  intro:'From the North Shore to the Hamptons, we work closely with Long Island homeowners and businesses to design and install turf that stays green in every weather condition and season. Our showroom is in Commack.', list:WHY, rel:['westchester','fairfield','residential']},
 westchester:{nav:'Westchester, NY', parent:'about', area:true, hero:{eye:'Service Area', h:'Artificial turf installation', acc:'in Westchester.', p:'Enjoy a well-manicured lawn year-round without the maintenance hassle.', img:I.f},
  intro:'Turf Tek USA is your go-to for premium-quality artificial turf installation in Westchester, NY — residential lawns, pet areas, putting greens and commercial landscapes.', list:WHY, rel:['long-island','fairfield','commercial']},
 fairfield:{nav:'Fairfield County, CT', parent:'about', area:true, hero:{eye:'Service Area', h:'Artificial turf installation', acc:'in Fairfield County.', p:'A lush, vibrant lawn is the ingredient that ties it all together.', img:I.g},
  intro:'A cozy outdoor environment adds the finishing touch to your commercial or residential property. We bring the same crews and the same standards to Fairfield County, CT.', list:WHY, rel:['long-island','westchester','residential']},
 testimonials:{nav:'Testimonials', parent:'about', hero:{eye:'Testimonials', h:'What our', acc:'customers say.', p:'Since 2010 we\'ve built relationships with homeowners, architects, designers, municipalities and schools.', img:I.rland2}, reviews:true},
 faqs:{nav:'FAQs', parent:'about', hero:{eye:'FAQs', h:'Artificial grass,', acc:'answered.', p:'The questions we hear most — answered by the people who install it.', img:I.h}, faq:true},
 blog:{nav:'Blog', parent:'about', hero:{eye:'Blog', h:'Artificial grass', acc:'blog.', p:'Guides and insights from our installers.', img:I.b}, blog:true},
 careers:{nav:'Careers', parent:'about', hero:{eye:'Careers', h:'Grow with', acc:'Turf Tek USA.', p:'Artificial turf is one of the fastest-growing sectors in landscaping — and we\'re at the forefront.', img:I.e},
  intro:'Working at Turf Tek USA is more than a job — it\'s a chance to grow in a fast-moving industry with a trusted name. Employees get comprehensive training, career advancement and a collaborative culture built on integrity.',
  list:['Installation Specialist — Synthetic Turf/Carpet & Playground','Comprehensive training','Career advancement','Collaborative, integrity-first culture'], rel:['about','testimonials','contact']},
 contact:{nav:'Contact Us', hero:{eye:'Contact', h:'Get a', acc:'free estimate.', p:'Tell us about your project and an estimator will reach out.', img:I.home}, contact:true}
};

const PRODUCTS = [
 ['Natural Turf','Landscape','Lush, realistic landscape turf for lawns and common areas.'],
 ['Versa Turf','Landscape','Multi-use turf for moderate to high traffic.'],
 ['Pet & Play Turf','Landscape','Tough, easy-clean turf for pets and play areas.'],
 ['Pro Putt Turf','Athletic','True-rolling putting surface for greens and bocce.'],
 ['Short Game Elite Turf','Athletic','Holds chips and pitches like a real green.'],
 ['Sport XT Turf','Athletic','High-traffic athletic and play surface.'],
 ['Playground Extreme Turf','Athletic','Playground safety surfacing turf.'],
 ['Tennis Turf','Athletic','Sand-filled turf for consistent tennis play.']
];

const WORK = [
 ['Apartment Complex Amenities','Pickleball court, bocce court with turf, yoga area, lawns and a dog park.',I.a],
 ['Baseball Fields','Infield and outfield turf for all-weather play.',I.base1],
 ['Residential Landscape','A full backyard lawn that stays green all year.',I.rland1],
 ['Residential Field','A backyard multi-sport field for everyday training.',I.b],
 ['Residential Putting Green','A home green that rolls true.',I.putt2],
 ['Commercial Multi-Sport Field','A durable field for school and community use.',I.e]
];

const REVIEWS = [
 ['What an amazing experience. The price was perfect and Todd went through the whole process from start to finish. The work crew were amazing, making sure every detail was taken care of.','Verified customer review'],
 ['It\'s rare to find a provider as professional as Turf Tek. They were precise with their estimate, implemented my design flawlessly, and made the entire process seamless and easy.','Verified customer review'],
 ['The whole process, from quote to install, was easy and went smoothly. Everyone was so nice and professional and the communication was fantastic.','Verified customer review'],
 ['Excellent product, and a wonderful team from sales right through installation. It looks as good today as it did the day it was installed.','Verified customer review'],
 ['If you want to invest in artificial turf do not go any further than Turf Tek USA. They send a crew who has been installing for years.','Verified customer review'],
 ['We have worked with Bill for over 4 years and him and his teams have always delivered the best and on time.','Verified customer review']
];

const FAQ = [
 ['So, this is just AstroTurf, right?','No! Synthetic grass has evolved enormously since the Houston Astrodome. Five decades of advances in materials and construction have created products that are safer, softer and far more realistic.'],
 ['What\'s the grass made of?','Turf Tek is an official dealer of premium synthetic grass made from polyolefin, a combination of polypropylene and polyethylene. The grass, infill and backing are 100% recyclable.'],
 ['Have your products been tested for safety and environmental hazards?','Absolutely. All of our products meet or exceed federal safety standards and are free of lead and heavy metals. Our playground grass and SofFill™ combination are certified by IPEMA.'],
 ['Is synthetic grass flammable?','No. Lit cigarettes or burning coals will melt the fibers where they land, but the grass is not flammable — and melted spots can be clipped away.'],
 ['Can Turf Tek increase the value of my home?','Yes. Some estimates say replacing brown sod with lush synthetic grass can add 10% or more to residential or commercial property values.'],
 ['What does sunlight do to your products?','Our blades are engineered to resist fading and other sun damage.'],
 ['Do you offer a warranty?','Of course. Our products carry a 2-year transferable manufacturer\'s warranty, plus a 2-year installation warranty.'],
 ['What can you tell me about drainage?','This is not a typo: Turf Tek products drain at a rate of 400 inches per hour.'],
 ['Are your products pet friendly?','Yes. Pet urine won\'t discolor our blades, cleanup is easy, and nothing in our products will harm your pets.'],
 ['How much does it cost?','Turf is priced by the square foot and installation varies with each project. Upfront cost may be slightly more than re-sodding, but you eliminate watering, fertilizing, mowing and aerating for years.'],
 ['What infill do you use?','SofFill™, an antimicrobial acrylic-coated silica. No crumb-rubber off-gassing, odor or dust, and no lead or heavy metals.'],
 ['How do I remove debris?','A leaf blower or a garden hose does the trick.'],
 ['Why Turf Tek?','High-quality products, professional design and installation, superior customer service, and financing options to make it work for you.']
];

const BLOG = ['The Hamptons Homeowner\'s Guide to Artificial Turf: Cost, Quality, and What to Expect','How to Plan a Commercial Artificial Turf Installation for Schools, Parks, and Municipalities','How to Build a Bocce Ball Court With Artificial Turf (And Why It\'s Worth It)','Artificial Turf vs. Pavers vs. Sod: A Side-by-Side Cost Breakdown for Northeast Homeowners','Artificial Turf for Tennis Courts in Connecticut and Westchester: What You Need to Know','Artificial Turf for Backyard Sport Courts: Installation Guide for Long Island Homeowners','Artificial Turf Around Pool Areas: What Long Island and Westchester Homeowners Need to Know','Is There a Difference Between Indoor and Outdoor Artificial Turf?','How to Maintain Safe Artificial Turf for Athletic Performance'];
