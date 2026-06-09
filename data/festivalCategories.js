export const genres = [
    { name: "Action", id: "28" },
    { name: "Adventure", id: "12" },
    { name: "Animation", id: "16" },
    { name: "Comedy", id: "35" },
    { name: "Crime", id: "80" },
    { name: "Drama", id: "18" },
    { name: "Fantasy", id: "14" },
    { name: "Horror", id: "27" },
    { name: "Romance", id: "10749" },
    { name: "Sci-Fi", id: "878" },
    { name: "Thriller", id: "53" },
  ];
  
  export const decades = [
    { label: "1970s", startYear: 1970, endYear: 1979 },
    { label: "1980s", startYear: 1980, endYear: 1989 },
    { label: "1990s", startYear: 1990, endYear: 1999 },
    { label: "2000s", startYear: 2000, endYear: 2009 },
    { label: "2010s", startYear: 2010, endYear: 2019 },
    { label: "2020s", startYear: 2020, endYear: 2029 },
  ];
  
  export function getRandomFestivalSlots(amount = 6) {
    const slots = [];
  
    while (slots.length < amount) {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const decade = decades[Math.floor(Math.random() * decades.length)];
  
      const alreadyExists = slots.some(
        (slot) => slot.genre.name === genre.name && slot.decade.label === decade.label
      );
  
      if (!alreadyExists) {
        slots.push({
          id: crypto.randomUUID(),
          genre,
          decade,
        });
      }
    }
  
    return slots;
  }