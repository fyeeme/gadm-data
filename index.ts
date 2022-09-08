/**
 * https://gadm.org/downlodenoad_country.html
 * level 2
 */
// import file from "./gadm41_CAN_2.json" assert { type: "json" };
// console.log();

// const countryData = file.features
//   .map((item) => {
//     delete item.geometry;
//     return item;
//   })
//   .filter((item) => item.properties.ENGTYPE_2 != "CensusDivision");

// await Deno.writeTextFile("./data_can.json", JSON.stringify(countryData));

import file from "./gadm41_USA_2.json" assert { type: "json" };
console.log();

const countryData = file.features
  .map((item) => {
    delete item.geometry;
    return item;
  })
  .filter((item) => item.properties.ENGTYPE_2 != "CensusDivision");

await Deno.writeTextFile("./data_usa.json", JSON.stringify(countryData));
