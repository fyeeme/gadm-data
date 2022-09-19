/**
 * https://gadm.org/downlodenoad_country.html
 * level 2
 */
import canFile from "./gadm41_CAN_2.json" assert { type: "json" };
import usaFile from "./gadm41_USA_2.json" assert { type: "json" };
import chnFile from "./gadm41_CHN_2.json" assert { type: "json" };
import twnFile from "./gadm41_TWN_2.json" assert { type: "json" };

import canData from "./data/data_can.json" assert { type: "json" };
import usaData from "./data/data_usa.json" assert { type: "json" };
import chnData from "./data/data_chn.json" assert { type: "json" };
import twnData from "./data/data_twn.json" assert { type: "json" };

const parseDraftData = async (file, outputFile) => {
  const countryData = file.features
    .map((item) => {
      delete item?.geometry;
      return item;
    })
    .filter((item) => item.properties.ENGTYPE_2 != "CensusDivision");

  await Deno.writeTextFile(outputFile, JSON.stringify(countryData));
};

// 解析原始数据
// parseDraftData(canFile, "./data/data_can.json");
// parseDraftData(usaFile, "./data/data_usa.json");
// parseDraftData(chnFile, "./data/data_chn.json");
// parseDraftData(twnFile, "./data/data_twn.json");

const writeProvinceData = (file, target) => {
  const country = file
    .map((item) => ({ name: item.properties.COUNTRY }))
    .shift();

  target.name = country.name;
  const provinces = file.reduce((pre, cur) => {
    pre[cur.properties.NAME_1] = {
      name: cur.properties.NAME_1,
      nl_name: cur.properties.NL_NAME_1.split("|").at(-1),
    };
    return pre;
  }, {});

  target.provinces = Object.values(provinces);
};

const writeCityData = (file, target) => {
  target.provinces = target.provinces
    .map((item) => {
      item.cities = file.reduce((pre, cur) => {
        if (cur.properties.NAME_2 && cur.properties.NAME_1 == item.name) {
          pre[cur.properties.NAME_2] = {
            name: cur.properties.NAME_2,
            nl_name: cur.properties.NL_NAME_2,
            var_name: cur.properties.VARNAME_2,
          };
        }
        return pre;
      }, {});
      return item;
    })
    .map((item) => {
      item.cities = Object.values(item.cities);
      return item;
    });
  console.log(target);
};

// // 获取目标数据 加拿大
// const canCountry = {};
// writeProvinceData(canData, canCountry);
// writeCityData(canData, canCountry);
// // 写入文件
// // await Deno.writeTextFile("data/cities_can.json", JSON.stringify(canCountry));
// // console.log(canCountry);

// // 获取目标数据 美国
// const usaCountry = {};
// writeProvinceData(usaData, usaCountry);
// writeCityData(usaData, usaCountry);
// // 写入文件
// await Deno.writeTextFile("data/cities_usa.json", JSON.stringify(usaCountry));
// // console.log(usaCountry);

// 获取目标数据 中国
const chnCountry = {};
writeProvinceData(chnData, chnCountry);
writeCityData(chnData, chnCountry);
// 写入文件
await Deno.writeTextFile("data/cities_chn.json", JSON.stringify(chnCountry));
// console.log(usaCountry);

// 获取目标数据 中国台湾
const twn = {};
writeProvinceData(twnData, twn);
writeCityData(twnData, twn);
// 写入文件
await Deno.writeTextFile("data/cities_twn.json", JSON.stringify(twn));
// console.log(usaCountry);
