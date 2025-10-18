import { resolveProductImage } from "../utils/assetResolver.js";

const rawProducts = [
  {
    id: 1,
    name: "Graphic T-Shirt",
    category: "Fashion",
    image: "src/assets/Graphic T-Shirt.webp",
    price: 21.99,
    discountPrice: 19.0,
    description:
      "Eye-catching designs made with soft cotton fabric. Perfect for casual wear or layering. Breathable material keeps you cool while adding personality to your everyday outfit.",
  },
  {
    id: 2,
    name: "Silicone Kitchen Utensils",
    category: "Home",
    image: "src/assets/Silicone Kitchen Utensils'.webp",
    price: 25.99,
    description:
      "Heat-resistant and non-stick safe tools. Includes spatulas, tongs, and spoons. Durable, dishwasher-safe, and gentle on cookware. A must-have set for modern kitchens.",
  },
  {
    id: 3,
    name: "Silicone Watch Band",
    category: "Accessories",
    image: "src/assets/Silicone Watch Band.webp",
    price: 12.99,
    description:
      "Comfortable silicone replacement watch band. Compatible with popular smartwatch models. Waterproof and sweat-resistant for active lifestyles.",
  },
  {
    id: 4,
    name: "Yoga Mat",
    category: "Fitness",
    image: "src/assets/yoga mat.webp",
    price: 29.99,
    discountPrice: 26.19,
    description:
      "Enhance your yoga practice with this durable, non-slip yoga mat, designed for comfort and stability during all types of workouts. Lightweight and easy to carry.",
  },
  {
    id: 5,
    name: "Winter Coat",
    category: "Fashion",
    image: "src/assets/Winter Coat.webp",
    price: 129.99,
    discountPrice: 119.99,
    description: "Warm and stylish for cold weather.",
  },
  {
    id: 6,
    name: "Coffee Maker",
    category: "Home",
    image: "src/assets/Coffee Maker.webp",
    price: 69.99,
    discountPrice: 59.99,
    description:
      "Brew fresh and delicious coffee in minutes with this easy-to-use coffee maker, a must-have for coffee enthusiasts. Compact design fits any kitchen space.",
  },
  {
    id: 7,
    name: "Casual Sneakers",
    category: "Fashion",
    image: "src/assets/Casual Sneakers.webp",
    price: 59.99,

    description: "Everyday shoes with comfort and style.",
  },
  {
    id: 8,
    name: "Building Blocks Set",
    category: "Toys",
    image: "src/assets/Building Blocks Set.webp",
    price: 29.99,
    discountPrice: 20.99,
    description:
      "Creative building blocks for ages 3+. Develops spatial awareness, fine motor skills, and imagination. Compatible with major building block brands.",
  },
  {
    id: 9,
    name: "Weighted Blanket",
    category: "Home",
    image: "src/assets/Weighted Blanket.webp",
    price: 79.99,
    description:
      "Promote restful sleep with calming pressure. Evenly distributed weight helps reduce anxiety and improve sleep quality. Soft, breathable cover for year-round comfort.",
  },
  {
    id: 10,
    name: "Mini Fridge",
    category: "Home",
    image: "src/assets/Mini Fridge.webp",
    price: 109.99,
    description:
      "Compact cooling for bedrooms or dorm rooms. Energy-efficient with adjustable temperature settings, removable shelves, and quiet operation. Great for drinks, snacks, and skincare products.",
  },
  {
    id: 11,
    name: "Kettlebell",
    category: "Fitness",
    image: "src/assets/Kettlebell.webp",
    price: 35.99,
    discountPrice: 32.0,
    description:
      "Versatile tool for strength and endurance training. Ergonomic handle and balanced weight allow dynamic movements including swings, squats, and presses for full-body workouts.",
  },
  {
    id: 12,
    name: "Vintage Keychain",
    category: "Accessories",
    image: "src/assets/Vintage Keychain.webp",
    price: 9.99,
    discountPrice: 8.99,
    description:
      "Collectible vintage-style keychain with intricate design. Solid metal construction with antique finish. Makes a great gift or personal accessory.",
  },
  {
    id: 13,
    name: "Core Sliders",
    category: "Fitness",
    image: "src/assets/Core Sliders.webp",
    price: 14.99,
    description:
      "Improve core strength and balance training. Dual-sided for use on carpet or hardwood. Great for low-impact, high-intensity workouts targeting abs, legs, and glutes.",
  },
  {
    id: 14,
    name: "Graphic Hoodie",
    category: "Fitness",
    image: "src/assets/Graphic Hoodie.webp",
    price: 25.0,
    description: "Trendy design with warm fleece inside.",
  },
  {
    id: 15,
    name: "Compact Power Strip",
    category: "Electronics",
    image: "src/assets/Compact Power Strip.webp",
    price: 21.99,
    description:
      "Multiple outlets and USB ports in one device. Surge protection included. Compact design fits on desks or travel bags for powering devices conveniently.",
  },
  {
    id: 16,
    name: "Bluetooth Speaker",
    category: "Electronics",
    image: "src/assets/Bluetooth Speaker.webp",
    price: 59.99,
    discountPrice: 52.99,
    description:
      "Enjoy rich bass and clear sound with this portable Bluetooth speaker, perfect for any occasion. Long-lasting battery and compact design for easy portability.",
  },
  {
    id: 17,
    name: "Smart Light Bulb",
    category: "Home",
    image: "src/assets/Smart Light Bulb.webp",
    price: 19.99,
    description: "Control brightness and color via app or voice.",
  },
  {
    id: 18,
    name: "Windbreaker Jacket",
    category: "Fashion",
    image: "src/assets/Windbreaker Jacket.webp",
    price: 54.99,
    description:
      "Lightweight protection from wind and rain. Stylish design with breathable lining and zippered pockets. Great for outdoor activities or casual wear.",
  },
  {
    id: 19,
    name: "Resistance Bands",
    category: "Fitness",
    image: "src/assets/Resistance Bands.webp",
    price: 15.99,
    discountPrice: 9.99,
    description:
      "Great for strength and flexibility training. Durable and versatile, these bands are perfect for a variety of exercises, from stretching to resistance workouts.",
  },
  {
    id: 20,
    name: "Digital Alarm Clock",
    category: "Home",
    image: "src/assets/Digital Alarm Clock.webp",
    price: 19.99,
    discountPrice: 17.25,
    description:
      "Wake up on time with this sleek, LED alarm clock. Features adjustable brightness, snooze function, and USB charging port to power devices while you sleep.",
  },
  {
    id: 21,
    name: "Jogger Pants",
    category: "Fashion",
    image: "src/assets/Jogger Pants.webp",
    price: 34.99,
    description:
      "Stylish comfort for workouts or casual wear. Soft, stretchy fabric and elastic cuffs offer flexibility and mobility. Great for lounging, errands, or light exercise.",
  },
  {
    id: 22,
    name: "Designer Crossbody Bag",
    category: "Fashion",
    image: "src/assets/Designer Crossbody Bag.webp",
    price: 47.99,
    description:
      "Elegant and versatile crossbody bag for everyday use. Features premium vegan leather, adjustable strap, and multiple compartments for organization. Perfect blend of style and functionality for any occasion.",
  },
  {
    id: 23,
    name: "Educational Science Kit",
    category: "Toys",
    image: "src/assets/Educational Science Kit.webp",
    price: 24.99,
    discountPrice: 20.0,
    description:
      "Hands-on experiments for young scientists. Includes illustrated guide and all materials needed. Perfect introduction to basic scientific principles.",
  },
  {
    id: 24,
    name: "Hair Accessory Set",
    category: "Accessories",
    image: "src/assets/Hair Accessory Set.webp",
    price: 14.99,
    description:
      "Complete hair styling set with clips, bands, and pins. Variety of colors and styles for different looks. High-quality materials for durability.",
  },
  {
    id: 25,
    name: "Laptop Stand",
    category: "Electronics",
    image: "src/assets/Laptop Stand.webp",
    price: 29.99,
    description:
      "Improve your posture and work comfortably with this adjustable laptop stand, suitable for all devices. Lightweight and foldable for easy transport.",
  },
  {
    id: 26,
    name: "LED Desk Clock",
    category: "Home",
    image: "src/assets/LED Desk Clock.webp",
    price: 27.99,
    discountPrice: 22.25,
    description:
      "Digital time display with modern design. Includes temperature display, alarm, and night mode. Sleek for desks, bedside tables, or offices.",
  },
  {
    id: 27,
    name: "Magic Trick Set",
    category: "Toys",
    image: "src/assets/Magic Trick Set.webp",
    price: 23.99,
    description:
      "Learn amazing magic tricks with this complete beginner set. Includes magic wand, cards, and props for 25 different tricks. Illustrated instruction booklet included.",
  },
  {
    id: 28,
    name: "Travel Jewelry Case",
    category: "Accessories",
    image: "src/assets/Travel Jewelry Case.webp",
    price: 18.99,
    description:
      "Compact travel case for jewelry organization. Multiple compartments and soft lining protect your valuables. Zippered closure for secure storage during travel.",
  },
  {
    id: 29,
    name: "Vacuum Cleaner",
    category: "Home",
    image: "src/assets/Vacuum Cleaner.webp",
    price: 89.99,
    description:
      "Powerful suction for deep cleaning. This vacuum cleaner is designed to tackle dirt and debris on various surfaces, ensuring a spotless home.",
  },
  {
    id: 30,
    name: "Power Bank",
    category: "Electronics",
    image: "src/assets/Power Bank.webp",
    price: 34.99,
    discountPrice: 29.99,
    description: "Charge your devices on the go.",
  },
  {
    id: 31,
    name: "Foam Roller",
    category: "Fitness",
    image: "src/assets/Foam Roller.webp",
    price: 22.99,
    description:
      "Ideal for muscle recovery and massage. This foam roller helps relieve tension and improve flexibility, making it a must-have for fitness enthusiasts.",
  },
  {
    id: 32,
    name: "Blender",
    category: "Home",
    image: "src/assets/Blender.webp",
    price: 39.99,
    discountPrice: 30.0,
    description:
      "Create smoothies, sauces, and more with this powerful and versatile blender, perfect for any kitchen. Easy to clean and comes with multiple speed settings.",
  },
  {
    id: 33,
    name: "Smart Watch",
    category: "Electronics",
    image: "src/assets/smart watch.webp",
    price: 149.99,
    discountPrice: 129.99,
    description:
      "Stay connected and track your fitness goals with this sleek and versatile smartwatch, featuring a range of health monitoring features. Durable design for everyday use.",
  },
  {
    id: 34,
    name: "Fashion Sunglasses",
    category: "Accessories",
    image: "src/assets/Sunglasses.webp",
    price: 29.99,
    description:
      "Trendy sunglasses with UV400 protection. Lightweight frame with polarized lenses. Reduces glare while adding a stylish touch to your look.",
  },
  {
    id: 35,
    name: "Water Play Table",
    category: "Toys",
    image: "src/assets/Water Play Table.webp",
    price: 44.99,
    description:
      "Interactive water table for outdoor summer fun. Features water wheel, funnels, and floating toys. Develops sensory skills and scientific concepts.",
  },
  {
    id: 36,
    name: "Wooden Puzzle Set",
    category: "Toys",
    image: "src/assets/Wooden Puzzle Set.webp",
    price: 15.99,
    description:
      "Educational wooden puzzles with vibrant colors. Develops problem-solving skills and hand-eye coordination. Set of 5 different patterns.",
  },
  {
    id: 37,
    name: "Statement Earrings",
    category: "Accessories",
    image: "src/assets/Statement Earrings.webp",
    price: 22.99,
    description:
      "Bold and eye-catching statement earrings. Lightweight design despite their size. Perfect for adding a dramatic touch to any outfit.",
  },
  {
    id: 38,
    name: "LED Monitor Light Bar",
    category: "Electronics",
    image: "src/assets/LED Monitor Light Bar.webp",
    price: 33.99,
    description:
      "Enhance your workspace with eye-friendly lighting. Reduces screen glare and eye strain. USB-powered with adjustable brightness and color temperature for better focus.",
  },
  {
    id: 39,
    name: "Cookbook",
    category: "Books",
    image: "src/assets/Cookbook.webp",
    price: 14.99,
    description:
      "Explore a world of flavors with this comprehensive cookbook, filled with delicious recipes for every occasion. Includes step-by-step instructions and vibrant photographs.",
  },
  {
    id: 40,
    name: "Wireless Earbuds",
    category: "Electronics",
    image: "src/assets/Wireless Earbuds.webp",
    price: 69.99,
    discountPrice: 49.99,
    description: "Crystal-clear audio with compact design.",
  },
  {
    id: 41,
    name: "Kids Play Kitchen",
    category: "Toys",
    image: "src/assets/Kids Play Kitchen.webp",
    price: 59.99,
    discountPrice: 52.19,
    description:
      "Interactive play kitchen with realistic sounds and lights. Includes play food and utensils. Encourages imaginative role play and social skills.",
  },
  {
    id: 42,
    name: "Dollhouse with Furniture",
    category: "Toys",
    image: "src/assets/Dollhouse with Furniture.webp",
    price: 64.99,
    description:
      "Charming wooden dollhouse with complete furniture set. Three stories and multiple rooms for creative play. Perfect for imaginative storytelling.",
  },
  {
    id: 43,
    name: "Wireless Keyboard",
    category: "Electronics",
    image: "src/assets/Wireless Keyboard.webp",
    price: 39.99,
    description:
      "Compact, cable-free typing experience. Sleek design with responsive keys, long battery life, and multi-device compatibility for productivity at home, in the office, or on the go.",
  },
  {
    id: 44,
    name: "Wall Art Canvas",
    category: "Home",
    image: "src/assets/Wall Art Canvas.webp",
    price: 34.99,
    description: "Decorative canvas for living room or office.",
  },
  {
    id: 45,
    name: "Portable Projector",
    category: "Electronics",
    image: "src/assets/Portable Projector.webp",
    price: 129.99,
    discountPrice: 119.99,
    description:
      "Big screen entertainment from a compact device. Easy to carry, perfect for movie nights or presentations. Connects to smartphones, laptops, and consoles via HDMI or USB.",
  },
  {
    id: 46,
    name: "Designer Watch",
    category: "Accessories",
    image: "src/assets/Designer Watch.webp",
    price: 89.99,
    discountPrice: 85.79,
    description:
      "Elegant timepiece with stainless steel band. Water-resistant with precise quartz movement. Perfect blend of style and functionality for any occasion.",
  },
  {
    id: 47,
    name: "Leather Belt",
    category: "Accessories",
    image: "src/assets/Leather Belt.webp",
    price: 34.99,
    description:
      "Genuine leather belt with classic buckle. Durable construction for everyday wear. Available in black and brown to match any style.",
  },
  {
    id: 48,
    name: "Wall Clock",
    category: "Home",
    image: "src/assets/Wall Clock.webp",
    price: 22.99,
    description:
      "Modern design that suits any room. Silent sweep mechanism, easy-to-read numbers, and durable frame. Functional decor piece for kitchens, offices, or bedrooms.",
  },
  {
    id: 49,
    name: "Running Shoes",
    category: "Fashion",
    image: "src/assets/running shoes.webp",
    price: 89.99,
    discountPrice: 74.99,
    description:
      "Run in comfort and style with these lightweight running shoes, designed for long-distance performance and durability. Breathable material ensures maximum comfort during runs.",
  },
  {
    id: 50,
    name: "Stylish Backpack",
    category: "Accessories",
    image: "src/assets/Travel Backpack.webp",
    price: 49.99,
    description:
      "Modern backpack with laptop compartment and USB charging port. Water-resistant material and ergonomic design. Perfect for work, school, or travel.",
  },
  {
    id: 51,
    name: "Electric Kettle",
    category: "Fitness",
    image: "src/assets/Electric Kettle.webp",
    price: 12.5,
    description: "Boils water quickly and safely.",
  },
  {
    id: 52,
    name: "Tabletop Tripod",
    category: "Electronics",
    image: "src/assets/Tabletop Tripod.webp",
    price: 17.99,
    description:
      "Perfect for selfies, video calls, and vlogging. Compact, foldable, and compatible with phones and cameras. Offers stability and flexible angles for content creation.",
  },
  {
    id: 53,
    name: "Sports Ball Set",
    category: "Toys",
    image: "src/assets/Sports Ball Set.webp",
    price: 21.99,
    description:
      "Set of 4 sports balls for active play. Includes soccer ball, basketball, football, and playground ball. Promotes active lifestyle and coordination skills.",
  },
  {
    id: 54,
    name: "Musical Toy Piano",
    category: "Toys",
    image: "src/assets/Musical Toy Piano.webp",
    price: 27.99,
    description:
      "Colorful piano with multiple instrument sounds and demo songs. Helps develop musical skills and auditory recognition. Durable construction for years of play.",
  },
  {
    id: 55,
    name: "Compression Sleeves",
    category: "Fitness",
    image: "src/assets/Compression Sleeves.webp",
    price: 17.99,
    description: "Support your joints during workouts.",
  },
  {
    id: 56,
    name: "Wrist Weights",
    category: "Fitness",
    image: "src/assets/Wrist Weights.webp",
    price: 16.99,
    description:
      "Add intensity to your walking or workouts. Comfortable, adjustable straps. Ideal for cardio, running, or light resistance training to enhance calorie burn.",
  },
  {
    id: 57,
    name: "Phone Case Collection",
    category: "Accessories",
    image: "src/assets/Phone Case Collection.webp",
    price: 17.99,
    discountPrice: 16.99,
    description:
      "Stylish and protective phone cases for popular models. Drop-tested for impact resistance. Available in multiple designs to suit your personality.",
  },
  {
    id: 58,
    name: "Espresso Machine",
    category: "Home",
    image: "src/assets/Espresso Machine.webp",
    price: 179.99,
    discountPrice: 111.99,
    description: "Barista-quality espresso at home.",
  },
  {
    id: 59,
    name: "Designer Tie",
    category: "Accessories",
    image: "src/assets/Designer Tie.webp",
    price: 24.99,
    description:
      "Premium silk tie with modern pattern. Professional finish perfect for business or formal events. Comes in reusable storage case.",
  },
  {
    id: 60,
    name: "STEM Robotics Kit",
    category: "Toys",
    image: "src/assets/STEM Robotics Kit.webp",
    price: 49.99,
    description:
      "Build-your-own robot kit with programmable features. Introduces coding concepts through play. Includes detailed instructions for multiple projects.",
  },
  {
    id: 61,
    name: "Digital Drawing Tablet",
    category: "Electronics",
    image: "src/assets/Digital Drawing Tablet.webp",
    price: 99.99,
    description:
      "Express your creativity with precision. Pressure-sensitive pen, customizable buttons, and large drawing area for digital artists, designers, and hobbyists alike.",
  },
  {
    id: 62,
    name: "Wireless Mouse",
    category: "Electronics",
    image: "src/assets/Wireless Mouse.webp",
    price: 19.99,
    description:
      "Work efficiently with this ergonomic wireless mouse, designed for comfort and long battery life. Smooth tracking and responsive clicks for seamless navigation.",
  },
  {
    id: 63,
    name: "Leather Jacket",
    category: "Fashion",
    image: "src/assets/Leather Jacket.webp",
    price: 129.99,
    discountPrice: 120.0,
    description:
      "Classic leather jacket for cool weather. Stylish and durable, this jacket is a timeless addition to any wardrobe, perfect for casual or formal occasions.",
  },
  {
    id: 64,
    name: "Remote Control Car",
    category: "Toys",
    image: "src/assets/Remote Control Car.webp",
    price: 34.99,
    discountPrice: 30.0,
    description:
      "Fast and durable remote control race car. Realistic controls with long battery life. All-terrain wheels for indoor and outdoor play.",
  },
  {
    id: 65,
    name: "Wireless Charger",
    category: "Home",
    image: "src/assets/Wireless Charger.webp",
    price: 17.5,
    description: "Fast charging pad for smartphones.",
  },
  {
    id: 66,
    name: "Smart Doorbell",
    category: "Home",
    image: "src/assets/Smart Doorbell.webp",
    price: 89.99,
    discountPrice: 79.99,
    description:
      "Monitor visitors with HD video and alerts. Two-way audio, night vision, and motion detection keep your home secure and accessible from your smartphone.",
  },
  {
    id: 67,
    name: "Mirror with LED Lights",
    category: "Home",
    image: "src/assets/Mirror with LED Lights.webp",
    price: 49.99,
    description:
      "Bright, clear lighting for makeup or grooming. Adjustable brightness with touch controls and sleek frame. Ideal for dressing tables or bathroom vanities.",
  },
  {
    id: 68,
    name: "Scented Candles",
    category: "Home",
    image: "src/assets/Scented Candles.webp",
    price: 24.99,
    description:
      "Relaxing aromas for a cozy atmosphere. Made with natural soy wax and essential oils, ideal for meditation, sleep, or adding charm to any room.",
  },
  {
    id: 69,
    name: "Cycling Gloves",
    category: "Accessories",
    image: "src/assets/Cycling Gloves.webp",
    price: 15.99,
    description:
      "Padded gloves for cycling comfort. Breathable material with adjustable wrist closure. Reduces hand fatigue and improves grip during long rides.",
  },
  {
    id: 70,
    name: "Standing Desk",
    category: "Home",
    image: "src/assets/Standing Desk.webp",
    price: 199.99,
    discountPrice: 179.25,
    description: "Adjustable height for healthy posture.",
  },
  {
    id: 71,
    name: "Home Workout Poster",
    category: "Fitness",
    image: "src/assets/Home Workout Poster.webp",
    price: 9.99,
    description:
      "Visual guide to popular exercises. Colorful and easy-to-follow illustrations of bodyweight workouts. Perfect for home gyms, dorms, or fitness studios to stay motivated.",
  },
  {
    id: 72,
    name: "Board Game Collection",
    category: "Toys",
    image: "src/assets/Board Game Collection.webp",
    price: 32.99,
    description:
      "Family-friendly board game set with 4 classic games. Perfect for game nights and developing strategic thinking. Suitable for ages 6 and up.",
  },
  {
    id: 73,
    name: "Flannel Shirt",
    category: "Fashion",
    image: "src/assets/Flannel Shirt.webp",
    price: 35.99,
    description: "Comfortable and warm, perfect for fall.",
  },
  {
    id: 74,
    name: "Air Fryer",
    category: "Home",
    image: "src/assets/Air Fryer.webp",
    price: 99.99,
    description: "Healthier cooking with less oil.",
  },
  {
    id: 75,
    name: "Hiking Boots",
    category: "Fashion",
    image: "src/assets/Hiking Boots.webp",
    price: 89.99,
    discountPrice: 59.99,
    description:
      "Sturdy and comfortable for rugged adventures. Waterproof design, grippy soles, and ankle support make them ideal for long hikes and uneven terrains.",
  },
  {
    id: 76,
    name: "Denim Jeans",
    category: "Fashion",
    image: "src/assets/Denim Jeans.webp",
    price: 49.99,
    description: "Classic fit with modern style.",
  },
  {
    id: 77,
    name: "Bluetooth Headset",
    category: "Electronics",
    image: "src/assets/Bluetooth Headset.webp",
    price: 44.99,
    description:
      "Hands-free calls and music with clear sound quality. Lightweight and comfortable for extended use, featuring noise-cancellation and a long-lasting battery for uninterrupted listening all day long.",
  },
  {
    id: 78,
    name: "Bean Bag Chair",
    category: "Home",
    image: "src/assets/Bean Bag Chair.webp",
    price: 84.99,
    description:
      "Ultimate comfort for lounging and relaxation. Filled with soft memory foam, conforms to your body shape. Stylish addition to bedrooms, dorms, or gaming rooms.",
  },
  {
    id: 79,
    name: "Jump Rope",
    category: "Fitness",
    image: "src/assets/Jump Rope.webp",
    price: 9.99,
    description: "Cardio-friendly rope for all fitness levels.",
  },
  {
    id: 80,
    name: "Balance Ball",
    category: "Fitness",
    image: "src/assets/Balance Ball.webp",
    price: 29.99,
    description:
      "Improve core strength and stability exercises. Ideal for yoga, pilates, and rehabilitation. Anti-burst material ensures safety while enhancing posture, balance, and muscle engagement effectively.",
  },
  {
    id: 81,
    name: "Dumbbell Set",
    category: "Fitness",
    image: "src/assets/dumbbel set.webp",
    price: 59.99,
    discountPrice: 49.99,
    description:
      "Achieve your fitness goals with this adjustable dumbbell set, ideal for strength training and home workouts. Compact design for easy storage and versatility.",
  },
  {
    id: 82,
    name: "Track Pants",
    category: "Fashion",
    image: "src/assets/Track Pants.webp",
    price: 29.99,
    description: "Comfortable and breathable fabric.",
  },
  {
    id: 83,
    name: "Mystery Novel",
    category: "Books",
    image: "src/assets/Mystery Novel.webp",
    price: 9.99,
    description:
      "Dive into a thrilling story full of suspense and unexpected twists with this captivating mystery novel. Perfect for fans of crime and detective fiction.",
  },
  {
    id: 84,
    name: "Silicone Baking Mats",
    category: "Home",
    image: "src/assets/Silicone Baking Mats.webp",
    price: 18.99,
    description:
      "Reusable and easy-to-clean baking surface. Non-stick, oven-safe, and eco-friendly. Ideal for baking cookies, pastries, or roasting vegetables without oils or sprays.",
  },
  {
    id: 85,
    name: "Yoga Block",
    category: "Fashion",
    image: "src/assets/Yoga Block.webp",
    price: 15.0,
    description: "Sturdy foam block for yoga poses.",
  },
  {
    id: 86,
    name: "Robot Vacuum",
    category: "Home",
    image: "src/assets/Robot Vacuum.webp",
    price: 119.99,
    discountPrice: 26.19,
    description: "Smart cleaning while you're away.",
  },
  {
    id: 87,
    name: "Laptop Sleeve",
    category: "Electronics",
    image: "src/assets/Laptop Sleeve.webp",
    price: 19.99,
    discountPrice: 17.99,
    description:
      "Protect your laptop with padded sleeve. Slim design fits into backpacks easily. Shock-absorbing material guards against scratches, spills, and minor bumps during travel.",
  },
  {
    id: 88,
    name: "Push-Up Bars",
    category: "Fitness",
    image: "src/assets/Push-Up Bars.webp",
    price: 18.99,
    description: "Enhance your home push-up routine.",
  },
  {
    id: 89,
    name: "Patterned Scarf",
    category: "Accessories",
    image: "src/assets/Patterned Scarf.webp",
    price: 19.99,
    description:
      "Soft, lightweight scarf with vibrant pattern. Versatile accessory for all seasons. Can be styled multiple ways to complement any outfit.",
  },
  {
    id: 90,
    name: "Sunglasses",
    category: "Fashion",
    image: "src/assets/Sunglasses.webp",
    price: 39.99,
    discountPrice: 32.99,
    description:
      "UV protection with stylish frames. These sunglasses combine fashion and functionality, making them an essential accessory for sunny days.",
  },
  {
    id: 91,
    name: "Tote Bag",
    category: "Electronics",
    image: "src/assets/Tote Bag.webp",
    price: 22.5,
    description: "Eco-friendly fabric and spacious interior.",
  },
  {
    id: 92,
    name: "Travel Backpack",
    category: "Fashion",
    image: "src/assets/Travel Backpack.webp",
    price: 59.99,
    description:
      "Spacious and durable backpack for travel. Water-resistant material, multiple compartments, and padded straps offer comfort and organization for long trips or commutes.",
  },
  {
    id: 93,
    name: "Adjustable Ankle Weights",
    category: "Fitness",
    image: "src/assets/Adjustable Ankle Weights.webp",
    price: 23.99,
    description:
      "Increase resistance and improve workouts. Fully adjustable straps ensure a snug fit. Perfect for walking, jogging, or strength training to enhance muscle tone and endurance.",
  },
  {
    id: 94,
    name: "Indoor Plant Set",
    category: "Home",
    image: "src/assets/Indoor Plant Set.webp",
    price: 29.99,
    description:
      "Liven up your space with easy-care greenery. Includes pots and low-maintenance plants that purify air. Great for desks, shelves, or gifting to plant lovers.",
  },
  {
    id: 95,
    name: "Streaming Webcam",
    category: "Electronics",
    image: "src/assets/Streaming Webcam.webp",
    price: 69.99,
    discountPrice: 51.5,
    description:
      "Crystal-clear video for calls and content creation. Features auto-focus, HD resolution, and noise-reducing microphone. Plug-and-play setup for Zoom, Twitch, YouTube, and more.",
  },
  {
    id: 96,
    name: "Pet Bed",
    category: "Home",
    image: "src/assets/Pet Bed.webp",
    price: 39.99,
    description:
      "Cozy sleeping spot for your furry friend. Soft, washable cover and orthopedic foam base provide comfort and support for cats and dogs alike.",
  },
  {
    id: 97,
    name: "Zip-Up Hoodie",
    category: "Fashion",
    image: "src/assets/Zip-Up Hoodie.webp",
    price: 42.99,
    description:
      "Classic style with warmth and comfort. Fleece-lined interior, adjustable hood, and front pockets. Ideal for layering during cool days or lounging indoors.",
  },
  {
    id: 98,
    name: "Wireless Presenter",
    category: "Electronics",
    image: "src/assets/Wireless Presenter.webp",
    price: 24.99,
    description:
      "Seamless presentations with laser pointer control. Includes USB receiver, intuitive buttons, and reliable wireless range. Perfect for business, teaching, or public speaking.",
  },
  {
    id: 99,
    name: "Fashion Beanie",
    category: "Fashion",
    image: "src/assets/Fashion Beanie.webp",
    price: 14.99,
    description:
      "Stay warm with this stylish knit beanie. Stretchy, soft material fits all head sizes. Pairs well with casual or outdoor winter outfits.",
  },
  {
    id: 100,
    name: "Art and Drawing Set",
    category: "Toys",
    image: "src/assets/Art and Drawing Set.webp",
    price: 22.99,
    discountPrice: 21.0,
    description:
      "Complete kit for young artists. Includes colored pencils, markers, crayons, and paper. Encourages creativity and artistic expression.",
  },
  {
    id: 101,
    name: "Smartphone Stand",
    category: "Electronics",
    image: "src/assets/Smartphone Stand.webp",
    price: 10.0,
    discountPrice: 9.0,
    description: "Convenient and adjustable for desk use.",
  },
  {
    id: 102,
    name: "Silver Necklace",
    category: "Accessories",
    image: "src/assets/Silver Necklace.webp",
    price: 59.99,
    description:
      "Handcrafted sterling silver necklace with pendant. Hypoallergenic and tarnish-resistant. Comes in elegant gift box, perfect for special occasions.",
  },
  {
    id: 103,
    name: "Leather Card Holder",
    category: "Accessories",
    image: "src/assets/Leather Card Holder.webp",
    price: 19.99,
    description:
      "Slim leather card holder with multiple slots. RFID blocking technology protects your information. Perfect minimalist alternative to bulky wallets.",
  },
  {
    id: 104,
    name: "Pull-Up Bar",
    category: "Fitness",
    image: "src/assets/Pull-Up Bar.webp",
    price: 45.99,
    description: "Sturdy doorframe bar for upper body workouts.",
  },
  {
    id: 105,
    name: "Desk Lamp",
    category: "Home",
    image: "src/assets/Desk Lamp.webp",
    price: 24.99,
    discountPrice: 23.99,
    description:
      "Illuminate your workspace with this modern LED desk lamp, featuring adjustable brightness for optimal lighting. Energy-efficient and stylish design complements any decor.",
  },
  {
    id: 106,
    name: "Fitness Ball Chair",
    category: "Fitness",
    image: "src/assets/Fitness Ball Chair.webp",
    price: 54.99,
    description:
      "Ergonomic chair alternative that supports posture. Encourages active sitting to engage core muscles, reduce back pain, and promote better alignment during work or relaxation hours.",
  },
  {
    id: 107,
    name: "Noise-Canceling Headphones",
    category: "Electronics",
    image: "src/assets/Noise-Canceling Headphones.webp",
    price: 149.99,
    discountPrice: 126.19,
    description: "Immerse yourself in uninterrupted sound.",
  },
  {
    id: 108,
    name: "Essential Oil Diffuser",
    category: "Home",
    image: "src/assets/Essential Oil Diffuser.webp",
    price: 25.99,
    description: "Add fragrance and calm to your space.",
  },
  {
    id: 109,
    name: "Resistance Tube Set",
    category: "Fitness",
    image: "src/assets/Resistance Tube Set.webp",
    price: 26.99,
    discountPrice: 24.99,
    description:
      "Multiple resistance levels for full-body workouts. Comes with handles, door anchor, and carrying bag. Portable and effective for strength training anywhere, anytime.",
  },
  {
    id: 110,
    name: "Wireless Headphones",
    category: "Electronics",
    image: "src/assets/Wireless Headphones.webp",
    price: 99.99,
    discountPrice: 79.99,
    description:
      "Experience high-quality sound with advanced noise cancellation technology, perfect for music lovers and professionals alike. Enjoy seamless connectivity and long battery life for uninterrupted listening.",
  },
  {
    id: 111,
    name: "Fitness Gloves",
    category: "Fitness",
    image: "src/assets/Fitness Gloves.webp",
    price: 12.99,
    description:
      "Improve grip and protect hands during workouts. Breathable, anti-slip palms reduce friction and calluses. Great for lifting, cycling, and functional training sessions.",
  },
  {
    id: 112,
    name: "Fitness Tracker Pro",
    category: "Fitness",
    image: "src/assets/Fitness Tracker Pro.webp",
    price: 89.99,
    discountPrice: 81.5,
    description:
      "Advanced activity monitor with heart rate tracking and sleep analysis. Water-resistant with a vibrant touchscreen display.",
  },
  {
    id: 113,
    name: "Kindle Case",
    category: "Electronics",
    image: "src/assets/Kindle Case.webp",
    price: 15.99,
    description:
      "Protect your e-reader with style. Slim, durable, and lightweight with magnetic closure. Prevents scratches, dents, and dust while keeping your Kindle safe and secure.",
  },
  {
    id: 114,
    name: "Rain Jacket",
    category: "Fashion",
    image: "src/assets/Rain Jacket.webp",
    price: 69.99,
    description:
      "Water-resistant and windproof for rainy days. Lightweight and breathable design with adjustable hood and pockets. Keeps you dry and stylish during unpredictable weather.",
  },
  {
    id: 115,
    name: "Leather Wallet",
    category: "Fashion",
    image: "src/assets/Leather Wallet.webp",
    price: 39.99,
    description:
      "Slim and stylish genuine leather wallet. Multiple card slots and a secure money clip. Timeless design for everyday use or as a gift option.",
  },
  {
    id: 116,
    name: "LED Strip Lights",
    category: "Fashion",
    image: "src/assets/LED Strip Lights.webp",
    price: 27.5,
    description: "Colorful lighting for ambiance and mood.",
  },
  {
    id: 117,
    name: "Air Purifier",
    category: "Home",
    image: "src/assets/Air Purifier.webp",
    price: 119.99,
    discountPrice: 111.99,
    description:
      "Clean air with advanced filtration system. Removes dust, allergens, and odors. Whisper-quiet motor and sleep mode make it ideal for bedrooms and living spaces.",
  },
  {
    id: 118,
    name: "Men's T-Shirt",
    category: "Fashion",
    image: "src/assets/mens tshirt.webp",
    price: 19.99,
    description:
      "Upgrade your wardrobe with this soft cotton t-shirt, available in a variety of colors to suit any style. Perfect for casual outings or lounging at home.",
  },
  {
    id: 119,
    name: "Plush Teddy Bear",
    category: "Toys",
    image: "src/assets/Plush Teddy Bear.webp",
    price: 19.99,
    description:
      "Soft and huggable teddy bear made from premium materials. Hypoallergenic stuffing and child-safe eyes. Perfect bedtime companion.",
  },
  {
    id: 120,
    name: "Women's Handbag",
    category: "Fashion",
    image: "src/assets/Women's Handbag.webp",
    price: 49.99,
    description:
      "Carry your essentials in style with this elegant and spacious handbag, perfect for everyday use. Features multiple compartments for better organization and convenience.",
  },
  {
    id: 121,
    name: "Running Armband",
    category: "Fitness",
    image: "src/assets/Running Armband.webp",
    price: 11.99,
    description:
      "Secure your phone while jogging or at the gym. Adjustable strap, sweat-resistant material, and clear screen window for full device access on the go.",
  },
  {
    id: 122,
    name: "Water Bottle",
    category: "Home",
    image: "src/assets/Water Bottle.webp",
    price: 30.0,
    description: "Insulated bottle to keep drinks cold or hot.",
  },
  {
    id: 123,
    name: "Electric Toothbrush",
    category: "Electronics",
    image: "src/assets/Electric Toothbrush.webp",
    price: 49.99,
    description: "Deep clean with advanced brushing technology.",
  },
  {
    id: 124,
    name: "Fitness Tracker",
    category: "Fitness",
    image: "src/assets/Fitness Tracker.webp",
    price: 59.99,
    discountPrice: 57.99,
    description: "Monitor steps, heart rate, and sleep.",
  },
  {
    id: 125,
    name: "Aromatherapy Set",
    category: "Home",
    image: "src/assets/Aromatherapy Set.webp",
    price: 32.99,
    description:
      "Relax with essential oils and calming scents. Includes diffuser and therapeutic-grade oils. Promotes sleep, stress relief, and mental clarity through natural fragrance.",
  },
  {
    id: 126,
    name: "Notebook Set",
    category: "Books",
    image: "src/assets/Notebook Set.webp",
    price: 14.99,
    description:
      "Stylish notebooks for journaling or notes. Includes various page types, sturdy covers, and smooth paper ideal for writing, sketching, planning, or organizing your daily thoughts.",
  },
  {
    id: 127,
    name: "Dinosaur Action Figures",
    category: "Toys",
    image: "src/assets/Dinosaur Action Figures.webp",
    price: 18.99,
    discountPrice: 11.99,
    description:
      "Realistic dinosaur figures set with 12 different species. Educational cards included with fun facts about each dinosaur. Durable plastic construction.",
  },
  {
    id: 128,
    name: "Wireless Game Controller",
    category: "Electronics",
    image: "src/assets/Wireless Game Controller.webp",
    price: 49.99,
    discountPrice: 45.5,
    description:
      "Precision control for console and PC gaming. Features ergonomic grip, responsive buttons, long-range connectivity, and customizable settings to enhance your gaming experience.",
  },
  {
    id: 129,
    name: "Gaming Keyboard",
    category: "Electronics",
    image: "src/assets/Gaming Keyboard.webp",
    price: 79.99,
    description: "RGB backlit keyboard for gaming enthusiasts.",
  },
  {
    id: 130,
    name: "Action Camera",
    category: "Electronics",
    image: "src/assets/Action Camera.webp",
    price: 99.99,
    discountPrice: 92.99,
    description: "Capture adventures in high-definition.",
  },

  {
    id: 131,
    name: "Cycling Handlebar Grips",
    category: "Accessories",
    image: "src/assets/1Pair Silicone Cycling Bicycle Grips.webp",
    price: 14.99,
    discountPrice: 12.99,
    description:
      "Ergonomic silicone handlebar grips for better control and comfort. Non-slip design with shock-absorbing properties reduces hand fatigue on long rides. Easy to install on most standard handlebars.",
  },
  {
    id: 132,
    name: "Luxury Wrist Watch",
    category: "Accessories",
    image: "src/assets/Luxury Wrist Watch.webp",
    price: 129.99,
    description:
      "Sophisticated timepiece with premium craftsmanship. Features Japanese quartz movement, scratch-resistant sapphire crystal, and genuine leather band. Water-resistant up to 50 meters for everyday elegance.",
  },
  {
    id: 133,
    name: "Multi-function Tote",
    category: "Accessories",
    image: "src/assets/Multi-function Tote.webp",
    price: 39.99,
    discountPrice: 34.99,
    description:
      "Stylish and functional tote bag made from sustainable materials. Features multiple compartments, laptop sleeve, and water bottle holder. Perfect for work, school, or weekend getaways.",
  },
  {
    id: 134,
    name: "Winter Fashion Set",
    category: "Accessories",
    image: "src/assets/Winter Fashion Set.webp",
    price: 49.99,
    description:
      "Complete winter accessories set including matching scarf, beanie, and gloves. Made from premium knit material that's both warm and soft. Available in multiple color combinations to match any outfit.",
  },
  {
    id: 135,
    name: "Premium Accessories Collection",
    category: "Accessories",
    image: "src/assets/Premium Accessories Collection.webp",
    price: 89.99,
    discountPrice: 79.99,
    description:
      "Curated gift set of luxury accessories including wallet, keychain, and card holder. Crafted from genuine leather with elegant stitching and design. Perfect for gifting or treating yourself to everyday luxury.",
  },
  {
    id: 136,
    name: "Interactive Learning Tablet",
    category: "Toys",
    image: "src/assets/Interactive Learning Tablet.webp",
    price: 45.99,
    discountPrice: 39.99,
    description:
      "Educational tablet designed for children ages 3-12. Features learning games, creative activities, and parental controls. Durable, kid-friendly design with bright colors and responsive touch screen.",
  },
  {
    id: 137,
    name: "Plush Animal Collection",
    category: "Toys",
    image: "src/assets/Plush Animal Collection.webp",
    price: 34.99,
    description:
      "Set of 5 adorable plush animals including lion, elephant, giraffe, monkey, and penguin. Made with super-soft hypoallergenic materials safe for all ages. Perfect for cuddling and imaginative play.",
  },
  {
    id: 138,
    name: "Wooden Train Set",
    category: "Toys",
    image: "src/assets/Wooden Train Set.webp",
    price: 29.99,
    discountPrice: 24.99,
    description:
      "Classic wooden train set with tracks, trains, and accessories. Compatible with major wooden railway systems. Encourages creativity, fine motor skills, and problem-solving through interactive play.",
  },
  {
    id: 139,
    name: "Space Explorer Kit",
    category: "Toys",
    image: "src/assets/Space Explorer Kit.webp",
    price: 32.99,
    description:
      "Astronomy kit for budding space enthusiasts. Includes telescope, star charts, planet models, and space-themed activities. Educational gift that inspires curiosity about the universe and science.",
  },
  {
    id: 140,
    name: "Construction Vehicle Set",
    category: "Toys",
    image: "src/assets/Construction Vehicle Set.webp",
    price: 27.99,
    discountPrice: 22.99,
    description:
      "Set of 6 durable construction vehicles including dump truck, bulldozer, crane, and more. Made from high-quality materials with realistic details and moving parts. Great for sandbox play and developing motor skills.",
  },
];

export const products = rawProducts.map((product) => {
  const resolvedImage = resolveProductImage(product.image || "");
  const imageToUse = resolvedImage || product.image || "";

  return {
    ...product,
    image: imageToUse,
    imageUrl: product.imageUrl || imageToUse,
    imgURL: product.imgURL || imageToUse,
  };
});
