/** Original PARK editorial content; research and attribution are recorded in research/industry-reference-refresh.json. */
export type IndustryStory = {
  slug: string;
  eyebrow: string;
  title: [string, string];
  intro: string;
  homeSummary: string;
  heroImage: string;
  heroAlt: string;
  overview: {eyebrow: string; title: string; body: string};
  benefits: {title: string; text: string; icon: string}[];
  applications: {title: string; text: string; productSlug: string; image: string; imageAlt: string}[];
  material: {title: string; text: string; bullets: string[]; image: string; imageAlt: string};
  faq: {question: string; answer: string}[];
  brief: string[];
};

export const industryStories: Record<string, IndustryStory> = {
  "sports-leisure": {
    "slug": "sports-leisure",
    "eyebrow": "SPORTS, LEISURE & EARLY CHILDHOOD",
    "title": [
      "Made for movement.",
      "Shaped for play."
    ],
    "intro": "From training equipment to early learning, PARK shapes lightweight foam components around grip, fit and everyday use. Bring your activity, age group and product idea into the design.",
    "homeSummary": "Lightweight foam forms for training, imaginative play and everyday movement, shaped around the people who use them.",
    "heroImage": "/images/generated/factory-childhood.webp",
    "heroAlt": "AI factory illustration of moulded play forms being inspected at a foam finishing workstation",
    "overview": {
      "eyebrow": "DESIGNED AROUND PEOPLE",
      "title": "Good ideas start with how they feel.",
      "body": "A play block needs an inviting shape. A helmet liner needs precise interfaces. We bring the material, proportions and assembly details into one brief, so each component has a clear job."
    },
    "benefits": [
      {
        "title": "Easy to move",
        "text": "Low component weight helps create equipment and play forms that are easier to lift, arrange and store.",
        "icon": "leaf"
      },
      {
        "title": "Resilient by design",
        "text": "EPP absorbs energy and recovers after compression; density and geometry shape the response.",
        "icon": "shield"
      },
      {
        "title": "Room for imagination",
        "text": "Combine rounded forms, grip features and connecting details around the intended activity.",
        "icon": "toy"
      }
    ],
    "applications": [
      {
        "title": "Modular play forms",
        "text": "Build a family of shapes around stacking, movement and imaginative play, with connections suited to the age group.",
        "productSlug": "modular-foam-play-forms",
        "image": "/images/generated/factory-childhood.webp",
        "imageAlt": "AI factory illustration of moulded play forms being inspected at a foam finishing workstation"
      },
      {
        "title": "Helmet liners",
        "text": "Develop liner geometry around the shell, head profile and ventilation layout, with testing of the complete helmet.",
        "productSlug": "sports-helmet-foam-liners",
        "image": "/images/generated/factory-childhood.webp",
        "imageAlt": "AI factory illustration of moulded play forms being inspected at a foam finishing workstation"
      },
      {
        "title": "Child-seat components",
        "text": "Shape cushioning inserts around the seat shell, contact surfaces and attachment layout.",
        "productSlug": "child-seat-foam-cores",
        "image": "/images/generated/factory-childhood.webp",
        "imageAlt": "AI factory illustration of moulded play forms being inspected at a foam finishing workstation"
      },
      {
        "title": "Footwear support forms",
        "text": "Match left and right profiles, heel depth and arch contours to the footwear construction.",
        "productSlug": "foam-insole-components",
        "image": "/images/generated/factory-foam-finishing.webp",
        "imageAlt": "AI factory illustration of cellular foam sheets and shaped blanks at a finishing workstation"
      }
    ],
    "material": {
      "title": "Small beads. Useful design freedom.",
      "text": "EPP beads fuse into a lightweight cellular component. Choose the grade and moulded density around the feel, loading and service life your product needs.",
      "bullets": [
        "Define contact areas and edge details.",
        "Compare representative shapes and densities.",
        "Plan cleaning and repeated-use checks."
      ],
      "image": "/images/generated/epp-material-closeup.webp",
      "imageAlt": "Close view of a charcoal bead-foam component and loose expanded beads"
    },
    "faq": [
      {
        "question": "Can one material suit every age group?",
        "answer": "Each product needs its own brief. Start with the intended users, accessible features and foreseeable use, then set the finished-product safety assessment."
      },
      {
        "question": "Can the shape and finish be customised?",
        "answer": "Share drawings, colour direction and the surfaces people will touch. We can discuss these alongside moulding, assembly and inspection needs."
      },
      {
        "question": "How should cleaning be specified?",
        "answer": "Name the cleaning agent, temperature and frequency. Evaluate representative parts for appearance, fit and function after the planned cleaning cycle."
      }
    ],
    "brief": [
      "Intended activity and user age group",
      "Dimensions, interfaces and preferred finish",
      "Loads, cleaning and product test requirements",
      "Expected quantities and launch schedule"
    ]
  },
  "logistics-handling": {
    "slug": "logistics-handling",
    "eyebrow": "LOGISTICS & MATERIAL HANDLING",
    "title": [
      "Protection that fits.",
      "Handling that flows."
    ],
    "intro": "PARK develops packaging around the way goods move: into storage, across the delivery route and back for another cycle. Give every product a defined place and every operator clear access.",
    "homeSummary": "Fitted cushioning and reusable containers that organise goods, simplify handling and protect products through the delivery cycle.",
    "heroImage": "/images/generated/factory-logistics.webp",
    "heroAlt": "AI factory illustration of reusable foam containers and fitted trays beside a moulding line",
    "overview": {
      "eyebrow": "THINK THROUGH THE JOURNEY",
      "title": "Design the pack around the process.",
      "body": "Start at the packing station. Follow the load through lifting, stacking, unloading and empty returns. The best layout balances product protection with usable space and the tasks people perform each day."
    },
    "benefits": [
      {
        "title": "Protection where it matters",
        "text": "Shaped cushioning locates vulnerable parts and manages contact within the pack.",
        "icon": "shield"
      },
      {
        "title": "Less handling weight",
        "text": "Cellular foam brings protection and insulation without the mass of a solid component.",
        "icon": "leaf"
      },
      {
        "title": "Ready for the return journey",
        "text": "Reusable formats work around agreed cleaning, inspection and collection routines.",
        "icon": "warehouse"
      }
    ],
    "applications": [
      {
        "title": "Returnable containers",
        "text": "Organise components for repeat journeys, with accessible handholds and a layout matched to loading stations.",
        "productSlug": "reusable-industrial-containers",
        "image": "/images/generated/factory-logistics.webp",
        "imageAlt": "AI factory illustration of reusable foam containers and fitted trays beside a moulding line"
      },
      {
        "title": "Custom cushioning",
        "text": "Locate delicate parts with shaped pockets, allowing removal without catching connectors or finished surfaces.",
        "productSlug": "custom-cushioning-foams",
        "image": "/images/generated/factory-foam-finishing.webp",
        "imageAlt": "AI factory illustration of cellular foam sheets and shaped blanks at a finishing workstation"
      },
      {
        "title": "Insulated transport boxes",
        "text": "Coordinate the box, lid, payload and coolant around the route's time and temperature profile.",
        "productSlug": "polystyrene-insulated-boxes",
        "image": "/images/generated/factory-logistics.webp",
        "imageAlt": "AI factory illustration of reusable foam containers and fitted trays beside a moulding line"
      },
      {
        "title": "Pallet formats",
        "text": "Match the footprint, fork access and load support to warehouse equipment and storage arrangements.",
        "productSlug": "plastic-pallets",
        "image": "/images/generated/factory-polymer-inspection.webp",
        "imageAlt": "AI factory illustration of foam packaging and rigid polymer components being dimensionally checked"
      }
    ],
    "material": {
      "title": "Choose the material for the whole cycle.",
      "text": "EPP supports lightweight, resilient and insulated reusable packaging. Choose the moulded density, wall thickness and shape around the complete pack and its expected use.",
      "bullets": [
        "Map payload and contact points.",
        "Include stacking and transport conditions.",
        "Plan collection before selecting reuse targets."
      ],
      "image": "/images/generated/epp-material-closeup.webp",
      "imageAlt": "Moulded bead-foam sample showing its fused cellular structure"
    },
    "faq": [
      {
        "question": "What do you need to design an insert?",
        "answer": "Send the product drawing or sample, weight, fragile areas and removal method. Add the outer container dimensions and any handling restrictions."
      },
      {
        "question": "How long will an insulated box hold temperature?",
        "answer": "The complete pack determines that result. Specify the payload, coolant, journey duration and ambient conditions, then validate the proposed configuration."
      },
      {
        "question": "How many times can packaging be reused?",
        "answer": "Set a target around the actual route. Track damage, cleaning and missing components, with clear inspection and retirement criteria."
      }
    ],
    "brief": [
      "Product dimensions, mass and fragile areas",
      "Handling route, stacking and pallet footprint",
      "Cleaning, returns and temperature requirements",
      "Annual volume and target packing time"
    ]
  },
  "hvac": {
    "slug": "hvac",
    "eyebrow": "HVAC",
    "title": [
      "Insulation, integrated.",
      "Built around airflow."
    ],
    "intro": "PARK shapes foam housings, ducts and insulation around heating, ventilation and cooling assemblies. Connect thermal performance with installation space, component support and the access needed for maintenance.",
    "homeSummary": "Moulded housings, air ducts and insulation that connect thermal performance with precise assembly fit and practical maintenance access.",
    "heroImage": "/images/generated/factory-hvac.webp",
    "heroAlt": "AI factory illustration of foam insulation housings and ducts beside guarded moulding equipment",
    "overview": {
      "eyebrow": "ONE COMPONENT. SEVERAL FUNCTIONS.",
      "title": "Make every interface count.",
      "body": "A housing can do more than surround equipment. Develop air paths, insulation zones and locating features together, then check the design against seals, connections and the sequence used to assemble and service it."
    },
    "benefits": [
      {
        "title": "Thermal separation",
        "text": "Cellular foam slows heat transfer through an insulating part, with joints and thickness considered together.",
        "icon": "snow"
      },
      {
        "title": "Lightweight integration",
        "text": "Moulded recesses and passages can bring several component interfaces into one foam form.",
        "icon": "layers"
      },
      {
        "title": "Noise and vibration focus",
        "text": "Design contact points around equipment behaviour, then measure acoustic performance in the working assembly.",
        "icon": "wind"
      }
    ],
    "applications": [
      {
        "title": "Air ducts",
        "text": "Shape transitions and bends around airflow requirements, connection sizes and the space available inside the unit.",
        "productSlug": "moulded-air-ducts",
        "image": "/images/generated/factory-hvac.webp",
        "imageAlt": "AI factory illustration of foam insulation housings and ducts beside guarded moulding equipment"
      },
      {
        "title": "Insulating housings",
        "text": "Bring insulation zones and component locations together while preserving seals and service access.",
        "productSlug": "hvac-insulation-housings",
        "image": "/images/generated/factory-hvac.webp",
        "imageAlt": "AI factory illustration of foam insulation housings and ducts beside guarded moulding equipment"
      },
      {
        "title": "Heat-pump covers",
        "text": "Develop fitted cover sections around the unit envelope, connection points and removable panels.",
        "productSlug": "heat-pump-covers",
        "image": "/images/generated/factory-hvac.webp",
        "imageAlt": "AI factory illustration of foam insulation housings and ducts beside guarded moulding equipment"
      },
      {
        "title": "Hydraulic insulation",
        "text": "Fit insulation around manifolds and connections, leaving practical access for installation and adjustment.",
        "productSlug": "hydraulic-manifold-insulation",
        "image": "/images/generated/factory-hvac.webp",
        "imageAlt": "AI factory illustration of foam insulation housings and ducts beside guarded moulding equipment"
      }
    ],
    "material": {
      "title": "Specify EPP around the operating conditions.",
      "text": "EPP combines low weight, resilience and insulation. Grade, density and geometry should follow the equipment's temperatures, mounting loads and moisture exposure.",
      "bullets": [
        "Review seams, seals and drainage.",
        "Reserve space for tools and servicing.",
        "Agree thermal and acoustic acceptance tests."
      ],
      "image": "/images/generated/epp-material-closeup.webp",
      "imageAlt": "Close-up of a moulded charcoal EPP section with its bead structure visible"
    },
    "faq": [
      {
        "question": "Can insulation and air management share one part?",
        "answer": "Yes, the design can combine these functions. Begin with the air path and interfaces, then evaluate flow, sealing and thermal behaviour together."
      },
      {
        "question": "Does low water absorption prevent condensation?",
        "answer": "Condensation depends on surface temperatures and humidity. Review the complete insulation and sealing layout, including joints and drainage."
      },
      {
        "question": "Which material grade should we specify?",
        "answer": "Share operating temperatures, exposure duration and the component's loads. Add any required fire performance or other application qualifications to the selection brief."
      }
    ],
    "brief": [
      "Assembly drawing and available installation space",
      "Airflow, thermal and acoustic targets",
      "Operating conditions, seals and service access",
      "Volumes, critical dimensions and qualification plan"
    ]
  },
  "mobility": {
    "slug": "mobility",
    "eyebrow": "AUTOMOTIVE",
    "title": [
      "Less weight.",
      "More purpose."
    ],
    "intro": "PARK develops moulded foam components around the vehicle assembly and its production journey. From energy-management forms to fitted storage, give each feature a clear function within the available space.",
    "homeSummary": "Lightweight foam components for energy management, fitted storage and production handling, developed around each vehicle assembly's functional requirements.",
    "heroImage": "/images/generated/factory-automotive.webp",
    "heroAlt": "AI factory illustration of automotive foam supports at a component inspection fixture",
    "overview": {
      "eyebrow": "DESIGNED INTO THE ASSEMBLY",
      "title": "A lighter part starts with a clear job.",
      "body": "Bring contact surfaces, load paths and installation order into the first drawing review. Shape the component around neighbouring parts, then build the evaluation plan around the conditions it will encounter in service."
    },
    "benefits": [
      {
        "title": "Low component weight",
        "text": "Expanded foam creates useful volume with less solid polymer, supporting assembly weight targets.",
        "icon": "leaf"
      },
      {
        "title": "Energy-management options",
        "text": "EPP's compression response supports energy-absorbing designs; the installed geometry determines how the part performs.",
        "icon": "shield"
      },
      {
        "title": "Organised integration",
        "text": "Moulded pockets and locating details position tools, accessories or components within a defined footprint.",
        "icon": "layers"
      }
    ],
    "applications": [
      {
        "title": "Energy absorbers",
        "text": "Develop foam shapes around defined load cases and their position within the complete vehicle assembly.",
        "productSlug": "vehicle-energy-absorbers",
        "image": "/images/generated/factory-automotive.webp",
        "imageAlt": "AI factory illustration of automotive foam supports at a component inspection fixture"
      },
      {
        "title": "Floor components",
        "text": "Fit floor profiles around neighbouring structures, supported loads and assembly clearances.",
        "productSlug": "vehicle-floor-panels",
        "image": "/images/generated/factory-automotive.webp",
        "imageAlt": "AI factory illustration of automotive foam supports at a component inspection fixture"
      },
      {
        "title": "Storage organisers",
        "text": "Give tools and loose equipment dedicated locations, with retention features and finger access for removal.",
        "productSlug": "vehicle-storage-organizers",
        "image": "/images/generated/factory-automotive.webp",
        "imageAlt": "AI factory illustration of automotive foam supports at a component inspection fixture"
      },
      {
        "title": "Parts shuttle trays",
        "text": "Protect components between production stages with repeatable placement and access for loading and unloading.",
        "productSlug": "vehicle-parts-shuttle-trays",
        "image": "/images/generated/factory-polymer-inspection.webp",
        "imageAlt": "AI factory illustration of foam packaging and rigid polymer components being dimensionally checked"
      }
    ],
    "material": {
      "title": "Evaluate the component in its real environment.",
      "text": "EPP offers resilience and design freedom in a lightweight form. Match the grade and density to loading, temperature and the interfaces shared with the surrounding assembly.",
      "bullets": [
        "Identify datums and retention features.",
        "Include repeated loading and vibration.",
        "Plan separation of inserts at end of life."
      ],
      "image": "/images/generated/epp-material-closeup.webp",
      "imageAlt": "Charcoal moulded EPP sample and expanded beads"
    },
    "faq": [
      {
        "question": "Can a foam part replace a heavier component?",
        "answer": "Start with the complete set of functions. Compare geometry, attachments and performance in the assembly before confirming a replacement."
      },
      {
        "question": "How is an impact-related part approved?",
        "answer": "Agree the load cases, test method and acceptance criteria with the vehicle programme. Qualification depends on the finished assembly and its requirements."
      },
      {
        "question": "What should accompany a sample request?",
        "answer": "Provide drawings, mating-part information, operating conditions and the question the sample must answer. Include programme volumes and the intended approval milestones."
      }
    ],
    "brief": [
      "Component drawings and mating-part interfaces",
      "Load cases, temperatures and vibration exposure",
      "Programme requirements and acceptance criteria",
      "Production volumes and approval milestones"
    ]
  }
};
