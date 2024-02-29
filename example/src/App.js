import "./App.css";
import React, { useEffect, useState } from "react";
import { NestedSelect } from "deka-tree-select";

const App = () => {
  const [response, setResponse] = useState([]);
  const [d, setD] = useState(false);

  const selectedDat = [
    {
      name: "furkan",
      disabled: false,
      value: "123",
      subData: [],
    },
  ];
  const data = [
    {
      name: "furkan",
      disabled: false,
      value: "123",
      subData: [
        {
          name: "aaaa",
          disabled: false,
          value: "31",
        },
        {
          name: "bbb",
          disabled: false,
          value: "69",
        },
      ],
    },
    {
      name: "okan",
      value: "456",
      disabled: false,
      subData: [
        {
          name: "ccc",
          disabled: false,
          value: "32",
        },
        {
          name: "ddd",
          disabled: false,
          value: "45",
        },
      ],
    },
    {
      name: "hakan",
      value: "12121",
      disabled: false,
      subData: [],
    },
    {
      name: "tarık",
      value: "2432",
      disabled: false,
      subData: [],
    },
    {
      name: "mehmet",
      value: "454353",
      disabled: false,
      subData: [],
    },
    {
      name: "yunus",
      value: "43643643",
      disabled: false,
      subData: [],
    },
    {
      name: "burak",
      value: "5774",
      disabled: false,
      subData: [],
    },
  ];
  const callbackFUnction = (value) => {
    console.log("value", value);
    setResponse(value);
  };

  return (
    <div className="App">
      <hr className="hr_dm" />
      <h1>Multi Nested Select Component</h1>
      <div className="center-component">
        <NestedSelect
          buttonContent="Save Selected"
          enableButton={true}
          state={true}
          width={450}
          height={200}
          leading={true}
          disable={d}
          chip={true}
          chipCount={10}
          //   error={erTg}
          //   helperText="error occured"
          placeholderCtx={false}
          trailing={true}
          trailingIcon={true}
          inputClass="myCustom_text"
          continent={false}
          omitSelected={false}
          expandChip={true}
          selectedValue={selectedDat}
          showCustomList={data}
          selectAllOption={true}
          onViewmore={(v) => alert("viewed")}
          onChipDelete={(v) => alert("deleted")}
          onChange={(v) => console.log("okay", v)}
          callback={(val) => callbackFUnction(val)}
        />
      </div>
      <h1>Selected Country-state</h1>
      <p>
        **(Not part of package only for showing response getting from package)
      </p>
      <div>
        <table className="center-table">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Country Name</th>
              <th>Country Code</th>
              <th>State</th>
              <th>State code</th>
            </tr>
          </thead>
          <tbody>
            {response &&
              response.map((data, i) => (
                <tr key={i}>
                  <td>{i + 1} .</td>
                  <td>{data.name}</td>
                  <td>{data.value}</td>
                  <td>
                    {data.subData?.length > 0
                      ? data.subData.map((item, j) => (
                          <tr key={j}>
                            <td>
                              {j + 1}. {item.name}
                            </td>
                          </tr>
                        ))
                      : "-"}
                  </td>
                  <td>
                    {data.subData?.length > 0
                      ? data.subData.map((item, j) => (
                          <tr key={j}>
                            <td>{item.value}</td>
                          </tr>
                        ))
                      : "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
