export var Countries = (arrayDefault, showContinent) => {
  var finalArray = [];
  if (showContinent !== true) {
    if (arrayDefault?.length > 0) {
      finalArray = arrayDefault;
    } else {
      finalArray = [];
    }
  } else {
    if (arrayDefault?.length > 0) {
      arrayDefault?.forEach((element) => {
        const dObj = { name: element?.continent, countries: [element] };
        finalArray.push(dObj);
      });
      const result = finalArray.reduce((acc, { name, countries }) => {
        acc[name] = acc[name] ? acc[name] : { name: name, countries: [] };
        if (Array.isArray(countries))
          // if it's array type then concat
          acc[name].countries = acc[name].countries.concat(countries);
        else acc[name].value.push(countries);
        return acc;
      }, {});
      finalArray = Object.values(result);
    } else {
      finalArray = [];
    }
  }
  finalArray.sort((a, b) => (a.name > b.name ? 1 : -1));
  //finalArray.forEach(item => item?.zones?.sort((a,b) => a.name > b.name ? 1: -1));

  return finalArray;
};
