export const RECIPES = [
  {
    id: 1, name: "Latte", label: "Classic", strength: "Mild", time: "5 min",
    shots: 1, temp: "93°C", yield_ml: 240, yield_oz: 8,
    tags: ["Espresso", "Milk-based", "Hot"],
    img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=700&h=360&fit=crop&crop=center",
    imgSm: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=180&h=180&fit=crop&crop=center",
    ingredients_ml: [
      { name: "Espresso", amount: "30ml (1 shot)" },
      { name: "Steamed milk", amount: "180ml" },
      { name: "Milk foam", amount: "Thin layer" },
    ],
    ingredients_oz: [
      { name: "Espresso", amount: "1 oz (1 shot)" },
      { name: "Steamed milk", amount: "6 oz" },
      { name: "Milk foam", amount: "Thin layer" },
    ],
    steps: [
      { title: "Pull your shot", desc: "Extract a single shot of espresso into your cup. Aim for 25–30 seconds and 30ml yield." },
      { title: "Steam the milk", desc: "Steam 180ml of cold milk to 65°C. Keep the wand just below the surface for silky microfoam." },
      { title: "Pour & finish", desc: "Pour the steamed milk over the espresso in a slow, steady stream. Finish with a thin layer of foam." },
    ],
    tip: "For the smoothest latte, use whole milk and keep your steam wand at a slight angle. The swirling motion creates creamier, more uniform microfoam.",
  },
  {
    id: 2, name: "Cappuccino", label: "Frothy", strength: "Mild", time: "6 min",
    shots: 1, temp: "93°C", yield_ml: 180, yield_oz: 6,
    tags: ["Espresso", "Milk-based", "Hot"],
    img: "https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=700&h=360&fit=crop&crop=center",
    imgSm: "https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=180&h=180&fit=crop&crop=center",
    ingredients_ml: [
      { name: "Espresso", amount: "30ml (1 shot)" },
      { name: "Steamed milk", amount: "60ml" },
      { name: "Milk foam", amount: "60ml dry foam" },
    ],
    ingredients_oz: [
      { name: "Espresso", amount: "1 oz (1 shot)" },
      { name: "Steamed milk", amount: "2 oz" },
      { name: "Milk foam", amount: "2 oz dry foam" },
    ],
    steps: [
      { title: "Pull your shot", desc: "Extract a single espresso shot. Aim for 25–30 seconds extraction time." },
      { title: "Steam for foam", desc: "Steam milk with the wand near the surface to create thick, dry foam. Target 65°C." },
      { title: "Layer & serve", desc: "Pour steamed milk over espresso, then spoon dry foam generously on top." },
    ],
    tip: "The key to a great cappuccino is equal parts espresso, steamed milk, and foam. Don't rush the foam — let it build slowly.",
  },
  {
    id: 3, name: "Flat White", label: "Smooth", strength: "Bold", time: "5 min",
    shots: 2, temp: "93°C", yield_ml: 150, yield_oz: 5,
    tags: ["Espresso", "Milk-based", "Hot"],
    img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&h=360&fit=crop&crop=center",
    imgSm: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=180&h=180&fit=crop&crop=center",
    ingredients_ml: [
      { name: "Espresso", amount: "60ml (2 shots)" },
      { name: "Microfoam milk", amount: "90ml" },
    ],
    ingredients_oz: [
      { name: "Espresso", amount: "2 oz (2 shots)" },
      { name: "Microfoam milk", amount: "3 oz" },
    ],
    steps: [
      { title: "Pull a double shot", desc: "Extract two ristretto shots for a more concentrated, sweeter base." },
      { title: "Steam microfoam", desc: "Steam 90ml milk to a velvety, glossy microfoam. No large bubbles." },
      { title: "Pour tight", desc: "Pour milk in a tight, controlled stream to integrate fully with the espresso." },
    ],
    tip: "Use a smaller cup than you'd expect — a flat white is meant to be strong and concentrated. Ristretto shots make all the difference.",
  },
  {
    id: 4, name: "Cortado", label: "Bold", strength: "Bold", time: "4 min",
    shots: 2, temp: "93°C", yield_ml: 90, yield_oz: 3,
    tags: ["Espresso", "Milk-based", "Hot"],
    img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700&h=360&fit=crop&crop=center",
    imgSm: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=180&h=180&fit=crop&crop=center",
    ingredients_ml: [
      { name: "Espresso", amount: "60ml (2 shots)" },
      { name: "Steamed milk", amount: "60ml" },
    ],
    ingredients_oz: [
      { name: "Espresso", amount: "2 oz (2 shots)" },
      { name: "Steamed milk", amount: "2 oz" },
    ],
    steps: [
      { title: "Pull a double shot", desc: "Extract two espresso shots directly into a small glass." },
      { title: "Steam lightly", desc: "Steam milk to 60°C with minimal foam — just enough to cut the acidity." },
      { title: "Cut & serve", desc: "Pour equal parts milk directly over the espresso. No stirring needed." },
    ],
    tip: "The word cortado means 'cut' in Spanish — the milk cuts the espresso's acidity without masking the flavor. Keep the ratio equal.",
  },
  {
    id: 5, name: "Macchiato", label: "Intense", strength: "Extra Bold", time: "4 min",
    shots: 2, temp: "93°C", yield_ml: 75, yield_oz: 2.5,
    tags: ["Espresso", "Milk-based", "Hot"],
    img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=700&h=360&fit=crop&crop=center",
    imgSm: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=180&h=180&fit=crop&crop=center",
    ingredients_ml: [
      { name: "Espresso", amount: "60ml (2 shots)" },
      { name: "Milk foam", amount: "Small dollop" },
    ],
    ingredients_oz: [
      { name: "Espresso", amount: "2 oz (2 shots)" },
      { name: "Milk foam", amount: "Small dollop" },
    ],
    steps: [
      { title: "Pull a double shot", desc: "Extract two strong espresso shots into a small demitasse cup." },
      { title: "Foam a splash", desc: "Steam a small amount of milk to create dense, thick foam only." },
      { title: "Mark the top", desc: "Spoon a small dollop of foam onto the espresso — just enough to 'mark' it." },
    ],
    tip: "Macchiato means 'stained' or 'marked' — the foam is just a hint, not a full milk addition. Less is more here.",
  },
  {
    id: 6, name: "Americano", label: "Pure", strength: "Extra Bold", time: "3 min",
    shots: 2, temp: "93°C", yield_ml: 240, yield_oz: 8,
    tags: ["Espresso", "Black", "Hot"],
    img: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=700&h=360&fit=crop&crop=center",
    imgSm: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=180&h=180&fit=crop&crop=center",
    ingredients_ml: [
      { name: "Espresso", amount: "60ml (2 shots)" },
      { name: "Hot water", amount: "120ml" },
    ],
    ingredients_oz: [
      { name: "Espresso", amount: "2 oz (2 shots)" },
      { name: "Hot water", amount: "4 oz" },
    ],
    steps: [
      { title: "Heat your water", desc: "Heat water to just off boil — around 93°C. Pre-heat your cup too." },
      { title: "Pull a double shot", desc: "Extract two espresso shots directly into your pre-heated cup." },
      { title: "Add water", desc: "Pour hot water over the espresso slowly. Adjust ratio to taste." },
    ],
    tip: "Always add water to espresso, not the other way around — this preserves the crema on top for a better experience.",
  },
];

export const STRENGTH_ORDER = { "Mild": 1, "Bold": 2, "Extra Bold": 3 };
